import Sequelize, { Model } from 'sequelize';
import { includes, range, toPairs, uniqBy, isEmpty } from 'lodash';
import * as PlayStats from './PlayStats';
import sequelize from '../sequelize';
import { getPerfTracker } from '../../utils/perf';
import { jsonAccessors } from '../../utils/sequelize';

// store this many top times.
const countTopXTimes = 10;

// an array of arrays.
// if you slice and flatten, you'll get a one dimensional array of
// specified length. (eg. usage: query level stats with only top 3 times)
export const topXTimesColumns = range(0, countTopXTimes).map(i => {
  return [
    `TopTime${i}`,
    `TopKuskiIndex${i}`,
    `TopTimeIndex${i}`,
    `TopDriven${i}`,
  ];
});

export const ddl = {
  LevelStatsIndex: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  LevelIndex: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  ...PlayStats.getCommonCols(),

  // ie. TopKuskiIndex0, TopTime0 ... TopTimeIndex9, TopDriven9
  // 40 columns
  ...(() => {
    const ret = {};

    range(0, countTopXTimes).forEach(x => {
      ret[`TopTime${x}`] = {
        type: Sequelize.INTEGER,
        allowNull: true,
      };

      ret[`TopKuskiIndex${x}`] = {
        type: Sequelize.INTEGER,
        allowNull: true,
      };

      ret[`TopTimeIndex${x}`] = {
        type: Sequelize.INTEGER,
        allowNull: true,
      };

      ret[`TopDriven${x}`] = {
        type: Sequelize.INTEGER,
        allowNull: true,
      };
    });

    return ret;
  })(),

  BattleTopTime: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  BattleTopKuskiIndex: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  BattleTopTimeIndex: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  BattleTopDriven: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  BattleTopBattleIndex: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  // JSON array
  LeaderHistory: {
    type: Sequelize.TEXT('long'),
    allowNull: true,
    ...jsonAccessors('LeaderHistory', []),
  },
  LeaderCount: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  UniqueLeaderCount: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  KuskiCountF: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  KuskiCountAll: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  // need all IDs stored to build counts incrementally
  KuskiIdsF: {
    type: Sequelize.TEXT,
    allowNull: true,
    ...jsonAccessors('KuskiIdsF', []),
  },
  KuskiIdsAll: {
    type: Sequelize.TEXT,
    allowNull: true,
    ...jsonAccessors('KuskiIdsAll', []),
  },

  // level stats should agree with the time table starting
  // from TimeIndex 1 up until this point.
  LastPossibleTimeIndex: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  // virtual column returning an array of objects.
  // it's much easier to work with top times like this and this
  // should probably be passed to the front-end whenever possible.
  TopXTimes: {
    type: Sequelize.VIRTUAL,
    get() {
      return range(0, countTopXTimes).map(i => {
        // must have same indexes as times table, or code elsewhere will break.
        return {
          KuskiIndex: this.getDataValue(`TopKuskiIndex${i}`),
          Time: this.getDataValue(`TopTime${i}`),
          TimeIndex: this.getDataValue(`TopTimeIndex${i}`),
          Driven: this.getDataValue(`TopDriven${i}`),
        };
      });
    },
  },
};

// array of non virtual column names
const cols = toPairs(ddl)
  .filter(arr => arr[1].type !== Sequelize.VIRTUAL)
  .map(arr => arr[0]);

class LevelStats extends Model {
  // map an array of ids to existing instances or null
  // returns an object, indexed by ID.
  static mapIds = async levelIds => {
    const records = await LevelStats.findAll({
      where: {
        LevelIndex: levelIds,
      },
    });

    return PlayStats.mapIdsToRecordsOrNull(levelIds, records, 'LevelIndex');
  };

  // useful for using .bulkCreate() to upsert
  static getUpdateOnDuplicateKeys = () => {
    return cols.filter(
      key => !includes(['LevelStatsIndex', 'LevelIndex'], key),
    );
  };

  /**
   * Build the record to get inserted into the database.
   *
   * @param {Array<Object>} times - times that share the same level index
   * @param {LevelStats|null} prev - existing LevelStats row
   * @param LastPossibleTimeIndex
   * @returns {Array} - updates (array of objects), and performance data
   */
  static buildUpdate = (times, prev, LastPossibleTimeIndex) => {
    const track = getPerfTracker('buildUpdate');

    // eslint-disable-next-line no-param-reassign
    prev = isEmpty(prev) ? null : prev;

    const aggs = PlayStats.aggregateTimes(times, prev);

    track('aggregateTimes');

    let update = PlayStats.buildCommonUpdate(aggs, prev);

    track('commonUpdate');

    // necessary for upsert later on
    if (prev !== null) {
      update.LevelStatsIndex = prev.LevelStatsIndex;
    }

    // array ready to be serialized
    const LeaderHistory = PlayStats.mergeLeaderHistory(times, prev);

    track('leaderHistory');

    // <Array<Object>>
    const newTopTimes = PlayStats.mergeTopTimes(times, prev, countTopXTimes);

    track('topTimes');

    // not a perf concern
    const [KuskiIdsAll, KuskiIdsF] = PlayStats.mergeKuskis(times, prev);

    // object with 5 entries
    const battleWinnerColumns = PlayStats.mergeBattleWinner(times, prev);

    track('battleWinner');

    // merge cols
    update = Object.assign(update, {
      LevelIndex: prev !== null ? prev.LevelIndex : aggs.LevelIndex,
      LastPossibleTimeIndex,
      LeaderHistory,
      LeaderCount: LeaderHistory.length,
      UniqueLeaderCount: uniqBy(LeaderHistory, 'KuskiIndex').length,
      ...battleWinnerColumns,
      KuskiCountF: KuskiIdsF.length,
      KuskiCountAll: KuskiIdsAll.length,
      KuskiIdsF,
      KuskiIdsAll,
    });

    // add already calculated top times to update
    range(0, countTopXTimes).forEach(i => {
      if (newTopTimes[i] && newTopTimes[i].TimeIndex) {
        update[`TopTime${i}`] = newTopTimes[i].Time;
        update[`TopKuskiIndex${i}`] = newTopTimes[i].KuskiIndex;
        update[`TopTimeIndex${i}`] = newTopTimes[i].TimeIndex;
        update[`TopDriven${i}`] = newTopTimes[i].Driven;
      } else {
        update[`TopTime${i}`] = null;
        update[`TopKuskiIndex${i}`] = null;
        update[`TopTimeIndex${i}`] = null;
        update[`TopDriven${i}`] = null;
      }
    });

    track('Done');

    return [update, track(null)];
  };
}

LevelStats.init(ddl, {
  sequelize,
  tableName: 'levelstats',
  indexes: [
    { unique: true, fields: ['LevelIndex'] },
    { fields: ['LevelStatsIndex', 'LevelIndex'] },
  ],
});

export default LevelStats;
