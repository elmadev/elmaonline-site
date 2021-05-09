import express from 'express';
import sequelize from 'data/sequelize';
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
  const times = await Time.findAll({
    where: {
      LevelIndex,
    },
    order: [['TimeIndex', 'ASC']],
  });

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
  });

  return {
    times: times.length,
    level: await Level.findOne({
      attributes: ['LevelIndex', 'LevelName', 'LongName', 'Locked', 'Hidden'],
      where: { LevelIndex, Locked: 0 },
    }),
    timeAggregates,
    update,
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
