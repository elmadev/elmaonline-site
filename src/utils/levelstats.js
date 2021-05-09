// checks the current state of the database and processes the next X
// times, resulting in updates to levelStats and levelStatsUpdates.
import { forEach, groupBy, values } from 'lodash';
import moment from 'moment';
import { Op } from 'sequelize';
import connection from 'data/sequelize';
import * as PlayStats from '../data/models/PlayStats';
import { LevelStats, LevelStatsUpdate } from '../data/models';
import { aggregateTrackers, getPerfTracker } from './perf';

export const doNext = async limit => {
  const track = getPerfTracker();

  const last = await LevelStatsUpdate.getLastTimeIndexProcessed();

  const [times, coverage, moreTimesExist] = await PlayStats.getTimesInInterval(
    last + 1,
    limit,
    true,
    true,
  );

  track('get_times');

  const timesByLevel = groupBy(times, 'LevelIndex');

  // ids mapped to LevelStats objects, or null
  const exLevelStats = await LevelStats.mapIds(Object.keys(timesByLevel));

  track('get_ex_stats');

  const trackers = [];
  const updates = [];

  forEach(timesByLevel, (levelTimes, LevelIndex) => {
    const [update, perfTracker] = LevelStats.buildUpdate(
      levelTimes,
      exLevelStats[LevelIndex],
      coverage[1],
    );

    trackers.push(perfTracker);
    updates.push(update);
  });

  track('build_updates');

  let transaction;

  try {
    // get transaction
    transaction = await connection.transaction();

    await LevelStats.bulkCreate(updates, {
      transaction,
      updateOnDuplicate: LevelStats.getUpdateOnDuplicateKeys(),
    });

    track('bulk_upsert');

    const levelStatsUpdate = await LevelStatsUpdate.create({
      TimeIndex0: coverage[0],
      TimeIndex1: coverage[1],
      TimeStart: moment().unix(),
      Debug: JSON.stringify({
        moreTimesExist,
        lastTimeIndexProcessed: last,
        maxPossibleCountTimes: limit,
        actualCountTimes: times.length,
        countLevels: Object.keys(exLevelStats).length,
        countExLevels: values(exLevelStats).filter(l => l !== null).length,
        countNotExLevels: values(exLevelStats).filter(l => l === null).length,
        buildUpdatesPerf: aggregateTrackers(trackers),
        // useful? Idk
        // levelIds: Object.keys(levelStats).map(k => +k),
      }),
    });

    // commit
    await transaction.commit();

    track('after_commit');

    // add performance tracker (after commit)
    await levelStatsUpdate.updateDebug(prevValue => {
      // eslint-disable-next-line no-param-reassign
      prevValue.perf = track(null);
    }, true);

    return [levelStatsUpdate, moreTimesExist];
  } catch (err) {
    // catch exceptions thrown after the commit. If we commit and rollback,
    // we'll get a "Transaction cannot be rolled back because it has
    // been finished with state: commit" error. So catch and ignore
    // that, and then throw the original exception that caused it.
    try {
      await transaction.rollback();
    } catch (err2) {
      throw err;
    }

    throw err;
  }
};

// delete and re-build everything
export const doAll = async batchSize => {
  const updates = [];

  const maxTimeIndex = await PlayStats.getMaxTimeIndex();

  await LevelStatsUpdate.destroy({
    where: {
      LevelStatsUpdateIndex: {
        [Op.gt]: 0,
      },
    },
  });

  await LevelStats.destroy({
    where: {
      LevelIndex: {
        [Op.gt]: 0,
      },
    },
  });

  let update;
  let cont = true;
  let moreExist = false;

  do {
    // eslint-disable-next-line no-await-in-loop
    [update, moreExist] = await doNext(batchSize);

    updates.push(update);

    // more times could be driven during each process,
    // so don't go over the max time index that existed
    // at the start of doAll.
    cont = moreExist && update.TimeIndex1 < maxTimeIndex;
  } while (cont);

  return updates;
};
