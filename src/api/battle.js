/* eslint-disable prettier/prettier */
import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from 'utils/database';
import { add, parse } from 'date-fns';
import { Battle, Level, Kuski, Team, Battletime, AllFinished, Time, Multitime } from '../data/models';

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

const AllBattleRuns = async BattleIndex => {
  const runs = await Time.findAndCountAll({
    order: [['TimeIndex', 'DESC']],
    attributes: [
      'Driven',
      'TimeIndex',
      'KuskiIndex',
      'LevelIndex',
      'Time',
      'Apples',
      'Finished',
      'BattleIndex',
      '24httIndex',
      'MaxSpeed',
      'ThrottleTime',
      'BrakeTime',
      'LeftVolt',
      'RightVolt',
      'SuperVolt',
      'Turn',
      'OneWheel',
    ],
    where: { BattleIndex },
  });
  if (runs.rows.length === 0) {
    const multiRuns = await Multitime.findAndCountAll({
      order: [['MultiTimeIndex', 'DESC']],
      attributes: [
        'Driven',
        'MultiTimeIndex',
        'KuskiIndex1',
        'KuskiIndex2',
        'LevelIndex',
        'Time',
        'Apples',
        'Apples1',
        'Apples2',
        'Finished',
        'BattleIndex',
        // 'Time1',
        // 'Time2',
        // 'Finished1',
        // 'Finished2',
        // 'MaxSpeed1',
        // 'MaxSpeed2',
        // 'ThrottleTime1',
        // 'ThrottleTime2',
        // 'BrakeTime1',
        // 'BrakeTime2',
        // 'LeftVolt1',
        // 'LeftVolt2',
        // 'RightVolt1',
        // 'RightVolt2',
        // 'SuperVolt1',
        // 'SuperVolt2',
        // 'Turn1',
        // 'Turn2',
        // 'OneWheel1',
        // 'OneWheel2',
      ],
      where: { BattleIndex },
    });
    return {...multiRuns, 'multi': 1};
  };
  return {...runs, 'multi': 0};
};

const BattleResults = async BattleIndex => {
  const battleResults = await Battle.findOne({
    attributes,
    where: { BattleIndex /* Finished: 1 */ },
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
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'KuskiData2',
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
  return battleResults;
}

const GetBattleData = async IndexList => {
  const battleData = await Battle.findAll({
    attributes: [
      'BattleIndex',
      'BattleType',
      'KuskiIndex',
      'LevelIndex',
      'Started',
      'Duration',
    ],
    where: {
      BattleIndex: {
        [Op.in]: IndexList.split(','),
      },
    },
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
    ],
    order: [['BattleIndex', 'DESC']],
  });
  return battleData;
}


const GetAllBattleTimes = async BattleIndex => {
  const battleStatus = await Battle.findAll({
    attributes: ['Finished'],
    where: { BattleIndex },
  });
  let times;
  if (battleStatus[0].dataValues.Finished === 1) {
    times = await AllFinished.findAll({
      where: { BattleIndex },
      order: [['TimeIndex', 'ASC']],
      include: [
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
      ],
    });
  } else {
    times = [];
  }
  return times;
}

const BattlesSearchByKuski = async (KuskiIndex, Page, PageSize) => {
  let battleData = {};
  const Results = [];
  const battles = await Battletime.findAndCountAll({
    attributes: ['BattleIndex'],
    limit: parseInt(PageSize, 10),
    offset: parseInt(Page * PageSize, 10),
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
    where: {
      KuskiIndex,
    },
    order: [['BattleIndex', 'DESC']],
  })
  .then(async data => {
      const results = await Battletime.findAll({
        where: {
          BattleIndex: {
            [Op.in]: data.rows.map(r => r.BattleIndex),
          },
        },
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
      });
      const indexList = []; 

      data.rows.map(r => {
        indexList.push(r.BattleIndex);
        return r;
      });
      
      battleData = await GetBattleData(indexList.join(','));
      battleData.map(b => {
        Results.push(results.filter(r => r.BattleIndex === b.BattleIndex));
        return b;
      });
      return {
        page: parseInt(Page, 10),
      };
  });
  return {...battles, rows: battleData, Results, PageSize};
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

const BattlesBetween = async (Start, End, Limit = 250) => {
  const from = await Battle.findAll({
    attributes: ['BattleIndex'],
    where: {
      Started: { [Op.gt]: Start },
    },
    limit: 1,
  });
  if (from.length === 0) return [];
  const to = await Battle.findAll({
    attributes: ['BattleIndex'],
    where: {
      Started: { [Op.and]: [{ [Op.gt]: Start }, { [Op.lt]: End }] },
    },
    order: [['BattleIndex', 'DESC']],
    limit: 1,
  });
  const query = {
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
      'RecFileName',
    ],
    limit: parseInt(Limit, 10),
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
    where: {
      BattleIndex: { [Op.between]: [from[0].dataValues.BattleIndex, to[0].dataValues.BattleIndex] },
    },
  };
  const battles = await Battle.findAll(query);
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
  .get('/byBattleIndex/:BattleIndex', async (req, res) => {
    const battle = await BattleResults(req.params.BattleIndex);
    res.json(battle);
  })
  .get('/byBattleIndexList/:query', async (req, res) => {
    const battle = await GetBattleData(req.params.query);
    res.json(battle);
  })
  .get('/byPlayer/:KuskiIndex', async (req, res) => {
    const battles = await BattlesSearchByKuski(
      req.params.KuskiIndex,
      req.query.page,
      req.query.pageSize,
    );
    res.json(battles);
  })
  .get('/allRuns/:BattleIndex', async (req, res) => {
    const runs = await AllBattleRuns(req.params.BattleIndex);
    res.json(runs);
  })
  .get('/byLevel/:LevelIndex', async (req, res) => {
    const battles = await BattlesForLevel(req.params.LevelIndex);
    res.json(battles);
  })
  .get('/allBattleTimes/:q', async (req, res) => {
    const times = await GetAllBattleTimes(req.params.q);
    res.json(times);
  })
  .get('/byDesigner/:KuskiIndex', async (req, res) => {
    const battles = await BattlesForDesigner(
      req.params.KuskiIndex,
      req.query.page,
      req.query.pageSize,
    );
    res.json(battles);
  })
  .get('/byPeriod/:Start/:End/:Limit', async (req, res) => {
    const battles = await BattlesBetween(
      req.params.Start,
      req.params.End,
      req.params.Limit,
    );
    res.json(battles);
  });

export default router;
