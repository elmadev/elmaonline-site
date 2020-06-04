import express from 'express';
import { Op } from 'sequelize';
import { format, subWeeks } from 'date-fns';
import { AllFinished } from '../data/models';

const router = express.Router();

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

const getTimes = async (LevelIndex, KuskiIndex, limit) => {
  const times = await AllFinished.findAll({
    where: { LevelIndex, KuskiIndex },
    order: [['Time', 'ASC']],
    attributes: ['TimeIndex', 'Time', 'Apples', 'Driven'],
    limit: parseInt(limit, 10),
  });
  return times;
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
    const data = await getTimes(
      req.params.LevelIndex,
      req.params.KuskiIndex,
      req.params.limit,
    );
    res.json(data);
  });

export default router;
