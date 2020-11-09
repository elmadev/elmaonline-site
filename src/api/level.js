import express from 'express';
import { Level } from '../data/models';

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

router.get('/:LevelIndex', async (req, res) => {
  const data = await getLevel(req.params.LevelIndex);
  res.json(data);
});

export default router;
