import express from 'express';
import { authContext } from 'utils/auth';
import { filterResults } from 'utils/cups';
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
        attributes: ['KuskiIndex', 'Time', 'TimeExists'],
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
  return filterResults(data);
};

const editCup = async (ShortName, data) => {
  await SiteCupGroup.update(data, {
    where: { ShortName },
  });
  return true;
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
  })
  .post('/:ShortName', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getCup(req.params.ShortName);
      if (data.dataValues.KuskiIndex === auth.userid) {
        await editCup(req.params.ShortName, {
          ...req.body,
          KuskiIndex: auth.userid,
        });
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  });

export default router;
