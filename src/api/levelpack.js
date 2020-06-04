import express from 'express';
import { forEach } from 'lodash';
import {
  WeeklyBest,
  LevelPackLevel,
  Kuski,
  LevelPack,
  Level,
} from '../data/models';

const router = express.Router();

const getPersonalTimes = async (LevelPackName, KuskiIndex) => {
  const packInfo = await LevelPack.findOne({
    where: { LevelPackName },
  });
  const times = await LevelPackLevel.findAll({
    where: { LevelPackIndex: packInfo.LevelPackIndex },
    include: [
      {
        model: WeeklyBest,
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
        model: WeeklyBest,
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
    const data = await getPersonalTimes(
      req.params.LevelPackName,
      req.params.KuskiIndex,
    );
    res.json(data);
  });

export default router;
