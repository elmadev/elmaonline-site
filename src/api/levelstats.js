import express from 'express';
import * as _ from 'lodash';
import moment from 'moment';
import { getPerfTracker, aggregateTrackers } from 'utils/perf';
import { Op } from 'sequelize';
import sequelize from 'data/sequelize';
import { LevelStats, LevelStatsUpdate, Level, Time } from '../data/models';
import * as PlayStats from '../data/models/PlayStats';

const router = express.Router();

// checks the current state of the database and processes the next X
// times, resulting in updates to levelStats and levelStatsUpdates.
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

  const timesByLevel = _.groupBy(times, 'LevelIndex');

  // ids mapped to LevelStats objects, or null
  const exLevelStats = await LevelStats.mapIds(Object.keys(timesByLevel));

  track('get_ex_stats');

  const trackers = [];
  const updates = [];

  _.forEach(timesByLevel, (levelTimes, LevelIndex) => {
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
    transaction = await sequelize.transaction();

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
        countExLevels: _.values(exLevelStats).filter(l => l !== null).length,
        countNotExLevels: _.values(exLevelStats).filter(l => l === null).length,
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
  let moreExist = true;

  do {
    // eslint-disable-next-line no-await-in-loop
    [update, moreExist] = await doNext(batchSize);

    updates.push(update);
  } while (moreExist);

  return updates;
};

// useful for dev/testing
router.get('/mock-update/:LevelIndex', async (req, res) => {
  const LevelIndex = +req.params.LevelIndex;

  const times = await Time.findAll({
    where: {
      LevelIndex,
    },
    order: [['TimeIndex', 'ASC']],
  });

  const [update, perf] = LevelStats.buildUpdate(times, null, null);

  const q = `
    SELECT Finished, COUNT(*), MIN(Time), SUM(Time), SUM(Apples), SUM(BrakeTime), SUM(Turn), SUM(LeftVolt), SUM(SuperVolt), MAX(MaxSpeed), MAX(Driven)
    from time
    WHERE LevelIndex = ?
    GROUP BY Finished
    HAVING Finished IN ('F', 'E', 'D')
    `;

  const [timeAggregates] = await sequelize.query(q, {
    replacements: [LevelIndex],
  });

  res.json({
    times: times.length,
    level: await Level.findOne({
      attributes: ['LevelIndex', 'LevelName', 'LongName', 'Locked'],
      where: { LevelIndex, Locked: 0 },
    }),
    timeAggregates,
    update,
    perf,
  });
});

export default router;
