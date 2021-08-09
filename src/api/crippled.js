import express from 'express';
import { authContext } from 'utils/auth';
import sequelize, { Op } from 'sequelize';
import { orderBy } from 'lodash';
import { AllFinished, Kuski, Level, Time } from '../data/models';

const router = express.Router();

const levelInfo = async LevelIndex => {
  if (!LevelIndex) {
    return false;
  }

  const lev = await Level.findOne({
    where: { LevelIndex },
    attributes: ['Hidden', 'Locked', 'Legacy'],
  });
  return lev;
};

const getCrippledCond = cripple => {
  switch (cripple) {
    case 'noVolt':
      return {
        LeftVolt: 0,
        RightVolt: 0,
        SuperVolt: 0,
      };
    case 'noTurn':
      return {
        Turn: 0,
      };
    case 'oneTurn':
      return {
        Turn: {
          [Op.lte]: 1,
        },
      };
    case 'noBrake':
      return {
        BrakeTime: 0,
      };
    case 'noThrottle':
      return {
        ThrottleTime: 0,
      };
    case 'alwaysThrottle':
      return {
        BrakeTime: 0,
        ThrottleTime: {
          [Op.col]: 'Time',
        },
      };
    case 'oneWheel':
      return {
        OneWheel: 1,
      };
    case 'drunk':
      return {
        Drunk: 1,
      };
    default:
      return undefined;
  }
};

const parseBestTimes = times => {
  const sorted = orderBy(times, ['Time', 'TimeIndex'], ['asc', 'asc']);

  const ret = [];
  const kuskiIds = [];

  sorted.forEach(t => {
    if (kuskiIds.indexOf(t.KuskiIndex) === -1) {
      kuskiIds.push(t.KuskiIndex);
      ret.push(t);
    }
  });

  return ret;
};

const parseLeaderHistory = times => {
  const sorted = orderBy(times, ['TimeIndex'], ['asc']);

  let best = 99999999;
  const ret = [];

  sorted.forEach(t => {
    if (t.Time < best) {
      ret.push(t);
      best = t.Time;
    }
  });

  return ret;
};

// returns best times and leader history while hitting the database once,
// since both items would require the same expensive query.
const getTimes = async (LevelIndex, cripple) => {
  const cond = getCrippledCond(cripple);

  if (cond === undefined || !LevelIndex) {
    return [[], []];
  }

  if (!LevelIndex) {
    return [[], []];
  }

  const where = {
    LevelIndex,
    ...cond,
  };

  const times = await AllFinished.findAll({
    attributes: ['TimeIndex', 'BattleIndex', 'KuskiIndex', 'Time', 'Driven'],
    where,
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski', 'Country'],
      },
    ],
    order: [
      ['Time', 'ASC'],
      ['TimeIndex', 'ASC'],
    ],
  });

  return [times, parseBestTimes(times), parseLeaderHistory(times)];
};

const getKuskiTimes = async (LevelIndex, KuskiIndex, cripple) => {
  const cond = getCrippledCond(cripple);

  if (cond === undefined || !LevelIndex || !KuskiIndex) {
    return [[], []];
  }

  const where = {
    LevelIndex,
    KuskiIndex,
    ...cond,
  };

  // very fast when KuskiIndex provided
  const kuskiTimes = await AllFinished.findAll({
    attributes: ['TimeIndex', 'BattleIndex', 'Time', 'Driven'],
    where,
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski', 'Country'],
      },
    ],
    order: [
      ['Time', 'ASC'],
      ['TimeIndex', 'ASC'],
    ],
  });

  return [kuskiTimes, parseLeaderHistory(kuskiTimes)];
};

const getTimeStats = async (LevelIndex, KuskiIndex, cripple) => {
  const cond = getCrippledCond(cripple);

  if (cond === undefined) {
    return [];
  }

  const stats = await Time.findAll({
    group: ['Finished'],
    attributes: [
      'Finished',
      [sequelize.fn('COUNT', 'Finished'), 'RunCount'],
      [sequelize.fn('SUM', sequelize.col('Time')), 'TimeSum'],
    ],
    where: { LevelIndex, KuskiIndex, ...cond },
  });

  return stats;
};

const fixLimit = (val, max) => {
  const limit = parseInt(val, 10) || 0;
  return Math.max(0, Math.min(limit, max));
};

router
  // all times, top times, and leader history in the same endpoint because
  // they all require the same expensive query. If you need *only* all times,
  // set all = true, and ignore the others as they are insignificant, performance wise.
  .get('/bestTimes/:LevelIndex/:cripple/:limit', async (req, res) => {
    const lev = await levelInfo(+req.params.LevelIndex);
    const all = req.query.all === '1';

    if (!lev || lev.Locked || lev.Hidden) {
      res.status(404).send('Level not found.');
      return;
    }

    const [allTimes, bestTimes, leaderHistory] = await getTimes(
      +req.params.LevelIndex,
      req.params.cripple,
    );

    res.json({
      allTimes: all
        ? allTimes.slice(0, fixLimit(req.query.limitAll, 10000))
        : [],
      bestTimes: bestTimes.slice(0, fixLimit(req.params.limit, 10000)),
      leaderHistory,
    });
  })
  .get(
    '/personal/:LevelIndex/:KuskiIndex/:cripple/:limit',
    async (req, res) => {
      const lev = await levelInfo(+req.params.LevelIndex);

      if (!lev || lev.Locked || lev.Hidden) {
        res.status(400).send('Level not found.');
        return;
      }

      let KuskiIndex;

      if (+req.params.KuskiIndex > 0) {
        KuskiIndex = +req.params.KuskiIndex;
      } else {
        const auth = authContext(req);
        KuskiIndex = +auth.userid;
      }

      if (!KuskiIndex) {
        res.status(400).send('KuskiIndex not valid, or not logged in.');
        return;
      }

      const [kuskiTimes, kuskiLeaderHistory] = await getKuskiTimes(
        +req.params.LevelIndex,
        KuskiIndex,
        req.params.cripple,
      );

      res.json({
        kuskiTimes: kuskiTimes.slice(0, fixLimit(req.params.limit, 10000)),
        kuskiLeaderHistory,
      });
    },
  )
  .get('/timeStats/:LevelIndex/:KuskiIndex/:cripple', async (req, res) => {
    const lev = await levelInfo(+req.params.LevelIndex);

    if (!lev || lev.Locked || lev.Hidden) {
      res.status(400).send('Level not found.');
      return;
    }

    let KuskiIndex;

    if (+req.params.KuskiIndex > 0) {
      KuskiIndex = +req.params.KuskiIndex;
    } else {
      const auth = authContext(req);
      KuskiIndex = +auth.userid;
    }

    if (!KuskiIndex) {
      res.status(400).send('KuskiIndex not valid, or not logged in.');
    }

    const timeStats = await getTimeStats(
      +req.params.LevelIndex,
      KuskiIndex,
      req.params.cripple,
    );

    res.json(timeStats);
  });

export default router;
