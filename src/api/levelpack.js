import express from 'express';
import { forEach } from 'lodash';
import { WeeklyBest, LevelPackLevel, Kuski } from '../data/models';

const router = express.Router();

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

router.get('/:LevelPackIndex/totaltimes', async (req, res) => {
  const data = await getTimes(req.params.LevelPackIndex);
  const tts = totalTimes(data);
  res.json(tts);
});

export default router;
