import express from 'express';
import { Donate, Kuski, Team } from 'data/models';

const router = express.Router();

const getDonations = async () => {
  const data = await Donate.findAll({
    order: [['DonateIndex', 'DESC']],
    attributes: [
      'KuskiIndex',
      'DonateIndex',
      'payment_date',
      'mc_gross',
      'Processed',
    ],
    include: [
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'KuskiData',
        include: [
          {
            model: Team,
            as: 'TeamData',
            attributes: ['Team', 'TeamIndex'],
          },
        ],
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
