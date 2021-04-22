import DataType from 'sequelize';
import { getTimes } from '../api/besttime';
import { getTimes as getAllTimes } from '../api/allfinished';
import { Notification } from '../data/models';

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
};

// Creates notification for the previous record holder
export const createTimeBeatenNotification = async body => {
  if (body.position === 1) {
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
    }
  }
};
