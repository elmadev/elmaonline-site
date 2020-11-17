import express from 'express';
import { Ranking } from '../data/models';

const router = express.Router();

const getPersonalRanking = async KuskiIndex => {
  const ranking = await Ranking.findAll({
    where: { KuskiIndex },
  });
  return ranking;
};

router.get('/kuski/:KuskiIndex', async (req, res) => {
  const data = await getPersonalRanking(req.params.KuskiIndex);
  res.json(data);
});

export default router;
