import express from 'express';
import sequelize from 'data/sequelize';
import { mapValues, isEqual } from 'lodash';
import { log } from 'utils/database';
import { LevelStats, Level, Time } from '../data/models';

const router = express.Router();

// useful (and/or almost impossible to do without) when working on
// level stats code. In production, can be used to manually verify
// that the batch process is properly combining new and old times.
// ie. the update below should be identical to a row in the level stats
// table assuming the table is up to date.
// does not check locked/hidden, do that beforehand
// if serving data to public.
const mockUpdate = async LevelIndex => {
  let times = await Time.findAll({
    where: {
      LevelIndex,
    },
    order: [['TimeIndex', 'ASC']],
  });

  // sequelize instances give Driven timestamp as string
  if (times) {
    times = times.map(t => {
      const obj = t.toJSON();
      obj.Driven = Number(obj.Driven);
      return obj;
    });
  }

  const [update, perf] = LevelStats.buildUpdate(times, null, null);

  // output some aggregations directly from time table which should usually
  // agree with the mock update (but not BrakeTime/ThrottleTime)
  const q = `
    SELECT Finished, COUNT(*), MIN(Time), SUM(Time), SUM(Apples), SUM(BrakeTime), SUM(Turn), SUM(LeftVolt), SUM(SuperVolt), MAX(MaxSpeed), MAX(Driven)
    from time
    WHERE LevelIndex = ?
    GROUP BY Finished
    HAVING Finished IN ('F', 'E', 'D')
    `;

  const [timeAggregates] = await sequelize.query(q, {
    replacements: [LevelIndex],
    benchmark: true,
    logging: (query, b) => log('query', query, b),
  });

  const exLevelStats = await LevelStats.findOne({ where: { LevelIndex } });

  const compare = mapValues(
    exLevelStats ? exLevelStats.toJSON() : {},
    (val, key) => {
      // no need to compare this derived column
      if (key === 'TopXTimes') {
        return '__not_applicable';
      }

      if (isEqual(val, update[key])) {
        return '__equal';
      }

      // good to know this value, but, update doesn't
      // have it, so don't compare.
      if (key === 'LastPossibleTimeIndex') {
        return val;
      }

      // same with this.
      if (key === 'LevelStatsIndex') {
        return val;
      }

      return ['Ex levelStats, mock:', val, update[key]];
    },
  );

  return {
    times: times.length,
    level: await Level.findOne({
      attributes: ['LevelIndex', 'LevelName', 'LongName', 'Locked', 'Hidden'],
      where: { LevelIndex, Locked: 0 },
    }),
    timeAggregates,
    update,
    compare,
    perf,
  };
};

// useful for dev/testing
router.get('/mock-update/:LevelIndex', async (req, res) => {
  const LevelIndex = +req.params.LevelIndex;

  const lev = await Level.findOne({ where: { LevelIndex } });

  if (lev && (lev.Locked || lev.Hidden)) {
    res.json({
      __locked: true,
    });
    return;
  }

  const payload = await mockUpdate(LevelIndex);
  res.json(payload);
});

export default router;
