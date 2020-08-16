import express from 'express';
import { eachSeries } from 'neo-async';
import { forEach } from 'lodash';
import { authContext } from 'utils/auth';
import { format } from 'date-fns';
import { filterResults, generateEvent } from 'utils/cups';
import { zeroPad } from 'utils/time';
import {
  SiteCupGroup,
  SiteCup,
  Kuski,
  Level,
  SiteCupTime,
  SiteCupBlog,
  Time,
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
        attributes: [
          'KuskiIndex',
          'Time',
          'TimeExists',
          'CupTimeIndex',
          'Replay',
        ],
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

const DeleteEvent = async data => {
  await SiteCup.destroy({
    where: { CupIndex: data.CupIndex },
  });
  return {};
};

const generateUpdate = async (data, done) => {
  await SiteCupTime.update(
    { TimeIndex: data.TimeIndex, TimeExists: 1 },
    { where: { CupTimeIndex: data.CupTimeIndex } },
  );
  done();
};

const generate = async (event, cup) => {
  const getTimes = await Time.findAll({
    where: { LevelIndex: event.LevelIndex },
    order: [['TimeIndex', 'ASC']],
  });
  const generatedTimes = await generateEvent(event, cup, getTimes);
  await SiteCupTime.bulkCreate(generatedTimes.insertBulk);
  await eachSeries(generatedTimes.updateBulk, generateUpdate);
  await SiteCup.update({ Updated: 1 }, { where: { CupIndex: event.CupIndex } });
  return {};
};

const getUnstarted = async () => {
  const unStarted = await SiteCup.findAll({
    where: { Started: 0 },
    include: [
      {
        model: Level,
        as: 'Level',
        attributes: ['LevelIndex', 'Hidden', 'Locked'],
      },
    ],
  });
  return unStarted;
};

const unlockLevel = async (indices, done) => {
  await Level.update(
    { Hidden: 1, Locked: 0 },
    { where: { LevelIndex: indices.LevelIndex } },
  );
  await SiteCup.update(
    { Started: 1 },
    { where: { CupIndex: indices.CupIndex } },
  );
  done();
};

const AddInterview = async data => {
  await SiteCup.update(
    { [`${data.type}Interview`]: data.text },
    { where: { CupIndex: data.CupIndex } },
  );
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
  })
  .post('/:CupGroupIndex/event/:CupIndex/delete', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getCupById(req.params.CupGroupIndex);
      if (data.dataValues.KuskiIndex === auth.userid) {
        await DeleteEvent(req.body);
        res.json({ success: true });
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/:CupGroupIndex/event/:CupIndex/generate', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getCupById(req.params.CupGroupIndex);
      if (data.dataValues.KuskiIndex === auth.userid) {
        await generate(req.body, data.dataValues);
        res.json({ success: true });
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/unlock', async (req, res) => {
    const data = await getUnstarted();
    const toUnlock = [];
    forEach(data, event => {
      if (
        event.StartTime <= format(new Date(), 't') &&
        (event.Level.Hidden === 0 ||
          event.Level.Locked === 1 ||
          event.Started === 0)
      ) {
        toUnlock.push({
          LevelIndex: event.LevelIndex,
          CupIndex: event.CupIndex,
        });
      }
    });
    eachSeries(toUnlock, unlockLevel, () => {
      res.json({ data });
    });
  })
  .post('/:CupGroupIndex/event/:CupIndex/interview', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const cupData = await getCupEvents(req.params.CupGroupIndex);
      const eventData = cupData.filter(
        c => c.CupIndex === parseInt(req.params.CupIndex, 10),
      );
      if (eventData.length > 0) {
        let add = false;
        if (
          req.body.type === 'Designer' &&
          auth.userid === eventData[0].Designer
        ) {
          add = true;
        } else if (req.body.type === 'FirstPlace') {
          if (eventData[0].CupTimes.length > 0) {
            if (auth.userid === eventData[0].CupTimes[0].KuskiIndex) {
              add = true;
            }
          }
        } else if (req.body.type === 'SecondPlace') {
          if (eventData[0].CupTimes.length > 1) {
            if (auth.userid === eventData[0].CupTimes[1].KuskiIndex) {
              add = true;
            }
          }
        } else if (req.body.type === 'ThirdPlace') {
          if (eventData[0].CupTimes.length > 2) {
            if (auth.userid === eventData[0].CupTimes[2].KuskiIndex) {
              add = true;
            }
          }
        }
        if (add) {
          await AddInterview({
            ...req.body,
            KuskiIndex: auth.userid,
          });
          res.json({ success: 1 });
        } else {
          res.json({ success: 0, error: 'Not eligable to add interview' });
        }
      } else {
        res.json({ success: 0, error: 'No events found' });
      }
    } else {
      res.sendStatus(401);
    }
  });

export default router;
