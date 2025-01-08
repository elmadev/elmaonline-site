import express from 'express';
import sequelize, { Op } from 'sequelize';
import { format, subWeeks } from 'date-fns';
import { authContext } from '#utils/auth';
import { formatLevelSearch, fromTo } from '#utils/database';
import {
  AllFinished,
  Kuski,
  LegacyFinished,
  Level,
  Multitime,
  Team,
  TimeFile,
  Time,
} from '#data/models';

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
  const personal = LoggedIn === parseInt(KuskiIndex, 10);

  const lev = await levelInfo(LevelIndex);
  if (!lev || lev.Locked) return [];
  if (lev.Hidden && parseInt(KuskiIndex, 10) !== LoggedIn) return [];
  let timeLimit = parseInt(limit, 10);
  if (lev.Legacy) {
    timeLimit = 10000;
  }

  let include = [];
  if (personal) {
    include = [
      {
        model: TimeFile,
        as: 'TimeFileData',
      },
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ];
  }

  const times = await AllFinished.findAll({
    where: { LevelIndex, KuskiIndex },
    order: [
      ['Time', 'ASC'],
      ['TimeIndex', 'ASC'],
    ],
    attributes: ['TimeIndex', 'Time', 'Apples', 'Driven'],
    limit: timeLimit > 10000 ? 10000 : timeLimit,
    include,
  });
  if (lev.Legacy) {
    let includeLegacy = [];
    if (personal) {
      includeLegacy = [
        {
          model: Kuski,
          as: 'KuskiData',
          attributes: ['Kuski'],
        },
      ];
    }

    const legacyTimes = await LegacyFinished.findAll({
      where: { LevelIndex, KuskiIndex },
      attributes: ['Time', 'Driven', 'Source'],
      limit: timeLimit > 10000 ? 10000 : timeLimit,
      include: includeLegacy,
    });
    return [...times, ...legacyTimes]
      .sort((a, b) => a.Time - b.Time)
      .slice(0, parseInt(limit, 10));
  }
  return times;
};

export const getTopAppleRuns = async (LevelIndex, KuskiIndex, limit) => {
  return await Time.findAll({
    where: {
      LevelIndex,
      KuskiIndex,
      Finished: { [Op.not]: 'F' },
      Apples: { [Op.gt]: 0 },
    },
    attributes: ['Apples', 'Driven'],
    order: [['Apples', 'DESC']],
    limit: parseInt(limit, 10),
    include: [
      {
        model: TimeFile,
        as: 'TimeFileData',
      },
    ],
  });
};

const getLatestRuns = async (KuskiIndex, limit, lev, from, to, UserId = 0) => {
  if (UserId !== parseInt(KuskiIndex, 10)) {
    return null;
  }
  let where = { KuskiIndex };
  const LevelName = formatLevelSearch(lev);
  if (LevelName) {
    const level = await Level.findAll({ where: { LevelName } });
    where.LevelIndex = {
      [Op.in]: level.map(r => r.LevelIndex),
    };
  }
  where = { ...where, ...fromTo(from, to, 'Driven', 'datetime') };
  const include = [
    {
      model: Level,
      as: 'LevelData',
      attributes: ['LevelName', 'LongName'],
    },
    {
      model: TimeFile,
      as: 'TimeFileData',
    },
  ];
  const query = {
    where,
    order: [['TimeIndex', 'DESC']],
    include,
    limit: parseInt(limit, 10) > 10000 ? 10000 : parseInt(limit, 10),
  };
  const times = await Time.findAll(query);
  return times;
};

const getLatest = async (KuskiIndex, limit, lev, from, to, UserId = 0) => {
  let where = { KuskiIndex };
  const personal = UserId === parseInt(KuskiIndex, 10);
  const LevelName = formatLevelSearch(lev);
  if (LevelName) {
    const level = await Level.findAll({ where: { LevelName } });
    where.LevelIndex = {
      [Op.in]: level.map(r => r.LevelIndex),
    };
  }
  where = { ...where, ...fromTo(from, to, 'Driven') };
  const include = [
    {
      model: Level,
      as: 'LevelData',
      attributes: ['LevelName', 'Locked', 'Hidden', 'LongName'],
    },
  ];
  if (personal) {
    include.push({
      model: TimeFile,
      as: 'TimeFileData',
    });
  }
  const query = {
    where,
    order: [['TimeIndex', 'DESC']],
    include,
    limit: parseInt(limit, 10) > 10000 ? 10000 : parseInt(limit, 10),
  };
  if (!personal) {
    query.attributes = ['TimeIndex', 'Time', 'Apples', 'Driven', 'LevelIndex'];
  }
  const times = await AllFinished.findAll(query);
  if (personal) {
    return times;
  }
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
  UserId,
) => {
  const personal = UserId === parseInt(KuskiIndex, 10);

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
  const include = [
    {
      model: Kuski,
      as: 'KuskiData',
      attributes: ['Kuski'],
    },
  ];

  if (personal) {
    include.push({
      model: TimeFile,
      as: 'TimeFileData',
    });
  }

  const leaderHistoryWithData = await AllFinished.findAll({
    attributes: personal ? undefined : ['TimeIndex', 'Time', 'Driven'],
    where: {
      TimeIndex: {
        [Op.in]: leaderHistory.map(r => r.TimeIndex),
      },
    },
    include,
  });

  return leaderHistoryWithData;
};

router
  .get('/highlight', async (req, res) => {
    const data = await getHighlights();
    res.json(data);
  })
  .get('/runs/:KuskiIndex/:limit', async (req, res) => {
    const auth = authContext(req);
    const data = await getLatestRuns(
      req.params.KuskiIndex,
      req.params.limit,
      req.query.level,
      req.query.from,
      req.query.to,
      auth.userid,
    );
    res.json(data);
  })
  .get('/appleruns/:LevelIndex/:limit', async (req, res) => {
    const auth = authContext(req);
    const data = await getTopAppleRuns(
      req.params.LevelIndex,
      auth.userid,
      req.params.limit,
    );
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
    const auth = authContext(req);
    let UserId = 0;
    if (auth.auth) {
      UserId = auth.userid;
    }
    const data = await getLeaderHistoryForLevel(
      req.params.LevelIndex,
      req.query.KuskiIndex,
      req.query.BattleIndex,
      req.query.from,
      req.query.to,
      UserId,
    );
    res.json(data);
  })
  .get('/:KuskiIndex/:limit', async (req, res) => {
    const auth = authContext(req);
    const data = await getLatest(
      req.params.KuskiIndex,
      req.params.limit,
      req.query.level,
      req.query.from,
      req.query.to,
      auth.userid,
    );
    res.json(data);
  })
  .get('/:LevelIndex', async (req, res) => {
    const data = await timesByLevel(req.params.LevelIndex);
    res.json(data);
  });

export default router;
