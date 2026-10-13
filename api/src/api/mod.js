import express from 'express';
import neoAsync from 'neo-async';
const { eachSeries } = neoAsync;
import { acceptNickMail } from '#utils/email';
import requireMod from '#middlewares/requireMod';
import { secretMatches } from '#utils/auth';
import { sendMessage } from '#utils/discord';
import { validKuski } from '#utils/names';
import { format, addDays } from 'date-fns';
import { Op, fn } from 'sequelize';
import {
  SiteSetting,
  Kuski,
  Ban,
  FlagBan,
  ActionLogs,
  Error,
  Logs,
} from '#data/models';
import config from '../config.js';

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

export const WriteActionLog = async (
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
  const kuskiInfo = await Kuski.scope(null).findOne({
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
    `:white_check_mark: Nick change request accepted: ${kuskiInfo.Kuski} >> ${data.Setting}`,
  );
};

const getBanlists = async KuskiIndex => {
  const bansQuery = {
    where: { Expires: { [Op.gt]: fn('NOW') } },
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
  };
  const flagsQuery = {
    where: { Expired: 0, Revoked: 0 },
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
  };
  if (KuskiIndex) {
    bansQuery.where = { ...bansQuery.where, KuskiIndex };
    flagsQuery.where = { ...flagsQuery.where, KuskiIndex };
  }
  const bans = await Ban.findAll(bansQuery);
  const flagbans = await FlagBan.findAll(flagsQuery);
  return { ips: bans, flags: flagbans };
};

const banKuski = async data => {
  let add = 0;
  switch (data.severity) {
    case 'warning':
      add = 365;
      break;
    case 'week':
      add = 7;
      break;
    case 'twoweek':
      add = 14;
      break;
    case 'year':
      add = 365;
      break;
    default:
  }
  const ExpireDate = format(addDays(new Date(), add), 't');
  const insert = await FlagBan.create({
    KuskiIndex: data.KuskiIndex,
    BanType: data.banType,
    ExpireDate,
    Reason: data.banText,
    Severeness: data.severity,
  });
  await WriteActionLog(
    data.modId,
    data.KuskiIndex,
    data.banType,
    1,
    insert.FlagBanIndex,
    '',
  );
  if (data.severity !== 'warning') {
    switch (data.banType) {
      case 'PlayBan':
        await Kuski.update(
          { RPlay: 0 },
          { where: { KuskiIndex: data.KuskiIndex } },
        );
        break;
      case 'ChatBan':
        await Kuski.update(
          { RChat: 0 },
          { where: { KuskiIndex: data.KuskiIndex } },
        );
        break;
      case 'StartBan':
        await Kuski.update(
          { RStartBattle: 0, RSpecialBattle: 0 },
          { where: { KuskiIndex: data.KuskiIndex } },
        );
        break;
      default:
    }
  }
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

const getActionLog = async (k, LogTime) => {
  const findAll = {
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
      {
        model: Kuski,
        as: 'RightsKuskiData',
        attributes: ['Kuski'],
      },
    ],
    limit: 100,
    order: [['ActionLogsIndex', 'DESC']],
  };
  if (k !== '0' && LogTime !== '0') {
    const findKuski = await Kuski.findOne({ where: { Kuski: k } });
    findAll.where = {
      Time: { [Op.gt]: `${LogTime} 00:00:00` },
      KuskiIndex: findKuski.KuskiIndex,
    };
    findAll.order = [['ActionLogsIndex', 'ASC']];
  } else if (k !== '0') {
    const findKuski = await Kuski.scope(null).findOne({ where: { Kuski: k } });
    findAll.where = { KuskiIndex: findKuski.KuskiIndex };
  } else if (LogTime !== '0') {
    findAll.where = { Time: { [Op.gt]: `${LogTime} 00:00:00` } };
    findAll.order = [['ActionLogsIndex', 'ASC']];
  }
  const logs = await ActionLogs.findAll(findAll);
  return logs;
};

const modRights = [
  'Confirm',
  'RStartBattle',
  'RSpecialBattle',
  'RStartCup',
  'RStart24htt',
  'RStop',
];
const adminRights = ['RMod'];

const giveRights = async (Right, KuskiIndex, modId) => {
  const findKuski = await Kuski.scope(null).findOne({
    where: { KuskiIndex },
  });
  if (!findKuski) {
    return false;
  }
  if (Right === 'Confirm') {
    await findKuski.update({
      Confirmed: 1,
      RChat: 1,
      RPlay: 1,
      RMultiPlay: 1,
      ConfirmCode: '',
    });
  }
  if (Right !== 'Confirm') {
    await findKuski.update({ [Right]: 1 });
  }
  await WriteActionLog(modId, KuskiIndex, Right, 1, 0, '');
  return true;
};

const getIPlogs = async KuskiIndex => {
  const data = await Logs.findAll({
    where: { KuskiIndex },
    order: [['LogIndex', 'DESC']],
    limit: 1000,
  });
  return data;
};

const getExpired = async () => {
  const data = FlagBan.findAll({
    where: {
      Expired: 0,
      ExpireDate: { [Op.lt]: format(new Date(), 't') },
    },
  });
  return data;
};

const expiredExpired = async (data, done) => {
  await FlagBan.update(
    { Expired: 1 },
    { where: { FlagBanIndex: data.FlagBanIndex } },
  );
  const severenesses = ['year', 'week', 'twoweek'];
  const types = {
    PlayBan: 'RPlay',
    ChatBan: 'RChat',
    StartBan: 'RStartBattle',
  };
  if (severenesses.indexOf(data.Severeness) > -1) {
    await Kuski.update(
      { [types[data.BanType]]: 1 },
      { where: { KuskiIndex: data.KuskiIndex } },
    );
  }
  done();
};

router
  .get('/nickrequests', requireMod, async (req, res) => {
    const data = await getNickRequests();
    res.json(data);
  })
  .post('/nickrequests/:action/:id', requireMod, async (req, res) => {
    const data = await getNickRequest(req.params.id);
    if (data) {
      if (req.params.action === 'accept') {
        // requests made before name validation existed may be invalid
        if (!validKuski(data.Setting)) {
          res.json({ success: 0 });
          return;
        }
        await AcceptNick(data, req.auth.userid);
      }
      if (req.params.action === 'decline') {
        await DeclineNick(data, req.auth.userid);
      }
      res.json({ success: 1 });
    } else {
      res.json({ success: 0 });
    }
  })
  .get('/banlist', requireMod, async (req, res) => {
    const data = await getBanlists(0);
    res.json(data);
  })
  .get('/banlist/:KuskiIndex', requireMod, async (req, res) => {
    const data = await getBanlists(req.params.KuskiIndex);
    res.json(data);
  })
  .post('/bankuski', requireMod, async (req, res) => {
    await banKuski({ ...req.body, modId: req.auth.userid });
    res.json({ success: 1 });
  })
  .get('/errorlog/:Kuski/:ErrorTime', requireMod, async (req, res) => {
    const data = await getErrorLog(req.params.Kuski, req.params.ErrorTime);
    res.json(data);
  })
  .get('/actionlog/:Kuski/:ErrorTime', requireMod, async (req, res) => {
    const data = await getActionLog(req.params.Kuski, req.params.ErrorTime);
    res.json(data);
  })
  .post('/giverights', requireMod, async (req, res) => {
    const { Right } = req.body;
    if (
      !modRights.includes(Right) &&
      !(adminRights.includes(Right) && req.auth.admin)
    ) {
      res.sendStatus(401);
    } else if (await giveRights(Right, req.body.KuskiIndex, req.auth.userid)) {
      res.json({ success: 1 });
    } else {
      res.sendStatus(404);
    }
  })
  .get('/iplogs/:KuskiIndex', requireMod, async (req, res) => {
    const logs = await getIPlogs(req.params.KuskiIndex);
    res.json(logs);
  })
  // cron job, lifts expired bans
  .post('/unban', async (req, res) => {
    if (!secretMatches(req.header('Authorization'), config.run.ranking)) {
      res.sendStatus(401);
      return;
    }
    const expired = await getExpired();
    await eachSeries(expired, expiredExpired);
    res.json({ unbanned: expired.length });
  });

export default router;
