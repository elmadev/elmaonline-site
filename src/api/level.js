import express from 'express';
import sequelize from 'sequelize';
import { authContext } from 'utils/auth';
import { Level, Time } from '../data/models';

const router = express.Router();

const attributes = [
  'LevelIndex',
  'LevelName',
  'CRC',
  'LongName',
  'Apples',
  'Killers',
  'Flowers',
  'Locked',
  'SiteLock',
  'Hidden',
  'Legacy',
];

const getLevel = async LevelIndex => {
  const level = await Level.findOne({
    attributes,
    where: { LevelIndex },
  });
  return level;
};

const getLevelStatsForPlayer = async (LevelIndex, KuskiIndex) => {
  const stats = await Time.findAll({
    group: ['Finished'],
    attributes: [
      'Finished',
      [sequelize.fn('COUNT', 'Finished'), 'RunCount'],
      [sequelize.fn('SUM', sequelize.col('Time')), 'TimeSum'],
    ],
    where: { LevelIndex, KuskiIndex },
  });

  return stats;
};

router.get('/:LevelIndex', async (req, res) => {
  const data = await getLevel(req.params.LevelIndex);
  res.json(data);
});

router.get('/timestats/:LevelIndex', async (req, res) => {
  const auth = authContext(req);
  let KuskiIndex = 0;
  if (auth.auth) {
    KuskiIndex = auth.userid;
  }

  const data = await getLevelStatsForPlayer(req.params.LevelIndex, KuskiIndex);
  res.json(data);
});

export default router;
