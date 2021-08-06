import express from 'express';
import { authContext } from 'utils/auth';
import { Op } from 'sequelize';
import { AllFinished, Kuski, Level } from '../data/models';

const router = express.Router();

const levelInfo = async LevelIndex => {
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

const getTimes = async (cripple, LevelIndex, KuskiIndex, limit) => {
  const cond = getCrippledCond(cripple);

  if (cond === undefined) {
    return [];
  }

  const where = {
    LevelIndex,
    ...cond,
  };

  if (KuskiIndex) {
    where.KuskiIndex = KuskiIndex;
  }

  const times = await AllFinished.findAll({
    attributes: ['TimeIndex', 'BattleIndex', 'Time', 'Driven'],
    where,
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['KuskiIndex', 'Kuski', 'Country'],
      },
    ],
    limit,
    order: [['Time', 'ASC']],
  });

  return times;
};

const getBestTimes = async (cripple, LevelIndex, limit) => {
  const cond = getCrippledCond(cripple);

  if (cond === undefined) {
    return [];
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
        attributes: ['KuskiIndex', 'Kuski', 'Country'],
      },
    ],
    order: [
      ['Time', 'ASC'],
      ['TimeIndex', 'ASC'],
    ],
  });

  let bestTimes = [];
  const kuskiIds = [];

  times.forEach(t => {
    if (kuskiIds.indexOf(t.KuskiIndex) === -1) {
      kuskiIds.push(t.KuskiIndex);
      bestTimes.push(t);
    }
  });

  bestTimes = bestTimes.slice(0, limit);

  return bestTimes;
};

router
  .get('/best-times/:LevelIndex/:cripple/:limit', async (req, res) => {
    const lev = await levelInfo(+req.params.LevelIndex);

    if (!lev || lev.Locked || lev.Hidden) {
      res.status(404);
      res.send('Level not found.');
      return;
    }

    const bestTimes = await getBestTimes(
      req.params.cripple,
      +req.params.LevelIndex,
      Math.max(0, Math.min(+req.params.limit, 10000)),
    );

    res.json(bestTimes);
  })
  .get('/my-times/:LevelIndex/:cripple/:limit', async (req, res) => {
    const lev = await levelInfo(+req.params.LevelIndex);

    if (!lev || lev.Locked || lev.Hidden) {
      res.status(404);
      res.send('Level not found.');
      return;
    }

    const auth = authContext(req);

    if (!auth.userid) {
      res.json([]);
      return;
    }

    const times = await getTimes(
      req.params.cripple,
      +req.params.LevelIndex,
      +auth.userid,
      Math.max(0, Math.min(+req.params.limit, 10000)),
    );

    res.json(times);
  });

export default router;
