/* eslint-disable prettier/prettier */
import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from 'utils/database';
import { Battle, Level, Kuski, Team, Battletime } from '../data/models';

const router = express.Router();

const attributes = [
  'BattleIndex',
  'KuskiIndex',
  'LevelIndex',
  'BattleType',
  'SeeOthers',
  'SeeTimes',
  'AllowStarter',
  'AcceptBugs',
  'NoVolt',
  'NoTurn',
  'OneTurn',
  'NoBrake',
  'NoThrottle',
  'Drunk',
  'OneWheel',
  'Multi',
  'Started',
  'StartedUtc',
  'Duration',
  'Aborted',
  'Finished',
  'InQueue',
  'Countdown',
  'RecFileName',
];

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

const BattlesForLevel = async LevelIndex => {
  const battles = await Battle.findAll({
    attributes,
    where: { LevelIndex },
    limit: 100,
    include: [
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'KuskiData',
        include: [
          {
            model: Team,
            as: 'TeamData',
          },
        ],
      },
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
      },
      {
        model: Battletime,
        as: 'Results',
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'KuskiData',
            include: [
              {
                model: Team,
                as: 'TeamData',
              },
            ],
          },
        ],
      },
    ],
    order: [['BattleIndex', 'DESC']],
  });
  return battles;
};

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
  })
  .get('/byLevel/:LevelIndex', async (req, res) => {
    const battles = await BattlesForLevel(req.params.LevelIndex);
    res.json(battles);
  });

export default router;
