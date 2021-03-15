import express from 'express';
import {
  Besttime,
  Kuski,
  Team,
  Level,
  BestMultitime,
  LegacyBesttime,
} from '../data/models';

const router = express.Router();

const levelInfo = async LevelIndex => {
  const lev = await Level.findOne({
    where: { LevelIndex },
    attributes: ['Hidden', 'Locked', 'Legacy'],
  });
  return lev;
};

const getTimes = async (LevelIndex, limit, eolOnly = 0) => {
  const lev = await levelInfo(LevelIndex);
  if (!lev || lev.Locked || lev.Hidden) return [];
  let timeTable = Besttime;
  if (lev.Legacy && !eolOnly) {
    timeTable = LegacyBesttime;
  }
  const times = await timeTable.findAll({
    where: { LevelIndex },
    order: [
      ['Time', 'ASC'],
      ['TimeIndex', 'ASC'],
    ],
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
  if (!lev || lev.Locked || lev.Hidden) return [];
  const times = await BestMultitime.findAll({
    where: { LevelIndex },
    order: [
      ['Time', 'ASC'],
      ['MultiTimeIndex', 'ASC'],
    ],
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

router
  .get('/multi/:LevelIndex/:limit', async (req, res) => {
    const data = await getMultiTimes(req.params.LevelIndex, req.params.limit);
    res.json(data);
  })
  .get('/:LevelIndex/:limit', async (req, res) => {
    const data = await getTimes(req.params.LevelIndex, req.params.limit);
    res.json(data);
  })
  .get('/latest/:KuskiIndex/:limit', async (req, res) => {
    const data = await getLatest(req.params.KuskiIndex, req.params.limit);
    res.json(data);
  })
  .get('/:LevelIndex/:limit/:eolOnly', async (req, res) => {
    const data = await getTimes(
      req.params.LevelIndex,
      req.params.limit,
      parseInt(req.params.eolOnly, 10),
    );
    res.json(data);
  });

export default router;
