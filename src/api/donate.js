import express from 'express';
import { Donate, Kuski } from '#data/models';

const router = express.Router();

const getDonations = async () => {
  const data = await Donate.findAll({
    order: [['DonateIndex', 'DESC']],
    attributes: [
      'KuskiIndex',
      'DonateIndex',
      'payment_date',
      'mc_gross',
      'mc_fee',
      'Processed',
    ],
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
      },
    ],
  });
  return data;
};

router.get('/', async (req, res) => {
  const data = await getDonations();
  res.json(data);
});

export default router;
