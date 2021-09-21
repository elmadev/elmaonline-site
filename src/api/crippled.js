import express from 'express';
import { authContext } from 'utils/auth';
import sequelize, { Op } from 'sequelize';
import { orderBy, invert } from 'lodash';
import { Crippled, Kuski, Level, Time } from '../data/models';
import { getCrippledTypes } from '../data/models/Crippled';
import { query } from '../utils/sequelize';
import { getPackByName } from './levelpack';

const router = express.Router();

export const getCrippledTypeInt = str => {
  const types = getCrippledTypes();
  return types[str] === undefined ? null : types[str];
};

const getKuski = async k => {
  const findKuski = await Kuski.findOne({
    where: { Kuski: k },
  });
  return findKuski;
};

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

const getTimesEtc = async (LevelIndex, CrippledType) => {
  if (!LevelIndex || CrippledType === null) {
    return [[], []];
  }

  const times = await Crippled.findAll({
    // TimeIndex necessary for calculating best times and leader history
    attributes: ['TimeIndex', 'LevelIndex', 'KuskiIndex', 'Time', 'Driven'],
    where: {
      LevelIndex,
      CrippledType,
    },
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

const getKuskiTimes = async (LevelIndex, KuskiIndex, CrippledType) => {
  if (!LevelIndex || !KuskiIndex || CrippledType === null) {
    return [[], []];
  }

  // very fast when KuskiIndex provided
  const kuskiTimes = await Crippled.findAll({
    attributes: ['TimeIndex', 'BattleIndex', 'Time', 'Driven'],
    where: {
      LevelIndex,
      KuskiIndex,
      CrippledType,
    },
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

const getLevelPackBestTimes = async (LevelPackIndex, topX) => {
  const sql = `
    SELECT crip.LevelIndex, crip.CrippledType, crip.LevelIndex, crip.Time, crip.TimeIndex,
           crip.KuskiIndex, crip.Driven, k.Kuski, k.Country, t.Team FROM
        (SELECT *,
        ROW_NUMBER() OVER (PARTITION BY LevelIndex, CrippledType, KuskiIndex ORDER BY Time ASC, TimeIndex ASC) KuskiPos
        FROM crippled
        WHERE LevelIndex IN (SELECT LevelIndex FROM levelpack_level WHERE LevelPackIndex = ?)) crip
    LEFT OUTER JOIN kuski k ON k.KuskiIndex = crip.Kuskiindex
    LEFT OUTER JOIN team t ON t.TeamIndex = k.TeamIndex
    WHERE KuskiPos = 1
    ORDER BY LevelIndex, CrippledType, Time, TimeIndex
    `;

  // all personal records of all kuskis, for all levels and crippled types in the level pack.
  const results = await query(sql, {
    replacements: [LevelPackIndex],
  });

  const types = invert(getCrippledTypes());
  const ret = {};

  // iteration here relies on order by clause above.
  results.forEach(row => {
    // ie. "noVolt", "noTurn"
    const typeStr = types[row.CrippledType];

    if (typeStr === undefined) {
      return;
    }

    if (ret[row.LevelIndex] === undefined) {
      ret[row.LevelIndex] = {};
    }

    if (ret[row.LevelIndex][typeStr] === undefined) {
      ret[row.LevelIndex][typeStr] = [];
    }

    if (ret[row.LevelIndex][typeStr].length < topX) {
      ret[row.LevelIndex][typeStr].push(row);
    }
  });

  return ret;
};

const getLevelPackPersonalRecords = async (LevelPackIndex, KuskiIndex) => {
  const sql = `
    SELECT c.TimeIndex, c.LevelIndex, c.KuskiIndex, c.CrippledType,
           c.Driven, c.Time, k.Kuski, k.Country, t.Team
    FROM crippled c
    LEFT OUTER JOIN kuski k ON k.KuskiIndex = c.KuskiIndex
    LEFT OUTER JOIN team t ON t.TeamIndex = k.TeamIndex
    WHERE LevelIndex IN (SELECT LevelIndex from levelpack_level WHERE LevelPackIndex = ?)
    AND c.KuskiIndex = ?
    ORDER BY Time ASC, TimeIndex ASC
  `;

  const results = await query(sql, {
    replacements: [LevelPackIndex, KuskiIndex],
  });

  const types = invert(getCrippledTypes());
  const ret = {};

  // iteration here relies on order by clause above.
  results.forEach(row => {
    // ie. "noVolt", "noTurn"
    const typeStr = types[row.CrippledType];

    if (typeStr === undefined) {
      return;
    }

    if (ret[row.LevelIndex] === undefined) {
      ret[row.LevelIndex] = {};
    }

    // first of each level/cripple combination is best time, due to ordering
    // in query
    if (ret[row.LevelIndex][typeStr] === undefined) {
      // always an array of 1 element (so that format is same as in best times)
      ret[row.LevelIndex][typeStr] = [row];
    }
  });

  return ret;
};

router
  // all times, top times, and leader history in the same endpoint
  // since they all require the same query.
  .get('/bestTimes/:LevelIndex/:cripple/:limit', async (req, res) => {
    const lev = await levelInfo(+req.params.LevelIndex);
    const all = req.query.all === '1';

    if (!lev || lev.Locked || lev.Hidden) {
      res.status(404).send('Level not found.');
      return;
    }

    const [allTimes, bestTimes, leaderHistory] = await getTimesEtc(
      +req.params.LevelIndex,
      getCrippledTypeInt(req.params.cripple),
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
        getCrippledTypeInt(req.params.cripple),
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
  })
  .get('/levelPackBestTimes/:LevelPackName', async (req, res) => {
    const levelpack = await getPackByName(req.params.LevelPackName);

    if (!levelpack) {
      res.status(404).send('Pack not found.');
      return;
    }

    const times = await getLevelPackBestTimes(
      levelpack.LevelPackIndex,
      Number(req.query.topX) || 10,
    );

    res.json(times);
  })
  .get(
    '/levelPackPersonalRecords/:LevelPackName/:KuskiIndex',
    async (req, res) => {
      const levelpack = await getPackByName(req.params.LevelPackName);

      if (!levelpack) {
        res.status(404).send('Pack not found.');
        return;
      }

      let KuskiIndex;

      if (req.query.byName === '1') {
        const KuskiObj = await getKuski(req.params.KuskiIndex);
        KuskiIndex = KuskiObj && KuskiObj.KuskiIndex;
      } else {
        KuskiIndex = Number(req.params.KuskiIndex);
      }

      if (!KuskiIndex) {
        res.status(400).send('Kuski not found');
        return;
      }

      const times = await getLevelPackPersonalRecords(
        levelpack.LevelPackIndex,
        KuskiIndex,
      );

      res.json(times);
    },
  );

export default router;
