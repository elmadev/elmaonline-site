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

const getTimes = async (LevelIndex, KuskiIndex, limit, LoggedIn = 0) => {
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

const getTimesInRange = async (LevelIndex, from, to) => {
  const lev = await levelInfo(LevelIndex);
  if (!lev || lev.Locked || lev.Hidden) return [];

  const times = await AllFinished.findAll({
    where: { LevelIndex, Driven: { [Op.lt]: to, [Op.gt]: from } },
    order: [['Driven', 'ASC']],
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
    attributes: ['TimeIndex', 'Time', 'Driven'],
  });
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

const timesByLevel = async LevelIndex => {
  const lev = await levelInfo(LevelIndex);
  if (!lev || lev.Locked || lev.Hidden) return [];
  const times = await AllFinished.findAll({
    where: { LevelIndex },
    order: [
      ['Time', 'ASC'],
      ['TimeIndex', 'ASC'],
    ],
    limit: 10000,
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski', 'Country'],
        include: [
          {
            model: Team,
            as: 'TeamData',
          },
        ],
      },
    ],
  });
  return times;
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
  .get('/ranged/:LevelIndex/:from/:to', async (req, res) => {
    const data = await getTimesInRange(
      req.params.LevelIndex,
      req.params.from,
      req.params.to,
    );
    res.json(data);
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
