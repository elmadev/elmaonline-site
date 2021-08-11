import express from 'express';
import sequelize, { Op } from 'sequelize';
import { format, subWeeks } from 'date-fns';
import { authContext } from 'utils/auth';
import {
  AllFinished,
  Level,
  Kuski,
  LegacyFinished,
  Team,
  Multitime,
  TimeFile,
} from '../data/models';

const router = express.Router();

const levelInfo = async LevelIndex => {
  const lev = await Level.findOne({
    where: { LevelIndex },
    attributes: ['Hidden', 'Locked', 'Legacy'],
  });
  return lev;
};

const getHighlights = async () => {
  const week = await AllFinished.findOne({
    where: { Driven: { [Op.lt]: format(subWeeks(new Date(), 1), 't') } },
    order: [['TimeIndex', 'DESC']],
  });
  const twoweek = await AllFinished.findOne({
    where: { Driven: { [Op.lt]: format(subWeeks(new Date(), 2), 't') } },
    order: [['TimeIndex', 'DESC']],
  });
  const threeweek = await AllFinished.findOne({
    where: { Driven: { [Op.lt]: format(subWeeks(new Date(), 3), 't') } },
    order: [['TimeIndex', 'DESC']],
  });
  const fourweek = await AllFinished.findOne({
    where: { Driven: { [Op.lt]: format(subWeeks(new Date(), 4), 't') } },
    order: [['TimeIndex', 'DESC']],
  });
  const multiWeek = await Multitime.findOne({
    order: [['MultiTimeIndex', 'DESC']],
    where: sequelize.where(
      sequelize.fn('UNIX_TIMESTAMP', sequelize.col('Driven')),
      { [Op.lt]: format(subWeeks(new Date(), 1), 't') },
    ),
  });
  const multiTwoweek = await Multitime.findOne({
    order: [['MultiTimeIndex', 'DESC']],
    where: sequelize.where(
      sequelize.fn('UNIX_TIMESTAMP', sequelize.col('Driven')),
      { [Op.lt]: format(subWeeks(new Date(), 2), 't') },
    ),
  });
  const multiThreeweek = await Multitime.findOne({
    order: [['MultiTimeIndex', 'DESC']],
    where: sequelize.where(
      sequelize.fn('UNIX_TIMESTAMP', sequelize.col('Driven')),
      { [Op.lt]: format(subWeeks(new Date(), 3), 't') },
    ),
  });
  const multiFourweek = await Multitime.findOne({
    order: [['MultiTimeIndex', 'DESC']],
    where: sequelize.where(
      sequelize.fn('UNIX_TIMESTAMP', sequelize.col('Driven')),
      { [Op.lt]: format(subWeeks(new Date(), 4), 't') },
    ),
  });

  return {
    single: [
      9999999999,
      week.TimeIndex,
      twoweek.TimeIndex,
      threeweek.TimeIndex,
      fourweek.TimeIndex,
    ],
    multi: [
      9999999999,
      multiWeek.MultiTimeIndex,
      multiTwoweek.MultiTimeIndex,
      multiThreeweek.MultiTimeIndex,
      multiFourweek.MultiTimeIndex,
    ],
  };
};

export const getTimes = async (LevelIndex, KuskiIndex, limit, LoggedIn = 0) => {
  const lev = await levelInfo(LevelIndex);
  if (!lev || lev.Locked) return [];
  if (lev.Hidden && parseInt(KuskiIndex, 10) !== LoggedIn) return [];
  let timeLimit = parseInt(limit, 10);
  if (lev.Legacy) {
    timeLimit = 10000;
  }
  const times = await AllFinished.findAll({
    where: { LevelIndex, KuskiIndex },
    order: [
      ['Time', 'ASC'],
      ['TimeIndex', 'ASC'],
    ],
    attributes: ['TimeIndex', 'Time', 'Apples', 'Driven'],
    limit: timeLimit > 10000 ? 10000 : timeLimit,
  });
  if (lev.Legacy) {
    const legacyTimes = await LegacyFinished.findAll({
      where: { LevelIndex, KuskiIndex },
      attributes: ['Time', 'Driven', 'Source'],
      limit: timeLimit > 10000 ? 10000 : timeLimit,
    });
    return [...times, ...legacyTimes]
      .sort((a, b) => a.Time - b.Time)
      .slice(0, parseInt(limit, 10));
  }
  return times;
};

const getLatest = async (KuskiIndex, limit) => {
  const times = await AllFinished.findAll({
    where: { KuskiIndex },
    order: [['TimeIndex', 'DESC']],
    attributes: ['TimeIndex', 'Time', 'Apples', 'Driven', 'LevelIndex'],
    include: [
      {
        model: Level,
        as: 'LevelData',
        attributes: ['LevelName', 'Locked', 'Hidden'],
      },
    ],
    limit: parseInt(limit, 10) > 10000 ? 10000 : parseInt(limit, 10),
  });
  return times.filter(t => {
    if (t.LevelData) {
      if (t.LevelData.Locked || t.LevelData.Hidden) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  });
};

const getMyLatest = async (KuskiIndex, limit, LevelName, from, to) => {
  const where = { KuskiIndex };
  if (LevelName) {
    const level = await Level.findAll({ where: { LevelName } });
    where.LevelIndex = {
      [Op.in]: level.map(r => r.LevelIndex),
    };
  }
  let fromTs;
  let toTs;
  if (from) {
    const froms = from.split('-');
    fromTs = new Date(froms[0], froms[1] - 1, froms[2]).getTime() / 1000;
  }
  if (to) {
    const tos = to.split('-');
    toTs = new Date(tos[0], tos[1] - 1, tos[2], 23, 59, 59).getTime() / 1000;
  }
  if (from && to) {
    where.Driven = {
      [Op.between]: [fromTs, toTs],
    };
  } else if (from) {
    where.Driven = {
      [Op.gte]: fromTs,
    };
  } else if (to) {
    where.Driven = {
      [Op.lte]: toTs,
    };
  }
  const times = await AllFinished.findAll({
    where,
    order: [['TimeIndex', 'DESC']],
    include: [
      {
        model: Level,
        as: 'LevelData',
        attributes: ['LevelName', 'Locked', 'Hidden'],
      },
      {
        model: TimeFile,
        as: 'TimeFileData',
      },
    ],
    limit: parseInt(limit, 10) > 10000 ? 10000 : parseInt(limit, 10),
  });
  return times;
};

const timesByLevel = async LevelIndex => {
  const lev = await levelInfo(LevelIndex);
  if (!lev || lev.Locked || lev.Hidden) return [];
  const times = await AllFinished.findAll({
    where: { LevelIndex },
    attributes: ['Time', 'TimeIndex', 'Driven'],
    order: [['Time', 'ASC']],
    limit: 10000,
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
        include: [
          {
            model: Team,
            as: 'TeamData',
            attributes: ['Team'],
          },
        ],
      },
    ],
  });
  return times;
};

/**
 * Get leader history for level
 */
const getLeaderHistoryForLevel = async (
  LevelIndex,
  KuskiIndex,
  BattleIndex,
  from,
  to,
) => {
  // Check that level isn't locked or hidden
  const lev = await levelInfo(LevelIndex);
  if (lev.Locked || lev.Hidden) {
    return [];
  }

  // Create where clause
  const where = {
    LevelIndex,
    ...(KuskiIndex && { KuskiIndex }),
    ...(BattleIndex && { BattleIndex }),
    ...(from && to && { Driven: { [Op.between]: [from, to] } }),
  };

  // Get first 100 times
  const times = await AllFinished.findAll({
    attributes: ['Time', 'TimeIndex'],
    where,
    order: [['TimeIndex', 'ASC']],
    limit: 100,
  });

  // Build leader history for first 100 times
  const leaderHistory = [];
  let currentBest;

  times.forEach(time => {
    if (!currentBest || currentBest > time.Time) {
      leaderHistory.push(time);
      currentBest = time.Time;
    }
  });

  // Get rest of the times
  const restOfTimes = await AllFinished.findAll({
    attributes: ['Time', 'TimeIndex'],
    where: { ...where, Time: { [Op.lt]: currentBest } },
    order: [['TimeIndex', 'ASC']],
  });

  restOfTimes.forEach(time => {
    if (currentBest > time.Time) {
      leaderHistory.push(time);
      currentBest = time.Time;
    }
  });

  // Populate leader history with extra data
  const leaderHistoryWithData = await AllFinished.findAll({
    attributes: ['TimeIndex', 'Time', 'Driven'],
    where: {
      TimeIndex: {
        [Op.in]: leaderHistory.map(r => r.TimeIndex),
      },
    },
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
  });

  return leaderHistoryWithData;
};

router
  .get('/highlight', async (req, res) => {
    const data = await getHighlights();
    res.json(data);
  })
  .get('/:LevelIndex/:KuskiIndex/:limit', async (req, res) => {
    const auth = authContext(req);
    let LoggedIn = 0;
    if (auth.auth) {
      LoggedIn = auth.userid;
    }
    const data = await getTimes(
      req.params.LevelIndex,
      req.params.KuskiIndex,
      req.params.limit,
      LoggedIn,
    );
    res.json(data);
  })
  .get('/leaderhistory/:LevelIndex', async (req, res) => {
    const data = await getLeaderHistoryForLevel(
      req.params.LevelIndex,
      req.query.KuskiIndex,
      req.query.BattleIndex,
      req.query.from,
      req.query.to,
    );
    res.json(data);
  })
  .get('/mylatest/:limit', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getMyLatest(
        auth.userid,
        req.params.limit,
        req.query.level,
        req.query.from,
        req.query.to,
      );
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/:KuskiIndex/:limit', async (req, res) => {
    const data = await getLatest(req.params.KuskiIndex, req.params.limit);
    res.json(data);
  })
  .get('/:LevelIndex', async (req, res) => {
    const data = await timesByLevel(req.params.LevelIndex);
    res.json(data);
  });

export default router;
