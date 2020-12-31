/* eslint-disable prettier/prettier */
import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from 'utils/database';
import add from 'date-fns/add';
import parse from 'date-fns/parse';
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

const BattlesByDate = async date => {
  try {
    const start = parse(date, 'yyyy-M-d', new Date());
    const end = add(start, { days: 1 });

    const battles = await Battle.findAll({
      attributes: {
        exclude: ['RecData'],
      },
      order: [['BattleIndex', 'DESC']],
      where: {
        Started: {
          [Op.between]: [start, end],
        },
      },
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
          include: [
            {
              model: Team,
              as: 'TeamData',
            },
          ],
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
    });
    return battles;
  } catch (e) {
    return [];
  }
};

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
    order: [['BattleIndex', 'DESC']],
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
    order: [['BattleIndex', 'DESC']],
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
};

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

const BattlesForDesigner = async (KuskiIndex, page = 0, pageSize = 25) => {
  const byDesigner = await Battle.findAndCountAll({
    attributes: [
      'KuskiIndex',
      'BattleIndex',
      'LevelIndex',
      'BattleType',
      'Started',
      'Duration',
    ],
    where: { KuskiIndex },
    distinct: true,
    limit: parseInt(pageSize, 10),
    order: [['BattleIndex', 'DESC']],
    offset: parseInt(page * pageSize, 10),
    include: [
      {
        model: Level,
        as: 'LevelData',
        attributes: ['LevelName', 'LongName'],
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
  });
  return byDesigner;
};

const BattlesBetween = async (Start, End) => {
  const battles = await Battle.findAll({
    attributes: [
      'BattleIndex',
      'KuskiIndex',
      'LevelIndex',
      'Started',
      'Duration',
      'BattleType',
      'Aborted',
      'InQueue',
      'Finished',
    ],
    limit: 250,
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
    order: [['Started', 'DESC']],
    where: {
      Started: {
        [Op.between]: [Start, End],
      },
    },
  });
  return battles;
};

router
  .get('/', async (req, res) => {
    res.json({});
  })
  .get('/date/:date', async (req, res) => {
    const battles = await BattlesByDate(req.params.date);
    res.json(battles);
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
  })
  .get('/byDesigner/:KuskiIndex', async (req, res) => {
    const battles = await BattlesForDesigner(
      req.params.KuskiIndex,
      req.query.page,
      req.query.pageSize,
    );
    res.json(battles);
  })
  .get('/byPeriod/:Start/:End', async (req, res) => {
    const battles = await BattlesBetween(req.params.Start, req.params.End);
    res.json(battles);
  });

export default router;
