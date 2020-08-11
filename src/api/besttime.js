import express from 'express';
import { Besttime, Kuski, Team, Level, BestMultitime } from '../data/models';

const router = express.Router();

const getTimes = async (LevelIndex, limit) => {
  const times = await Besttime.findAll({
    where: { LevelIndex },
    order: [['Time', 'ASC']],
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
  const times = await BestMultitime.findAll({
    where: { LevelIndex },
    order: [['Time', 'ASC']],
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
        attributes: ['LevelName'],
      },
    ],
    limit: parseInt(limit, 10) > 10000 ? 10000 : parseInt(limit, 10),
  });
  return times.filter(t => t.LevelData !== null);
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
