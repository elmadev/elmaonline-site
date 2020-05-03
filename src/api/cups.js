import express from 'express';
import { authContext } from 'utils/auth';
import { filterResults } from 'utils/cups';
import { zeroPad } from 'utils/time';
import {
  SiteCupGroup,
  SiteCup,
  Kuski,
  Level,
  SiteCupTime,
  SiteCupBlog,
} from '../data/models';

const router = express.Router();

const getCups = async () => {
  const data = await SiteCupGroup.findAll({
    where: { Hidden: 0 },
  });
  return data;
};

const getCupById = async CupGroupIndex => {
  const data = await SiteCupGroup.findOne({
    where: { CupGroupIndex },
  });
  return data;
};

const getCup = async ShortName => {
  const data = await SiteCupGroup.findOne({
    where: { ShortName },
    include: [
      {
        model: SiteCupBlog,
        as: 'CupBlog',
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'KuskiData',
          },
        ],
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'KuskiData',
      },
    ],
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
        required: false,
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

const editCup = async (CupGroupIndex, data) => {
  await SiteCupGroup.update(data, {
    where: { CupGroupIndex },
  });
  return true;
};

const addCupBlog = async Data => {
  const NewCupBlog = await SiteCupBlog.create(Data);
  return NewCupBlog;
};

const addCup = async data => {
  const NewCup = await SiteCupGroup.create(data);
  return NewCup;
};

const getKuski = async k => {
  const findKuski = await Kuski.findOne({
    where: { Kuski: k },
    attributes: ['KuskiIndex', 'Kuski'],
  });
  return findKuski;
};

const addEvent = async data => {
  const newEvent = await SiteCup.create(data);
  return newEvent;
};

const EditEvent = async (CupIndex, data) => {
  await SiteCup.update(data, {
    where: { CupIndex },
  });
  return {};
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
  .post('/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const add = await addCup({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      res.json(add);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/events/:CupGroupIndex', async (req, res) => {
    const data = await getCupEvents(req.params.CupGroupIndex);
    res.json(data);
  })
  .post('/edit/:CupGroupIndex', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getCupById(req.params.CupGroupIndex);
      if (data.dataValues.KuskiIndex === auth.userid) {
        await editCup(req.params.CupGroupIndex, {
          ...req.body,
        });
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/blog/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getCupById(req.body.CupGroupIndex);
      if (data.dataValues.KuskiIndex === auth.userid) {
        const insert = await addCupBlog({
          ...req.body,
          KuskiIndex: auth.userid,
        });
        res.json(insert);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/:CupGroupIndex/event/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getCupById(req.params.CupGroupIndex);
      if (data.dataValues.KuskiIndex === auth.userid) {
        const kuski = await getKuski(req.body.Designer);
        const insert = await addEvent({
          CupGroupIndex: req.params.CupGroupIndex,
          LevelIndex: req.body.LevelIndex ? req.body.LevelIndex : 0,
          StartTime: `${req.body.StartTime} ${zeroPad(
            req.body.StartHour,
            2,
          )}:00:00`,
          EndTime: `${req.body.EndTime} ${zeroPad(req.body.EndHour, 2)}:00:00`,
          Designer: kuski ? kuski.KuskiIndex : 0,
        });
        res.json(insert);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/:CupGroupIndex/event/:CupIndex/edit', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getCupById(req.params.CupGroupIndex);
      if (data.dataValues.KuskiIndex === auth.userid) {
        let kuski;
        if (req.body.Designer) {
          kuski = await getKuski(req.body.Designer);
          if (kuski) {
            req.body.Designer = kuski.KuskiIndex;
          }
        }
        if (!req.body.Designer || (req.body.Designer && kuski)) {
          const edit = await EditEvent(req.params.CupIndex, req.body);
          res.json(edit);
        } else {
          res.json({ error: "Kuski doesn't exist" });
        }
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  });

export default router;
