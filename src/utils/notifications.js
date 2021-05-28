import DataType, { Op } from 'sequelize';
import { groupBy } from 'lodash';
import { notificationMail } from 'utils/email';
import { discordNotification } from 'utils/discord';
import { getTimes } from '../api/besttime';
import { getTimes as getAllTimes } from '../api/allfinished';
import { getFavouritedBy } from '../api/level';
import { Notification, Setting, Kuski } from '../data/models';

const NotifSetting = async (KuskiIndex, type) => {
  const Settings = await Setting.findOne({
    where: { KuskiIndex },
  });
  if (!Settings) {
    return { Settings: null, Send: 1 };
  }
  return { Settings, Send: Settings[type] };
};

const sendThirdParty = async (KuskiIndex, type, Settings, meta) => {
  if (!Settings) {
    return;
  }
  const KuskiInfo = await Kuski.findOne({
    where: { KuskiIndex },
    attributes: ['Kuski', 'Email'],
  });
  let Email = 0;
  let Discord = 0;
  if (Settings) {
    if (Settings.SendEmail && KuskiInfo.Email) {
      Email = 1;
    }
    if (Settings.SendDiscord && Settings.DiscordId) {
      Discord = 1;
    }
  }
  if (Email) {
    await notificationMail(KuskiInfo, type, meta);
  }
  if (Discord) {
    await discordNotification(Settings.DiscordId, type, meta);
  }
};

// Creates notification for news item
export const createNewNewsNotification = async newsItem => {
  const allKuskis = await Kuski.findAll({ where: { Confirmed: 1 }, limit: 10 });
  const kuski = await newsItem.getKuskiData();
  const notifs = [];
  allKuskis.forEach(k => {
    notifs.push({
      KuskiIndex: k.KuskiIndex,
      CreatedAt: DataType.fn('UNIX_TIMESTAMP'),
      Type: 'news',
      Meta: JSON.stringify({
        Headline: newsItem.Headline,
        KuskiIndex: newsItem.KuskiIndex,
        kuski: kuski.Kuski,
      }),
    });
  });
  await Notification.bulkCreate(notifs);

  // bulk send to discord, skip email due to formatting issues and 300 a day limit at the provider
  const Discords = await Setting.findAll({
    where: { DiscordId: { [Op.not]: null }, SendDiscord: 1 },
  });
  Discords.forEach(d => {
    discordNotification(d.DiscordId, 'news', {
      Headline: newsItem.Headline,
      KuskiIndex: newsItem.KuskiIndex,
      kuski: kuski.Kuski,
      text: newsItem.News,
    });
  });
};

// Creates notification for uploader of the replay
export const createNewCommentNotification = async replayComment => {
  const replay = await replayComment.getReplay();
  const kuski = await replayComment.getKuskiData();

  if (replayComment.KuskiIndex === replay.UploadedBy) {
    return;
  }

  const { Settings, Send } = await NotifSetting(replay.UploadedBy, 'Comment');
  if (!Send) {
    return;
  }

  await Notification.create({
    KuskiIndex: replay.UploadedBy,
    CreatedAt: DataType.fn('UNIX_TIMESTAMP'),
    Type: 'comment',
    Meta: JSON.stringify({
      ...replayComment.dataValues,
      kuski: kuski.Kuski,
      replayName: replay.RecFileName,
      replayUUID: replay.UUID,
    }),
  });

  await sendThirdParty(replay.UploadedBy, 'comment', Settings, {
    ...replayComment.dataValues,
    kuski: kuski.Kuski,
    replayName: replay.RecFileName,
    replayUUID: replay.UUID,
  });
};

// Creates notification for the previous record holder
export const createTimeBeatenNotification = async body => {
  if (body.battleIndex) {
    return;
  }

  if (body.position !== 1) {
    return;
  }

  const top2 = await getTimes(body.levelIndex, 2, 0);
  // If theres only one time, do nothing
  if (top2.length === 1) {
    return;
  }

  const { Settings, Send } = await NotifSetting(top2[1].KuskiIndex, 'Beaten');
  if (!Send) {
    return;
  }

  // Fetch top2 times for new leader
  const top2ForNewLeader = await getAllTimes(
    body.levelIndex,
    body.kuskiIndex,
    2,
  );

  // Check if someone's time was really beaten
  let timeBeaten = true;
  if (
    top2ForNewLeader.length === 2 &&
    top2[1].Time > top2ForNewLeader[1].Time
  ) {
    timeBeaten = false;
  }

  if (timeBeaten) {
    await Notification.create({
      KuskiIndex: top2[1].KuskiIndex,
      CreatedAt: DataType.fn('UNIX_TIMESTAMP'),
      Type: 'beaten',
      Meta: JSON.stringify({
        ...body,
      }),
    });
    await sendThirdParty(top2[1].KuskiIndex, 'beaten', Settings, {
      ...body,
    });
  }
};

// Creates notification if user has favourited the levelpack level belongs to
export const createBestTimeNotification = async body => {
  if (body.battleIndex) {
    return;
  }

  if (body.position !== 1) {
    return;
  }

  const favouritedBy = await getFavouritedBy(body.levelIndex);
  const groupedByKuski = groupBy(favouritedBy, 'KuskiIndex');

  Object.entries(groupedByKuski).forEach(async ([KuskiIndex, levPacks]) => {
    const { Settings, Send } = await NotifSetting(KuskiIndex, 'Besttime');
    if (!Send) {
      return;
    }
    await Notification.create({
      KuskiIndex,
      CreatedAt: DataType.fn('UNIX_TIMESTAMP'),
      Type: 'besttime',
      Meta: JSON.stringify({
        ...body,
        levPacks,
      }),
    });
    await sendThirdParty(KuskiIndex, 'besttime', Settings, {
      ...body,
      levPacks,
    });
  });
};
