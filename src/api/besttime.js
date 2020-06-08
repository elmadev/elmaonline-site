import express from 'express';
import { Besttime, Kuski, Team } from '../data/models';

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

router.get('/:LevelIndex/:limit', async (req, res) => {
  const data = await getTimes(req.params.LevelIndex, req.params.limit);
  res.json(data);
});

export default router;
