import express from 'express';
import { Op } from 'sequelize';
import moment from 'moment';
import { Chat, Kuski } from '../data/models';

const router = express.Router();

const playerInfo = async KuskiIndex => {
  const player = await Kuski.findOne({
    where: { KuskiIndex },
    attributes: ['Confirmed'],
  });
  return player;
};

const getChatLinesInRange = async (KuskiIndex, from, to) => {
  const where = {
    Entered: {
      [Op.lt]: moment(to, 'X')
        .utc()
        .format(),
      [Op.gt]: moment(from, 'X')
        .utc()
        .format(),
    },
  };

  if (KuskiIndex !== 'all') {
    const kuski = await playerInfo(KuskiIndex);
    if (!kuski || !kuski.Confirmed) {
      return [];
    }
    where.KuskiIndex = KuskiIndex;
  }

  const lines = await Chat.findAll({
    where,
    attributes: ['ChatIndex', 'Text', 'Entered', 'KuskiIndex', 'KuskiData'],
    order: [['Entered', 'ASC']],
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
  });

  return lines;
};

router.get('/:player/:from/:to', async (req, res) => {
  const data = await getChatLinesInRange(
    req.params.player,
    req.params.from,
    req.params.to,
  );
  res.json(data);
});
