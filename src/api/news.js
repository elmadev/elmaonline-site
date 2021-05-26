import express from 'express';
import { authContext } from 'utils/auth';
import { createNewNewsNotification } from 'utils/notifications';
import { News, Kuski } from 'data/models';
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

router
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
