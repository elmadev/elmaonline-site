import express from 'express';
import { Country } from '#data/models';

const router = express.Router();

const getCountries = async () => {
  const data = await Country.findAll({
    order: [['Name', 'ASC']],
  });
  return data;
};

router.get('/', async (req, res) => {
  const data = await getCountries();
  res.json(data);
});

export default router;
