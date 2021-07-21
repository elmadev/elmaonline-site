// Reusable functions for different playStats modules (many of which
// do not exist yet and may never exist). ie. LevelStats, KuskiStats,
// LevelStatsDaily, KuskiLevelStats
import Sequelize from 'sequelize';
import sequelize from 'data/sequelize';
import {
  uniq,
  includes,
  sortBy,
  orderBy,
  sumBy,
  max,
  mapValues,
  isEmpty,
} from 'lodash';
import moment from 'moment';
import { log } from 'utils/database';
import { getCol } from 'utils/sequelize';

export const timeCol = () => {
  // INTEGER seems large enough, but being safe.
  return {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue: 0,
  };
};

// generic integer column for counting things that aren't
// incredibly large.
export const attemptsCol = () => {
  return {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  };
};

// column definitions likely shared between LevelStats
// and KuskiStats (Kuski not implemented yet however).
// LevelStatsDaily or KuskiLevelStats, if those ever become
// a thing, may also use this.
export const getCommonCols = () => ({
  TimeF: timeCol(),
  TimeD: timeCol(),
  TimeE: timeCol(),
  TimeAll: timeCol(),
  // ie. equal to, select SUM(Time) from Time WHERE Finished = 'F'
  UnadjustedTimeF: timeCol(),
  UnadjustedTimeE: timeCol(),
  UnadjustedTimeD: timeCol(),
  UnadjustedTimeAll: timeCol(),
  // the number of attempts that had the Time, ThrottleTime, and BrakeTime
  // adjusted due to what looks like high inactivity in a run. I think its
  // quite beneficial to track the number of adjustments to make sure the
  // numbers we're using make sense.
  AdjustedAttemptsF: attemptsCol(),
  AdjustedAttemptsE: attemptsCol(),
  AdjustedAttemptsD: attemptsCol(),
  AdjustedAttemptsAll: attemptsCol(),
  AttemptsF: attemptsCol(),
  AttemptsD: attemptsCol(),
  AttemptsE: attemptsCol(),
  AttemptsAll: attemptsCol(),
  ApplesF: attemptsCol(),
  ApplesD: attemptsCol(),
  ApplesE: attemptsCol(),
  ApplesAll: attemptsCol(),
  MaxSpeedF: attemptsCol(),
  MaxSpeedD: attemptsCol(),
  MaxSpeedE: attemptsCol(),
  MaxSpeedAll: attemptsCol(),
  ThrottleTimeF: attemptsCol(),
  ThrottleTimeD: attemptsCol(),
  ThrottleTimeE: attemptsCol(),
  ThrottleTimeAll: attemptsCol(),
  BrakeTimeF: attemptsCol(),
  BrakeTimeD: attemptsCol(),
  BrakeTimeE: attemptsCol(),
  BrakeTimeAll: attemptsCol(),
  LeftVoltF: attemptsCol(),
  LeftVoltD: attemptsCol(),
  LeftVoltE: attemptsCol(),
  LeftVoltAll: attemptsCol(),
  RightVoltF: attemptsCol(),
  RightVoltD: attemptsCol(),
  RightVoltE: attemptsCol(),
  RightVoltAll: attemptsCol(),
  SuperVoltF: attemptsCol(),
  SuperVoltD: attemptsCol(),
  SuperVoltE: attemptsCol(),
  SuperVoltAll: attemptsCol(),
  TurnF: attemptsCol(),
  TurnD: attemptsCol(),
  TurnE: attemptsCol(),
  TurnAll: attemptsCol(),
  // unix timestamps
  LastDrivenF: {
    type: Sequelize.INTEGER(),
    allowNull: true,
  },
  LastDrivenE: {
    type: Sequelize.INTEGER(),
    allowNull: true,
  },
  LastDrivenD: {
    type: Sequelize.INTEGER(),
    allowNull: true,
  },
  LastDrivenAll: {
    type: Sequelize.INTEGER(),
    allowNull: true,
  },
});

/**
 * Build part of the record that will eventually get inserted
 * or updated in the database. Indexes are database columns.
 *
 * Specifies approximately (or exactly) columns in getCommonCols()
 *
 * @param {Object} aggs - returned object from aggregateTimes
 * @param {LevelStats|null} prev
 * @returns {Object}
 */
export const buildCommonUpdate = (aggs, prev) => {
  // prev might be null, we want obj for this fn.
  // eslint-disable-next-line no-param-reassign
  prev = isEmpty(prev) || prev === null ? {} : prev;

  // indexes are database columns.
  // values can be functions which take (aggs, prev || {})
  const cols = {
    // SUM
    TimeF: 'sum',
    TimeD: 'sum',
    TimeE: 'sum',
    TimeAll: 'sum',
    UnadjustedTimeF: 'sum',
    UnadjustedTimeE: 'sum',
    UnadjustedTimeD: 'sum',
    UnadjustedTimeAll: 'sum',
    AdjustedAttemptsF: 'sum',
    AdjustedAttemptsE: 'sum',
    AdjustedAttemptsD: 'sum',
    AdjustedAttemptsAll: 'sum',
    AttemptsF: 'sum',
    AttemptsE: 'sum',
    AttemptsD: 'sum',
    AttemptsAll: 'sum',
    ApplesF: 'sum',
    ApplesE: 'sum',
    ApplesD: 'sum',
    ApplesAll: 'sum',
    ThrottleTimeF: 'sum',
    ThrottleTimeE: 'sum',
    ThrottleTimeD: 'sum',
    ThrottleTimeAll: 'sum',
    BrakeTimeF: 'sum',
    BrakeTimeE: 'sum',
    BrakeTimeD: 'sum',
    BrakeTimeAll: 'sum',
    LeftVoltF: 'sum',
    LeftVoltE: 'sum',
    LeftVoltD: 'sum',
    LeftVoltAll: 'sum',
    RightVoltF: 'sum',
    RightVoltE: 'sum',
    RightVoltD: 'sum',
    RightVoltAll: 'sum',
    SuperVoltF: 'sum',
    SuperVoltE: 'sum',
    SuperVoltD: 'sum',
    SuperVoltAll: 'sum',
    TurnF: 'sum',
    TurnE: 'sum',
    TurnD: 'sum',
    TurnAll: 'sum',

    // MAX
    MaxSpeedF: 'max',
    MaxSpeedE: 'max',
    MaxSpeedD: 'max',
    MaxSpeedAll: 'max',
    LastDrivenF: 'max',
    LastDrivenE: 'max',
    LastDrivenD: 'max',
    LastDrivenAll: 'max',
  };

  return mapValues(cols, (value, index) => {
    if (typeof value === 'function') {
      return value(aggs, prev);
    }

    if (value === 'sum') {
      return Number(aggs[index]) + Number(prev[index] || 0);
    }

    if (value === 'max') {
      return Math.max(Number(aggs[index]), Number(prev[index] || 0));
    }

    return value;
  });
};

// true if t.Finished is E, F, or D.
// columns ending in All are the sum of E, F, and D, which is not
// the same as all runs in the time table.
export const timeFinishedAll = t => ['E', 'F', 'D'].indexOf(t.Finished) !== -1;

// silly helper for below.
const getter = (obj, key) => {
  if (typeof key === 'function') {
    return key(obj);
  }

  return obj[key];
};

// helper for aggregating times
const sumGroup = (times, base, col) => {
  // eslint-disable-next-line no-param-reassign
  col = col || base;
  return {
    [`${base}F`]: sumBy(times, time =>
      time.Finished === 'F' ? getter(time, col) : 0,
    ),
    [`${base}E`]: sumBy(times, time =>
      time.Finished === 'E' ? getter(time, col) : 0,
    ),
    [`${base}D`]: sumBy(times, time =>
      time.Finished === 'D' ? getter(time, col) : 0,
    ),
    [`${base}All`]: sumBy(times, time =>
      timeFinishedAll(time) ? getter(time, col) : 0,
    ),
  };
};

const getMaxColFromTimes = (times, Finished, col) => {
  let filtered = times;

  if (Finished === 'all') {
    filtered = filtered.filter(timeFinishedAll);
  } else {
    filtered = filtered.filter(t => t.Finished === Finished);
  }

  return filtered.length > 0 ? max(filtered.map(t => t[col])) : 0;
};

// helper for aggregating times
const maxGroup = (times, base, col) => {
  // eslint-disable-next-line no-param-reassign
  col = col || base;

  return {
    [`${base}F`]: getMaxColFromTimes(times, 'F', col),
    [`${base}E`]: getMaxColFromTimes(times, 'E', col),
    [`${base}D`]: getMaxColFromTimes(times, 'D', col),
    [`${base}All`]: getMaxColFromTimes(times, 'all', col),
  };
};

// convert time.Driven to unix timestamp
const parseTimeDriven = d => parseInt(moment(d).format('X'), 10);

// get adjusted overall/throttle/brake time for purposes of summing.
// tries to detect AFK type of behaviour so that these runs do not inflate
// or deflate time aggregates.
// it only adjusts the times. The runs are not completely removed or considered
// not legit for other purposes.
// It's very hard to do this only with the data from a single run and
// no knowledge of the other runs on the level. But, just trying to get the
// low hanging fruit, ie. runs where people are AFK for hours or days, for
// which there are many. Among all levels ever made there are going
// to be some very weird ones that produce odd looking times that are
// not necessarily due to afk.
const getAdjustedTimes = time => {
  const ret = (Time, ThrottleTime, BrakeTime, isAdjusted) => {
    return {
      Time,
      ThrottleTime,
      BrakeTime,
      isAdjusted,
      Finished: time.Finished,
    };
  };

  // run this to get an idea of reasonable APM and throttle/brake time
  // SELECT *, a.Finished F, ThrottleTime/time ThrottleP, BrakeTime/time BrakeP, LeftVolt+RightVolt+SuperVolt+Turn actions,
  // (SELECT ThrottleP+BrakeP) ThrottleBrakeP, Time/6000 minutes, (SELECT actions/minutes) apm FROM time a
  // INNER JOIN (SELECT LevelIndex, LevelName, LongName FROM level) lev ON lev.LevelIndex = a.LevelIndex
  // INNER JOIN (SELECT kuski, KuskiIndex FROM kuski) k ON k.KuskiIndex = a.KuskiIndex
  // WHERE time > 30000
  // AND a.Finished IN ('E', 'F', 'D')
  // ORDER BY ThrottleBrakeP DESC LIMIT 0, 50000;

  const hour = 360000;
  const actions = time.LeftVolt + time.RightVolt + time.SuperVolt + time.Turn;
  const actionsPerMinute = time.Time > 0 ? actions / (time.Time / 6000) : 0;
  const throttlePct = time.Time > 0 ? time.ThrottleTime / time.Time : 0;
  const brakePct = time.Time > 0 ? time.BrakeTime / time.Time : 0;
  const throttleBrakePct = throttlePct + brakePct;

  // for unknown reasons, there are some very long runs (3-10 hours)
  // with like 98% throttle time and very low actions per minute, on
  // levels where this type of driving looks impossible. Seems like
  // a potential bug in the data. But for this reason we sometimes
  // exclude very long runs with very high brake/throttle pct and low APM.
  const checkActivity = (APM, tbPct0, tbPct1) => {
    // false if not enough activity
    return !(
      actionsPerMinute < APM &&
      (throttleBrakePct < tbPct0 || throttleBrakePct > tbPct1)
    );
  };

  if (time.Time > 3 * hour) {
    return ret(0, 0, 0, 1);
  }

  // 1-3 hours
  if (time.Time > hour) {
    if (!checkActivity(12, 0.2, 0.97)) {
      return ret(0, 0, 0, 1);
    }
  }

  // 30-60 min.
  if (time.Time > hour / 2) {
    if (!checkActivity(10, 0.25, 0.99)) {
      return ret(0, 0, 0, 1);
    }
  }

  // 10-30 min.
  // keep in mind there are many legit crippled runs within this range.
  if (time.Time > hour / 6) {
    if (!checkActivity(8, 0.2, 1)) {
      return ret(0, 0, 0, 1);
    }
  }

  // a ton of < 10 min times exist with low activity, but,
  // its just hard to accurately filter them out.
  return ret(time.Time, time.ThrottleTime, time.BrakeTime, 0);
};

// aggregate an array of rows from the time table.
// expects an array of plain old javascript objects,
// where time.Driven is a timestamp.
export const aggregateTimes = times => {
  const adjusted = times.map(getAdjustedTimes);

  return {
    // useful if/when all times have the same kuski or level index.
    // it is up to the caller of this function to know if that's the case.
    LevelIndex: times.length && times[0].LevelIndex,
    KuskiIndex: times.length && times[0].KuskiIndex,

    ...sumGroup(adjusted, 'Time'),
    ...sumGroup(adjusted, 'ThrottleTime'),
    ...sumGroup(adjusted, 'BrakeTime'),

    AdjustedAttemptsF: sumBy(adjusted, t =>
      t.Finished === 'F' && t.isAdjusted ? 1 : 0,
    ),
    AdjustedAttemptsE: sumBy(adjusted, t =>
      t.Finished === 'E' && t.isAdjusted ? 1 : 0,
    ),
    AdjustedAttemptsD: sumBy(adjusted, t =>
      t.Finished === 'D' && t.isAdjusted ? 1 : 0,
    ),
    AdjustedAttemptsAll: sumBy(adjusted, t =>
      timeFinishedAll(t) && t.isAdjusted ? 1 : 0,
    ),

    ...sumGroup(times, 'UnadjustedTime', 'Time'),
    ...sumGroup(times, 'Apples'),
    ...sumGroup(times, 'LeftVolt'),
    ...sumGroup(times, 'RightVolt'),
    ...sumGroup(times, 'SuperVolt'),
    ...sumGroup(times, 'Turn'),

    // almost like a sumGroup but not quite
    AttemptsF: sumBy(times, t => (t.Finished === 'F' ? 1 : 0)),
    AttemptsE: sumBy(times, t => (t.Finished === 'E' ? 1 : 0)),
    AttemptsD: sumBy(times, t => (t.Finished === 'D' ? 1 : 0)),
    AttemptsAll: sumBy(times, t => (timeFinishedAll(t) ? 1 : 0)),

    // MAX
    ...maxGroup(times, 'MaxSpeed'),
    ...maxGroup(times, 'LastDriven', 'Driven'),
  };
};

// returns an object with ids as keys, and one of records, or null, as values.
export const mapIdsToRecordsOrNull = (ids, records, recordIndex) => {
  const ret = {};

  ids.forEach(id => {
    ret[id] = null;
  });

  records.forEach(row => {
    ret[row[recordIndex]] = row;
  });

  return ret;
};

export const filterTimes = times => {
  return times.filter(timeFinishedAll);
};

export const mapTimeDriven = times => {
  return times.map(t => {
    // eslint-disable-next-line no-param-reassign
    t.Driven = parseTimeDriven(t.Driven);
    return t;
  });
};

export const getMinTimeIndex = async () => {
  const ret = await getCol(
    'SELECT MIN(TimeIndex) minIndex FROM time',
    {},
    'minIndex',
  );

  return +ret;
};

export const getMaxTimeIndex = async () => {
  const ret = await getCol(
    'SELECT MAX(TimeIndex) maxIndex FROM time',
    {},
    'maxIndex',
  );

  return +ret;
};

// note that coverage[0] is no minTimeIndex passed in, if minTimeIndex
// is smaller than the first time index in the times table (this is useful
// on dev where many times were deleted).
export const getTimesInInterval = async (
  minTimeIndex,
  limit,
  filterFinished = true,
  mapDriven = true,
) => {
  const minIndex = await getMinTimeIndex();
  const maxIndex = await getMaxTimeIndex();

  const realMin = Math.max(minIndex, +minTimeIndex);

  const lastPossibleTimeIndex = realMin + +limit - 1;

  const moreTimesExist = lastPossibleTimeIndex < maxIndex;

  // no where clause here. Will screw up coverage.
  let [times] = await sequelize.query(
    'SELECT * FROM time WHERE TimeIndex BETWEEN ? AND ? ORDER BY TimeIndex ASC',
    {
      replacements: [realMin, lastPossibleTimeIndex],
      benchmark: true,
      logging: (query, b) => log('query', query, b),
    },
  );

  // ie. min 175000000, limit 1000000
  // coverage could be [175000000, 175396482]
  // if only 396482 times exist beyond 175000000.
  const coverage = [realMin, moreTimesExist ? lastPossibleTimeIndex : maxIndex];

  // we often don't care about other finish types
  if (filterFinished) {
    times = filterTimes(times);
  }

  // best to map to timestamp once, as we'll need the timestamp
  // more than once overall in most cases.
  if (mapDriven) {
    times = mapTimeDriven(times);
  }

  return [times, coverage, moreTimesExist];
};

/**
 * Warning: you might want getTopFinishes instead.
 *
 * expects t.Driven to be unix timestamp.
 *
 * @param {Array<Object>} times
 * @param {integer} n
 * @returns {Array<Object>}
 */
export const getTopTimes = (times, n) => {
  // times driven earlier take precedence
  const sorted = orderBy(times, ['Time', 'Driven'], ['ASC', 'ASC']);

  return sorted.slice(0, n);
};

/**
 * expects t.Driven to be unix timestamp.
 *
 * @param {Array<Object>} times
 * @param {integer} n
 * @returns {Array<Object>}
 */
export const getTopFinishes = (times, n) => {
  // eslint-disable-next-line no-underscore-dangle

  const finishes = times.filter(t => t.Finished === 'F');
  return getTopTimes(finishes, n);
};

/**
 * expects t.Driven to be unix timestamp.
 *
 * @param {Array<Object>}times
 * @param {Array} prev
 * @param maxCount
 * @returns {Array<Object>} - has length of count or less.
 */
export const mergeTopTimes = (times, prev, maxCount) => {
  // eslint-disable-next-line no-param-reassign
  prev = isEmpty(prev) ? null : prev;

  const finishes = times.filter(t => t.Finished === 'F');

  const allFinished = finishes.concat(prev ? prev.TopXTimes : []);

  // sort by time asc, with earlier driven times taking precedence
  const sorted = orderBy(
    allFinished,
    ['Time', 'Driven', 'TimeIndex'],
    ['ASC', 'ASC', 'ASC'],
  );

  const topX = [];
  const kuskis = [];

  // now loop through sorted times and grab 1 time from each kuski
  // until we hit the limit
  sorted.forEach(t => {
    if (topX.length >= maxCount) {
      return;
    }

    if (!includes(kuskis, t.KuskiIndex)) {
      // t could have all indexes from times table or just these 4
      topX.push({
        Time: t.Time,
        KuskiIndex: t.KuskiIndex,
        TimeIndex: t.TimeIndex,
        Driven: t.Driven,
        BattleIndex: t.BattleIndex > 0 ? t.BattleIndex : null,
      });
      kuskis.push(t.KuskiIndex);
    }
  });

  return topX;
};

/**
 *
 * @param {Array<Object>}times
 * @param {Object|null} prev
 * @returns {Array<Object>}
 */
export const mergeLeaderHistory = (times, prev) => {
  // eslint-disable-next-line no-param-reassign
  prev = isEmpty(prev) ? null : prev;

  const newFinished = times.filter(t => t.Finished === 'F');

  // times from old leaders and all new times finished in one array.
  // note that old leaders are objects with entries, unlike new times.
  const all = newFinished.concat(prev ? prev.LeaderHistory : []);

  // order by driven date (/ time index) then we'll iterate and collect
  // all world records.
  const ordered = orderBy(all, ['TimeIndex'], ['ASC']);

  let best = 9999999999;
  const leaders = [];

  ordered.forEach(ord => {
    if (ord.Time < best) {
      leaders.push(ord);
      best = ord.Time;
    }
  });

  return leaders.map(t => ({
    Time: t.Time,
    Driven: t.Driven,
    TimeIndex: t.TimeIndex,
    KuskiIndex: t.KuskiIndex,
    BattleIndex: t.BattleIndex,
  }));
};

/**
 * @param {Array<Object>} times
 * @param {LevelStats|null} prev
 * @returns {object}
 */
export const mergeBattleWinner = (times, prev) => {
  // eslint-disable-next-line no-param-reassign
  prev = isEmpty(prev) ? null : prev;

  const battleTimesFinished = times.filter(
    t => t.Finished === 'F' && t.BattleIndex !== null && t.BattleIndex > 0,
  );

  const topBattleTime = getTopTimes(battleTimesFinished, 1)[0] || null;

  const fromPrev = {
    BattleTopTime: prev === null ? null : prev.BattleTopTime,
    BattleTopTimeIndex: prev === null ? null : prev.BattleTopTimeIndex,
    BattleTopKuskiIndex: prev === null ? null : prev.BattleTopKuskiIndex,
    BattleTopDriven: prev === null ? null : prev.BattleTopDriven,
    BattleTopBattleIndex: prev === null ? null : prev.BattleTopBattleIndex,
  };

  const fromTimes = {
    BattleTopTime: topBattleTime === null ? null : topBattleTime.Time,
    BattleTopTimeIndex: topBattleTime === null ? null : topBattleTime.TimeIndex,
    BattleTopKuskiIndex:
      topBattleTime === null ? null : topBattleTime.KuskiIndex,
    BattleTopDriven: topBattleTime === null ? null : topBattleTime.Driven,
    BattleTopBattleIndex:
      topBattleTime === null ? null : topBattleTime.BattleIndex,
  };

  // if no previous entry, use battle winner (which could all null values)
  if (prev === null) {
    return fromTimes;
  }

  // if no battle winner, use what was there before. (which could all null values)
  if (topBattleTime === null) {
    return fromPrev;
  }

  // even though prev was not null, the value on fromPrev still can be
  // (when a levelStats entry exists but without any top battle time.)
  if (fromTimes.BattleTopTime < (fromPrev.BattleTopTime || 99999999)) {
    return fromTimes;
  }

  // the previous winner and times (non null) (no change to db)
  return fromPrev;
};

export const mergeKuskis = (times, prev) => {
  // eslint-disable-next-line no-param-reassign
  prev = isEmpty(prev) ? null : prev;

  // for faster lookup
  const allMap = {};
  const finishedMap = {};

  times.forEach(t => {
    const i = t.KuskiIndex;

    // saw some -1's somehow ?
    if (i < 1) {
      return;
    }

    if (!allMap[i] && timeFinishedAll(t)) {
      allMap[i] = 1;
    }

    if (!finishedMap[i] && t.Finished === 'F') {
      finishedMap[i] = 1;
    }
  });

  let KuskiIdsAll = Object.keys(allMap).map(Number);
  let KuskiIdsF = Object.keys(finishedMap).map(Number);

  if (prev !== null) {
    KuskiIdsAll = uniq(KuskiIdsAll.concat(prev.KuskiIdsAll));
    KuskiIdsF = uniq(KuskiIdsF.concat(prev.KuskiIdsF));
  }

  KuskiIdsAll = sortBy(KuskiIdsAll);
  KuskiIdsF = sortBy(KuskiIdsF);

  return [KuskiIdsAll, KuskiIdsF];
};
