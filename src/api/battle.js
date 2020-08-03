/* eslint-disable prettier/prettier */
import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from 'utils/database';
import { Battle, Level, Kuski } from '../data/models';

const router = express.Router();

const BattlesSearchByFilename = async (query, offset) => {
  const byFilename = await Battle.findAll({
    attributes: [
      'KuskiIndex',
      'BattleIndex',
      'LevelIndex',
      'BattleType',
      'Started',
    ],
    limit: searchLimit(offset),
    order: [
      ['BattleIndex', 'DESC'],
    ],
    offset: searchOffset(offset),
    include: [
      {
        model: Level,
        as: 'LevelData',
        attributes: ['LevelName', 'LongName'],
        where: { LevelName: { [Op.like]: `${like(query)}%` } },
      },
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski', 'Country'],
      },
    ],
  });
  return byFilename;
};

const BattlesSearchByDesigner = async (query, offset) => {
  const byDesigner = await Battle.findAll({
    attributes: [
      'KuskiIndex',
      'BattleIndex',
      'LevelIndex',
      'BattleType',
      'Started',
    ],
    limit: searchLimit(offset),
    order: [
      ['BattleIndex', 'DESC'],
    ],
    offset: searchOffset(offset),
    include: [
      {
        model: Level,
        as: 'LevelData',
        attributes: ['LevelName', 'LongName'],
      },
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski', 'Country'],
        where: { Kuski: { [Op.like]: `${like(query)}%` } },
      },
    ],
  });
  return byDesigner;
}

router
  .get('/', async (req, res) => {
    res.json({});
  })
  .get('/search/byFilename/:query/:offset/', async (req, res) => {
    const battles = await BattlesSearchByFilename(
      req.params.query,
      req.params.offset,
    );
    res.json(battles);
  })
  .get('/search/byDesigner/:query/:offset/', async (req, res) => {
    const battles = await BattlesSearchByDesigner(
      req.params.query,
      req.params.offset,
    );
    res.json(battles);
  });

export default router;
