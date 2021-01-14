import express from 'express';

import { News, Kuski } from 'data/models';

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

router.get('/:amount', async (req, res) => {
  const data = await getNews(JSON.parse(req.params.amount));
  res.json(data);
});

export default router;
