import express from 'express';
import { authContext } from 'utils/auth';
import { createNewNewsNotification } from 'utils/notifications';
import { News, Kuski, SiteSetting } from 'data/models';
import { fn } from 'sequelize';

const router = express.Router();

const getNews = async amount => {
  const data = News.findAll({
    limit: amount,
    order: [['NewsIndex', 'DESC']],
    include: [
      {
        model: Kuski,
        attributes: ['Kuski'],
        as: 'KuskiData',
      },
    ],
  });
  return data;
};

const addNews = async data => {
  const insert = await News.create(data);
  await createNewNewsNotification(insert);
  return insert;
};

const GetStatus = async () => {
  const status = await SiteSetting.findOne({
    where: {
      SettingName: 'Status',
    },
  });
  const ret = { show: 0, headline: '', text: '' };
  if (!status) {
    return ret;
  }
  if (status.Setting === 0) {
    return ret;
  }
  return {
    show: parseInt(status.Setting, 10),
    headline: status.Value1,
    text: status.Value2,
  };
};

router
  .get('/status', async (req, res) => {
    const data = await GetStatus();
    res.json(data);
  })
  .get('/:amount', async (req, res) => {
    const data = await getNews(JSON.parse(req.params.amount));
    res.json(data);
  })
  .post('/', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth && auth.mod) {
      const insert = await addNews({
        ...req.body,
        KuskiIndex: auth.userid,
        Written: fn('NOW'),
      });
      res.json(insert);
    } else {
      res.sendStatus(401);
    }
  });

export default router;
