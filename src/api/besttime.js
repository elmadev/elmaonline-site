import express from 'express';
import { Besttime, Kuski, Team, Level, BestMultitime } from '../data/models';

const router = express.Router();

const levelInfo = async LevelIndex => {
  const lev = await Level.findOne({
    where: { LevelIndex },
    attributes: ['Hidden', 'Locked'],
  });
  return lev;
};

const getTimes = async (LevelIndex, limit) => {
  const lev = await levelInfo(LevelIndex);
  if (lev.Hidden) return [];
  const times = await Besttime.findAll({
    where: { LevelIndex },
    order: [['Time', 'ASC'], ['TimeIndex', 'ASC']],
    limit: parseInt(limit, 10),
    include: [
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'KuskiData',
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

const getMultiTimes = async (LevelIndex, limit) => {
  const lev = await levelInfo(LevelIndex);
  if (lev.Hidden) return [];
  const times = await BestMultitime.findAll({
    where: { LevelIndex },
    order: [['Time', 'ASC'], ['MultiTimeIndex', 'ASC']],
    limit: parseInt(limit, 10),
    include: [
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'Kuski1Data',
        include: [
          {
            model: Team,
            as: 'TeamData',
          },
        ],
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'Kuski2Data',
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

const getLatest = async (KuskiIndex, limit) => {
  const times = await Besttime.findAll({
    where: { KuskiIndex },
    order: [['TimeIndex', 'DESC']],
    attributes: ['TimeIndex', 'Time', 'Driven', 'LevelIndex'],
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
  .get('/:LevelIndex/:limit', async (req, res) => {
    const data = await getTimes(req.params.LevelIndex, req.params.limit);
    res.json(data);
  })
  .get('/latest/:KuskiIndex/:limit', async (req, res) => {
    const data = await getLatest(req.params.KuskiIndex, req.params.limit);
    res.json(data);
  })
  .get('/multi/:LevelIndex/:limit', async (req, res) => {
    const data = await getMultiTimes(req.params.LevelIndex, req.params.limit);
    res.json(data);
  });

export default router;
