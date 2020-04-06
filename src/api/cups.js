import express from 'express';
import {
  SiteCupGroup,
  SiteCup,
  Kuski,
  Level,
  SiteCupTime,
} from '../data/models';

const router = express.Router();

const getCups = async () => {
  const data = await SiteCupGroup.findAll({
    where: { Hidden: 0 },
  });
  return data;
};

const getCup = async ShortName => {
  const data = await SiteCupGroup.findOne({
    where: { ShortName },
  });
  return data;
};

const getCupEvents = async CupGroupIndex => {
  const data = await SiteCup.findAll({
    where: { CupGroupIndex },
    include: [
      {
        model: Kuski,
        attributes: ['Kuski'],
        as: 'KuskiData',
      },
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'Level',
      },
      {
        model: SiteCupTime,
        attributes: ['KuskiIndex', 'Time'],
        as: 'CupTimes',
        where: { TimeExists: 1 },
        include: [
          {
            model: Kuski,
            attributes: ['Kuski'],
            as: 'KuskiData',
          },
        ],
      },
    ],
  });
  return data;
};

router
  .get('/', async (req, res) => {
    const data = await getCups();
    res.json(data);
  })
  .get('/:ShortName', async (req, res) => {
    const data = await getCup(req.params.ShortName);
    res.json(data);
  })
  .get('/events/:CupGroupIndex', async (req, res) => {
    const data = await getCupEvents(req.params.CupGroupIndex);
    res.json(data);
  });

export default router;
