import express from 'express';
import { SiteCupGroup } from '../data/models';

const router = express.Router();

const getCups = async () => {
  const data = await SiteCupGroup.findAll({
    where: { Hidden: 0 },
  });
  return data;
};

router.get('/', async (req, res) => {
  const data = await getCups();
  res.json(data);
});

export default router;
