import express from 'express';
import { acceptNickMail } from 'utils/email';
import { authContext } from 'utils/auth';
import { sendMessage } from 'utils/discord';
import { Op, fn } from 'sequelize';
import {
  SiteSetting,
  Kuski,
  Ban,
  FlagBan,
  ActionLogs,
  Error,
} from '../data/models';
import config from '../config';

const router = express.Router();

const getNickRequests = async () => {
  const ranking = await SiteSetting.findAll({
    where: { SettingName: 'ChangeNick' },
    order: [['SiteSettingIndex', 'DESC']],
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
  });
  return ranking;
};

const getNickRequest = async SiteSettingIndex => {
  const data = await SiteSetting.findOne({
    where: { SiteSettingIndex },
  });
  return data;
};

const WriteActionLog = async (
  KuskiIndex,
  RightsKuski,
  ActionType,
  Action,
  ActionIndex,
  Text,
) => {
  await ActionLogs.create({
    KuskiIndex,
    RightsKuski,
    ActionType,
    Action,
    Time: fn('NOW'),
    ActionIndex,
    Text,
  });
};

const DeclineNick = async (data, modId) => {
  const kuskiInfo = await Kuski.findOne({
    where: { KuskiIndex: data.KuskiIndex },
  });
  await SiteSetting.destroy({
    where: { SiteSettingIndex: data.SiteSettingIndex },
  });
  await WriteActionLog(
    modId,
    data.KuskiIndex,
    'DeclineNick',
    1,
    0,
    `${kuskiInfo.Kuski} >> ${data.Setting}`,
  );
  sendMessage(
    config.discord.channels.admin,
    `:x: Nick change request declined: ${kuskiInfo.Kuski} >> ${data.Setting}`,
  );
};

const AcceptNick = async (data, modId) => {
  const kuskiInfo = await Kuski.findOne({
    where: { KuskiIndex: data.KuskiIndex },
  });
  await Kuski.update(
    { Kuski: data.Setting },
    { where: { KuskiIndex: data.KuskiIndex } },
  );
  await SiteSetting.destroy({
    where: { SiteSettingIndex: data.SiteSettingIndex },
  });
  await acceptNickMail(data.Setting, kuskiInfo.Email, kuskiInfo.Kuski);
  await WriteActionLog(
    modId,
    data.KuskiIndex,
    'AcceptNick',
    1,
    0,
    `${kuskiInfo.Kuski} >> ${data.Setting}`,
  );
  sendMessage(
    config.discord.channels.admin,
    `:white_check_mark: Nick change request accepted: ${kuskiInfo.Kuski} >> ${
      data.Setting
    }`,
  );
};

const getBanlists = async () => {
  const bans = await Ban.findAll({
    where: { Expires: { [Op.gt]: fn('NOW') } },
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
  });
  const flagbans = await FlagBan.findAll({
    where: { Expired: 0, Revoked: 0 },
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
  });
  return { ips: bans, flags: flagbans };
};

const getErrorLog = async (k, ErrorTime) => {
  const findAll = {
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
    limit: 100,
    order: [['ErrorIndex', 'DESC']],
  };
  if (k !== '0' && ErrorTime !== '0') {
    const findKuski = await Kuski.findOne({ where: { Kuski: k } });
    findAll.where = {
      ErrorTime: { [Op.gt]: `${ErrorTime} 00:00:00` },
      KuskiIndex: findKuski.KuskiIndex,
    };
    findAll.order = [['ErrorIndex', 'ASC']];
  } else if (k !== '0') {
    const findKuski = await Kuski.findOne({ where: { Kuski: k } });
    findAll.where = { KuskiIndex: findKuski.KuskiIndex };
  } else if (ErrorTime !== '0') {
    findAll.where = { ErrorTime: { [Op.gt]: `${ErrorTime} 00:00:00` } };
    findAll.order = [['ErrorIndex', 'ASC']];
  }
  const errors = await Error.findAll(findAll);
  return errors;
};

router
  .get('/nickrequests', async (req, res) => {
    const auth = authContext(req);
    if (auth.mod) {
      const data = await getNickRequests();
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/nickrequests/:action/:id', async (req, res) => {
    const auth = authContext(req);
    if (auth.mod) {
      const data = await getNickRequest(req.params.id);
      if (data) {
        if (req.params.action === 'accept') {
          await AcceptNick(data, auth.userid);
        }
        if (req.params.action === 'decline') {
          await DeclineNick(data, auth.userid);
        }
        res.json({ success: 1 });
      } else {
        res.json({ success: 0 });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .get('/banlist', async (req, res) => {
    const auth = authContext(req);
    if (auth.mod) {
      const data = await getBanlists();
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/errorlog/:Kuski/:ErrorTime', async (req, res) => {
    const auth = authContext(req);
    if (auth.mod) {
      const data = await getErrorLog(req.params.Kuski, req.params.ErrorTime);
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  });

export default router;
