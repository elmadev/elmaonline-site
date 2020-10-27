import express from 'express';
import { Op } from 'sequelize';
import moment from 'moment';
import { Chat, Kuski } from 'data/models';

const router = express.Router();

const playerInfo = async KuskiIndex => {
  const player = await Kuski.findOne({
    where: { KuskiIndex },
    attributes: ['Confirmed'],
  });
  return player;
};

const getChatLines = async ({ KuskiIndex, start, end, offset }) => {
  const range = [
    moment(start, 'X')
      .utc()
      .format('YYYY-MM-DD HH:mm:ss'),
    moment(end, 'X')
      .utc()
      .format('YYYY-MM-DD HH:mm:ss'),
  ];

  const where = {
    Entered: {
      [Op.between]: range,
    },
  };

  if (KuskiIndex) {
    const kuski = await playerInfo(KuskiIndex);
    if (!kuski || !kuski.Confirmed) {
      return [];
    }
    where.KuskiIndex = KuskiIndex;
  }

  const opts = {
    limit: 2048,
    order: [['ChatIndex', 'ASC']],
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
    where,
    offset,
  };

  const lines = await Chat.findAll(opts);

  return lines;
};

router
  .get('/:start/:end/:offset', async (req, res) => {
    const data = await getChatLines({
      start: req.params.start,
      end: req.params.end,
    });
    res.json(data);
  })
  .get('/by/:KuskiIndex/:start/:end/:offset', async (req, res) => {
    const data = await getChatLines({
      KuskiIndex: req.params.KuskiIndex,
      start: req.params.start,
      end: req.params.end,
    });
    res.json(data);
  });

export default router;
