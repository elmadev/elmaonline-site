import express from 'express';
import { authContext } from 'utils/auth';
import { Op } from 'sequelize';
import { orderBy } from 'lodash';
import { AllFinished, Kuski, Level } from '../data/models';

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
const getBestTimes = async (LevelIndex, cripple, limit) => {
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

  const bestTimes = parseBestTimes(times);

  const bestTimes0 = limit >= 0 ? bestTimes.slice(0, limit) : bestTimes;

  return [bestTimes0, parseLeaderHistory(times)];
};

const getKuskiBestTimes = async (LevelIndex, cripple, KuskiIndex, limit) => {
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

  const kuskiTimes0 = limit >= 0 ? kuskiTimes.slice(0, limit) : kuskiTimes;

  return [kuskiTimes0, parseLeaderHistory(kuskiTimes)];
};

router
  .get('/bestTimes/:LevelIndex/:cripple/:limit', async (req, res) => {
    const lev = await levelInfo(+req.params.LevelIndex);

    if (!lev || lev.Locked || lev.Hidden) {
      res.status(404).send('Level not found.');
      return;
    }

    if (Number.isNaN(+req.params.limit)) {
      res.status(400).send('Limit not valid.');
      return;
    }

    const [bestTimes, leaderHistory] = await getBestTimes(
      +req.params.LevelIndex,
      req.params.cripple,
      Math.max(0, Math.min(parseInt(req.params.limit, 10), 10000)),
    );

    res.json({
      bestTimes,
      leaderHistory,
    });
  })
  .get('/personal/:LevelIndex/:cripple/:limit', async (req, res) => {
    const lev = await levelInfo(+req.params.LevelIndex);

    if (!lev || lev.Locked || lev.Hidden) {
      res.status(400).send('Level not found.');
      return;
    }

    if (Number.isNaN(+req.params.limit)) {
      res.status(400).send('Limit not valid.');
      return;
    }

    // default KuskiIndex to logged in user
    let KuskiIndex;

    if (req.query.KuskiIndex) {
      KuskiIndex = +req.query.KuskiIndex;
    } else {
      const auth = authContext(req);
      KuskiIndex = +auth.userid;
    }

    if (!KuskiIndex) {
      res.status(400).send('KuskiIndex not valid, or not logged in.');
      return;
    }

    const [kuskiTimes, kuskiLeaderHistory] = await getKuskiBestTimes(
      +req.params.LevelIndex,
      req.params.cripple,
      KuskiIndex,
      Math.max(0, Math.min(+req.params.limit, 10000)),
    );

    res.json({
      kuskiTimes,
      kuskiLeaderHistory,
    });
  });

export default router;
