import express from 'express';
import { forEach } from 'lodash';
import { Op } from 'sequelize';
import {
  Besttime,
  LevelPackLevel,
  Kuski,
  LevelPack,
  Level,
  Team,
} from '../data/models';

const router = express.Router();

const getKuski = async k => {
  const findKuski = await Kuski.findOne({
    where: { Kuski: k },
  });
  return findKuski;
};

const getRecords = async LevelPackName => {
  const packInfo = await LevelPack.findOne({
    where: { LevelPackName },
  });
  const times = await LevelPackLevel.findAll({
    where: { LevelPackIndex: packInfo.LevelPackIndex },
    order: [['LevelPackLevelIndex', 'ASC']],
    include: [
      {
        model: Besttime,
        as: 'LevelBesttime',
        attributes: ['TimeIndex', 'Time', 'KuskiIndex'],
        order: [['Time', 'ASC'], ['TimeIndex', 'ASC']],
        limit: 1,
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'KuskiData',
            include: [
              {
                model: Team,
                as: 'TeamData',
                attributes: ['Team'],
              },
            ],
          },
        ],
      },
      {
        model: Level,
        as: 'Level',
        attributes: ['LevelName', 'LongName'],
      },
    ],
  });
  return times;
};

const getPersonalTimes = async (LevelPackName, KuskiIndex) => {
  const packInfo = await LevelPack.findOne({
    where: { LevelPackName },
  });
  const times = await LevelPackLevel.findAll({
    where: { LevelPackIndex: packInfo.LevelPackIndex },
    order: [['LevelPackLevelIndex', 'ASC']],
    include: [
      {
        model: Besttime,
        as: 'LevelBesttime',
        attributes: ['TimeIndex', 'Time', 'KuskiIndex'],
        where: { KuskiIndex },
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'KuskiData',
          },
        ],
      },
      {
        model: Level,
        as: 'Level',
        attributes: ['LevelName', 'LongName'],
      },
    ],
  });
  return times;
};

const getTimes = async LevelPackIndex => {
  const times = await LevelPackLevel.findAll({
    where: { LevelPackIndex },
    attributes: ['LevelIndex'],
    include: [
      {
        model: Besttime,
        as: 'LevelBesttime',
        attributes: ['TimeIndex', 'Time', 'KuskiIndex'],
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'KuskiData',
          },
        ],
      },
    ],
  });
  return times;
};

const getPacksByQuery = async query => {
  const packs = await LevelPack.findAll({
    where: {
      [Op.or]: [
        { LevelPackName: { [Op.like]: `${query}%` } },
        { LevelPackLongName: { [Op.like]: `${query}%` } },
      ],
    },
    include: [
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'KuskiData',
      },
    ],
  });
  const levels = await LevelPackLevel.findAll({
    attributes: ['LevelPackIndex', 'LevelIndex'],
    include: [
      {
        model: Level,
        as: 'Level',
        attributes: ['LevelName', 'LongName', 'LevelIndex'],
        where: { LevelName: { [Op.like]: `${query}%` } },
      },
      {
        model: LevelPack,
        as: 'LevelPack',
        attributes: ['LevelPackName', 'LevelPackLongName'],
        include: [
          {
            model: Kuski,
            as: 'KuskiData',
            attributes: ['Kuski', 'Country'],
          },
        ],
      },
    ],
  });
  return [...packs, ...levels].filter(
    (v, i, a) => a.findIndex(x => x.LevelPackIndex === v.LevelPackIndex) === i,
  );
};

const totalTimes = times => {
  const tts = [];
  forEach(times, level => {
    forEach(level.LevelBesttime, time => {
      const findKuski = tts.findIndex(x => x.KuskiIndex === time.KuskiIndex);
      if (findKuski > -1) {
        tts[findKuski] = {
          ...tts[findKuski],
          tt: tts[findKuski].tt + time.Time,
          count: tts[findKuski].count + 1,
          TimeIndex:
            time.TimeIndex > tts[findKuski].TimeIndex
              ? time.TimeIndex
              : tts[findKuski].TimeIndex,
        };
      } else {
        tts.push({
          KuskiData: time.KuskiData,
          tt: time.Time,
          KuskiIndex: time.KuskiIndex,
          count: 1,
          TimeIndex: time.TimeIndex,
        });
      }
    });
  });
  return tts.filter(x => x.count === times.length);
};

router
  .get('/:LevelPackIndex/totaltimes', async (req, res) => {
    const data = await getTimes(req.params.LevelPackIndex);
    const tts = totalTimes(data);
    res.json(tts);
  })
  .get('/:LevelPackName/personal/:KuskiIndex', async (req, res) => {
    const getKuskiIndex = await getKuski(req.params.KuskiIndex);
    if (getKuskiIndex) {
      const data = await getPersonalTimes(
        req.params.LevelPackName,
        getKuskiIndex.dataValues.KuskiIndex,
      );
      res.json(data);
    } else {
      res.json({ error: 'Kuski does not exist' });
    }
  })
  .get('/:LevelPackName/records', async (req, res) => {
    const records = await getRecords(req.params.LevelPackName);
    res.json(records);
  })
  .get('/search/:query', async (req, res) => {
    const packs = await getPacksByQuery(req.params.query);
    res.json(packs);
  });

export default router;
