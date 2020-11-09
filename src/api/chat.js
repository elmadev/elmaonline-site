import express from 'express';
import { Op } from 'sequelize';
import moment from 'moment';

import { Chat, Kuski } from 'data/models';
import { like, searchOffset } from 'utils/database';
import { CHAT_API_LIMIT } from 'constants/api';

const router = express.Router();

const playerInfo = async KuskiIndex => {
  const player = await Kuski.findOne({
    where: { KuskiIndex },
    attributes: ['Confirmed'],
  });
  return player;
};

const searchChat = async ({
  KuskiIds = [],
  text = '',
  start = 0,
  end = Math.round(Date.now() / 1000),
  limit,
  offset = 0,
  order,
}) => {
  const where = {};

  if (KuskiIds.length !== 0) {
    if (KuskiIds.length > 1) {
      where.KuskiIndex = { [Op.or]: KuskiIds };
    } else {
      const kuski = await playerInfo(KuskiIds[0]);
      if (!kuski || !kuski.Confirmed) {
        return { count: 0, rows: [] };
      }
      where.KuskiIndex = KuskiIds[0];
    }
  }

  if (text) where.Text = { [Op.like]: `${like(text)}` };

  const dateTimeRange = [
    moment(start, 'X')
      .utc()
      .format('YYYY-MM-DD HH:mm:ss'),
    moment(end, 'X')
      .utc()
      .format('YYYY-MM-DD HH:mm:ss'),
  ];

  where.Entered = { [Op.between]: dateTimeRange };

  const opts = {
    order: [['ChatIndex', 'ASC']],
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
    where,
    offset: offset ? searchOffset(offset) : 0,
    limit: CHAT_API_LIMIT,
  };

  if (limit < CHAT_API_LIMIT) opts.limit = limit;

  if (order === 'DESC') opts.order = [['ChatIndex', 'DESC']];

  const lines = await Chat.findAndCountAll(opts);

  return lines;
};

router.get('/', async (req, res) => {
  const data = await searchChat(JSON.parse(req.query.params));
  res.json(data);
});

export default router;
