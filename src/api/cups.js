import express from 'express';
import { eachSeries } from 'neo-async';
import { forEach } from 'lodash';
import { authContext } from 'utils/auth';
import { format } from 'date-fns';
import moment from 'moment';
import { filterResults, generateEvent, admins } from 'utils/cups';
import { zeroPad } from 'utils/time';
import { sendMessage } from 'utils/discord';
import config from '../config';
import {
  SiteCupGroup,
  SiteCup,
  Kuski,
  Level,
  SiteCupTime,
  SiteCupBlog,
  Team,
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

const getCupEvents = async (CupGroupIndex, KuskiIndex) => {
  const cupGroup = await SiteCupGroup.findOne({
    where: { CupGroupIndex },
  });
  const data = await SiteCup.findAll({
    where: { CupGroupIndex },
    include: [
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'KuskiData',
        include: [
          {
            model: Team,
            as: 'TeamData',
            attributes: ['Team'],
          },
        ],
      },
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'Level',
      },
      {
        model: SiteCupTime,
        attributes: [
          'CupTimeIndex',
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
            attributes: ['Kuski', 'TeamIndex', 'Country'],
            as: 'KuskiData',
            include: [
              {
                model: Team,
                attributes: ['Team'],
                as: 'TeamData',
              },
            ],
          },
        ],
      },
    ],
  });
  return filterResults(data, admins(cupGroup), KuskiIndex);
};

const getCupEvent = async (CupGroupIndex, CupIndex, KuskiIndex) => {
  const cupGroup = await SiteCupGroup.findOne({
    where: { CupGroupIndex },
  });
  const data = await SiteCup.findAll({
    where: { CupGroupIndex, CupIndex },
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
            attributes: ['Kuski', 'TeamIndex', 'Country'],
            as: 'KuskiData',
            include: [
              {
                model: Team,
                attributes: ['Team'],
                as: 'TeamData',
              },
            ],
          },
        ],
      },
    ],
  });
  return filterResults(data, admins(cupGroup), KuskiIndex);
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
  if (!k) return false;
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
  if (data.ShowResults) {
    const event = SiteCup.findOne({ where: { CupIndex } });
    if (event.EndTime < format(new Date(), 't') && event.Updated) {
      await Level.update(
        { Hidden: 0, ForceHide: 0 },
        { where: { LevelIndex: event.LevelIndex } },
      );
    }
  }
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
  const getCupTimes = await SiteCupTime.findAll({
    where: { CupIndex: event.CupIndex },
  });
  const generatedTimes = await generateEvent(event, cup, getTimes, getCupTimes);
  await SiteCupTime.bulkCreate(generatedTimes.insertBulk);
  await eachSeries(generatedTimes.updateBulk, generateUpdate);
  await SiteCup.update({ Updated: 1 }, { where: { CupIndex: event.CupIndex } });
  if (event.EndTime < format(new Date(), 't') && event.ShowResults) {
    await Level.update(
      { Hidden: 0, ForceHide: 0 },
      { where: { LevelIndex: event.LevelIndex } },
    );
  }
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
    { Hidden: 1, Locked: 0, ForceHide: 1 },
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

const TeamReplays = async (CupGroupIndex, KuskiIndex) => {
  const player = await Kuski.findOne({
    where: { KuskiIndex },
    attributes: ['TeamIndex', 'KuskiIndex'],
  });
  if (player.TeamIndex <= 0) return [];
  const recs = await SiteCup.findAll({
    where: { CupGroupIndex },
    attributes: ['CupIndex', 'LevelIndex', 'CupGroupIndex', 'StartTime'],
    include: [
      {
        model: SiteCupTime,
        required: false,
        as: 'CupTimes',
        attributes: [
          'CupTimeIndex',
          'CupIndex',
          'KuskiIndex',
          'TimeIndex',
          'Time',
          'Replay',
          'Code',
          'ShareReplay',
          'Comment',
          'TimeExists',
        ],
        where: { ShareReplay: 1 },
        include: [
          {
            model: Kuski,
            as: 'KuskiData',
            attributes: ['Kuski', 'Country', 'TeamIndex'],
            where: { TeamIndex: player.TeamIndex },
          },
        ],
      },
    ],
  });
  return recs;
};

const MyReplays = async (CupGroupIndex, KuskiIndex) => {
  const recs = await SiteCup.findAll({
    where: { CupGroupIndex },
    attributes: ['CupIndex', 'LevelIndex', 'CupGroupIndex', 'StartTime'],
    include: [
      {
        model: SiteCupTime,
        required: false,
        as: 'CupTimes',
        attributes: [
          'CupTimeIndex',
          'CupIndex',
          'KuskiIndex',
          'TimeIndex',
          'Time',
          'Replay',
          'Code',
          'ShareReplay',
          'Comment',
          'TimeExists',
        ],
        where: { KuskiIndex },
        include: [
          {
            model: Kuski,
            as: 'KuskiData',
            attributes: ['Kuski', 'Country'],
          },
        ],
      },
    ],
  });
  return recs;
};

const UpdateReplay = async data => {
  const getRec = await SiteCupTime.findOne({
    where: { CupTimeIndex: data.CupTimeIndex },
  });
  if (getRec.KuskiIndex === data.KuskiIndex) {
    if (data.field === 'ShareReplay') {
      await SiteCupTime.update(
        { ShareReplay: data.value === 'true' ? 1 : 0 },
        { where: { CupTimeIndex: data.CupTimeIndex } },
      );
    }
    return true;
  }
  return false;
};

const Replay = async CupTimeIndex => {
  const rec = await SiteCupTime.findOne({
    where: { CupTimeIndex },
    attributes: [
      'CupIndex',
      'TimeIndex',
      'CupTimeIndex',
      'Time',
      'TimeExists',
      'Replay',
    ],
    include: [
      {
        model: SiteCup,
        as: 'CupData',
        attributes: [
          'LevelIndex',
          'Designer',
          'CupGroupIndex',
          'EndTime',
          'Updated',
          'ShowResults',
        ],
        include: [
          {
            model: Level,
            as: 'Level',
            attributes: ['LevelName'],
          },
        ],
      },
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski', 'Country', 'TeamIndex'],
        include: [
          {
            model: Team,
            as: 'TeamData',
            attributes: ['Team'],
          },
        ],
      },
    ],
  });
  if (rec.CupData) {
    if (rec.CupData.EndTime < moment().format('X')) {
      if (rec.CupData.Updated) {
        if (rec.CupData.ShowResults) {
          return rec;
        }
      }
    }
  }
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
        ReadAccess: '',
      });
      res.json(add);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/events/:CupGroupIndex', async (req, res) => {
    const auth = authContext(req);
    let KuskiIndex = 0;
    if (auth.auth) {
      KuskiIndex = auth.userid;
    }
    const data = await getCupEvents(req.params.CupGroupIndex, KuskiIndex);
    res.json(data);
  })
  .get('/event/:CupGroupIndex/:CupIndex', async (req, res) => {
    const auth = authContext(req);
    let KuskiIndex = 0;
    if (auth.auth) {
      KuskiIndex = auth.userid;
    }
    const data = await getCupEvent(
      req.params.CupGroupIndex,
      req.params.CupIndex,
      KuskiIndex,
    );
    res.json(data);
  })
  .post('/edit/:CupGroupIndex', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getCupById(req.params.CupGroupIndex);
      if (
        admins(data.dataValues).length > 0 &&
        admins(data.dataValues).indexOf(auth.userid) > -1
      ) {
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
      if (
        admins(data.dataValues).length > 0 &&
        admins(data.dataValues).indexOf(auth.userid) > -1
      ) {
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
      if (
        admins(data.dataValues).length > 0 &&
        admins(data.dataValues).indexOf(auth.userid) > -1
      ) {
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
      if (
        admins(data.dataValues).length > 0 &&
        admins(data.dataValues).indexOf(auth.userid) > -1
      ) {
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
      if (
        admins(data.dataValues).length > 0 &&
        admins(data.dataValues).indexOf(auth.userid) > -1
      ) {
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
      if (
        admins(data.dataValues).length > 0 &&
        admins(data.dataValues).indexOf(auth.userid) > -1
      ) {
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
      const eventSort = (a, b) => a.CupIndex - b.CupIndex;
      const getEventNumber = event => {
        const index = cupData
          .sort(eventSort)
          .findIndex(e => e.CupIndex === event.CupIndex);
        return index + 1;
      };
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
          sendMessage(
            config.discord.channels.events,
            `:newspaper: Interview added for ${
              req.body.ShortName
            } cup event ${getEventNumber(eventData[0])} ${req.body.type
              .replace(/([A-Z])/g, ' $1')
              .trim()
              .toLowerCase()}: <${config.discord.url}cup/${
              req.body.ShortName
            }>`,
          );
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
  })
  .get('/:CupGroupIndex/myreplays', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const recs = await MyReplays(req.params.CupGroupIndex, auth.userid);
      res.json(recs);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/:CupGroupIndex/updatereplay', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const update = await UpdateReplay({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      if (update) {
        res.json({ success: 1 });
      } else {
        res.json({ success: 0, error: 'Not your replay' });
      }
    }
  })
  .get('/:CupGroupIndex/teamreplays', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const recs = await TeamReplays(req.params.CupGroupIndex, auth.userid);
      res.json(recs);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/time/:CupTimeIndex', async (req, res) => {
    const rec = await Replay(req.params.CupTimeIndex);
    res.json(rec);
  });

export default router;
