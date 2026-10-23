import express from 'express';
import type { Request, Response } from 'express';
import { Country } from '#data/models';
import type { CountryData } from '#contract/country.ts';

const router = express.Router();

const getCountries = async () => {
  const data = await Country.findAll({
    order: [['Name', 'ASC']],
  });
  return data;
};

router.get('/', async (req: Request, res: Response<CountryData[]>) => {
  const data = await getCountries();
  res.json(data);
});

export default router;
