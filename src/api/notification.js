import express from 'express';
import { authContext } from 'utils/auth';
import sequelize from 'sequelize';
import { Notification } from '../data/models';

const router = express.Router();

const getNotifications = async KuskiIndex => {
  const data = await Notification.findAll({
    where: { KuskiIndex },
    order: [['NotificationIndex', 'DESC']],
  });
  return data;
};

const getNewNotificationsCount = async KuskiIndex => {
  const data = await Notification.count({
    where: { KuskiIndex, SeenAt: null },
  });
  return data;
};

const markNotificationsSeen = async KuskiIndex => {
  const data = await Notification.update(
    { SeenAt: sequelize.fn('UNIX_TIMESTAMP') },
    {
      where: { KuskiIndex, SeenAt: null },
    },
  );
  return data;
};

router.get('/', async (req, res) => {
  const auth = authContext(req);
  if (auth.auth) {
    const data = await getNotifications(auth.userid);
    res.json(data);
  } else {
    res.sendStatus(401);
  }
});

router.get('/count', async (req, res) => {
  const auth = authContext(req);
  if (auth.auth) {
    const data = await getNewNotificationsCount(auth.userid);
    res.json(data);
  } else {
    res.sendStatus(401);
  }
});

router.post('/markSeen', async (req, res) => {
  const auth = authContext(req);
  if (auth.auth) {
    const data = await markNotificationsSeen(auth.userid);
    res.json(data);
  } else {
    res.sendStatus(401);
  }
});

export default router;
