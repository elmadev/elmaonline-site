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
  KuskiIndex = 0,
  text = '',
  start = 0,
  end = Math.round(Date.now() / 1000),
  limit,
  offset = 0,
  order,
}) => {
  const where = {};

  if (KuskiIndex) {
    if (typeof KuskiIndex === 'object') {
      // Array of multiple kuskis
      where.KuskiIndex = { [Op.or]: KuskiIndex };
    } else {
      const kuski = await playerInfo(KuskiIndex);
      if (!kuski || !kuski.Confirmed) {
        return { count: 0, rows: [] };
      }
      where.KuskiIndex = KuskiIndex;
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
