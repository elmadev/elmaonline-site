import DataType from 'sequelize';
import { groupBy } from 'lodash';
import { notificationMail } from 'utils/email';
import { discordNotification } from 'utils/discord';
import { getTimes } from '../api/besttime';
import { getTimes as getAllTimes } from '../api/allfinished';
import { getFavouritedBy } from '../api/level';
import { Notification, Setting, Kuski } from '../data/models';

const sendThirdParty = async (KuskiIndex, type, meta) => {
  const KuskiInfo = await Kuski.findOne({
    where: { KuskiIndex },
    attributes: ['Kuski', 'Email'],
  });
  const Settings = await Setting.findOne({
    where: { KuskiIndex },
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

// Creates notification for uploader of the replay
export const createNewCommentNotification = async replayComment => {
  const replay = await replayComment.getReplay();
  const kuski = await replayComment.getKuskiData();

  if (replayComment.KuskiIndex === replay.UploadedBy) {
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

  await sendThirdParty(replay.UploadedBy, 'comment', {
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
    await sendThirdParty(top2[1].KuskiIndex, 'beaten', {
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
    await Notification.create({
      KuskiIndex,
      CreatedAt: DataType.fn('UNIX_TIMESTAMP'),
      Type: 'besttime',
      Meta: JSON.stringify({
        ...body,
        levPacks,
      }),
    });
    await sendThirdParty(KuskiIndex, 'besttime', {
      ...body,
      levPacks,
    });
  });
};
