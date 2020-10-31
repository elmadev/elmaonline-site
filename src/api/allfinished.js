import express from 'express';
import { Op } from 'sequelize';
import { format, subWeeks } from 'date-fns';
import { authContext } from 'utils/auth';
import { AllFinished, Level, Kuski, LegacyFinished } from '../data/models';

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
  return { week, twoweek, threeweek, fourweek };
};

const getTimes = async (LevelIndex, KuskiIndex, limit, LoggedIn = 0) => {
  const lev = await levelInfo(LevelIndex);
  if (!lev) return [];
  if (lev.Hidden && parseInt(KuskiIndex, 10) !== LoggedIn) return [];
  let timeLimit = parseInt(limit, 10);
  if (lev.Legacy) {
    timeLimit = 10000;
  }
  const times = await AllFinished.findAll({
    where: { LevelIndex, KuskiIndex },
    order: [['Time', 'ASC'], ['TimeIndex', 'ASC']],
    attributes: ['TimeIndex', 'Time', 'Apples', 'Driven'],
    limit: timeLimit > 10000 ? 10000 : timeLimit,
  });
  if (lev.Legacy) {
    const legacyTimes = await LegacyFinished.findAll({
      where: { LevelIndex, KuskiIndex },
      attributes: ['Time', 'Driven'],
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
  if (!lev || lev.Hidden) {
    return [];
  }

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
        attributes: ['LevelName', 'Hidden'],
      },
    ],
    limit: parseInt(limit, 10) > 10000 ? 10000 : parseInt(limit, 10),
  });
  return times.filter(t => {
    if (t.LevelData) {
      if (t.LevelData.Hidden) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  });
};

router
  .get('/highlight', async (req, res) => {
    const data = await getHighlights();
    res.json([
      9999999999,
      data.week.TimeIndex,
      data.twoweek.TimeIndex,
      data.threeweek.TimeIndex,
      data.fourweek.TimeIndex,
    ]);
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
  });

export default router;
