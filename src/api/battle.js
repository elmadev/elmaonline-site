import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from '#utils/database';
import { add, parse } from 'date-fns';
import { forEach, omit } from 'lodash-es';
import {
  AllFinished,
  Battle,
  Battletime,
  Kuski,
  Level,
  Multitime,
  Time,
  TimeFile,
} from '#data/models';
import { battle2Rec } from './replay.js';

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
  'AlwaysThrottle',
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

const kuskiIdsfromNames = async namesArr => {
  const results = await Kuski.findAll({
    attributes: ['KuskiIndex', 'Kuski'],
    where: {
      Kuski: namesArr.filter(Boolean),
    },
  });

  return results.map(k => k.KuskiIndex);
};

const filterBattles = (battles, amount) => {
  const filtered = [];
  forEach(battles, battle => {
    if (!battle.Aborted) {
      filtered.push(battle);
    } else if (battle.Started) {
      filtered.push(battle);
    }
  });
  return filtered.slice(0, amount);
};

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
        },
        {
          model: Battletime,
          as: 'Results',
          include: [
            {
              model: Kuski,
              as: 'KuskiData',
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
  if (Number.isNaN(parseInt(BattleIndex, 10))) {
    return null;
  }
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
    return { ...multiRuns, multi: 1 };
  }
  return { ...runs, multi: 0 };
};

const BattleResults = async BattleIndex => {
  if (Number.isNaN(parseInt(BattleIndex, 10))) {
    return null;
  }
  const battleResults = await Battle.findOne({
    attributes,
    where: { BattleIndex },
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
      },
      {
        model: Level,
        attributes: ['LevelName', 'Apples', 'Killers', 'Flowers'],
        as: 'LevelData',
      },
      {
        model: Battletime,
        as: 'Results',
        include: [
          {
            model: Kuski,
            as: 'KuskiData',
          },
          {
            model: Kuski,
            as: 'KuskiData2',
          },
        ],
      },
    ],
  });
  if (!battleResults) {
    return null;
  }
  if (battleResults.dataValues.Aborted && !battleResults.dataValues.Started) {
    return omit(battleResults.dataValues, ['LevelIndex', 'LevelData']);
  }
  return battleResults;
};

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
        as: 'KuskiData',
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
};

const GetAllBattleTimes = async BattleIndex => {
  if (Number.isNaN(parseInt(BattleIndex, 10))) {
    return null;
  }
  const battleStatus = await Battle.findAll({
    attributes: ['Finished'],
    where: { BattleIndex },
  });
  let times;
  if (battleStatus.length === 0) {
    return [];
  }
  if (battleStatus[0].dataValues.Finished === 1) {
    times = await AllFinished.findAll({
      where: { BattleIndex },
      order: [['TimeIndex', 'ASC']],
      include: [
        {
          model: Kuski,
          as: 'KuskiData',
        },
      ],
    });
  } else {
    times = [];
  }
  return times;
};

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
        as: 'KuskiData',
      },
    ],
    where: {
      KuskiIndex,
    },
    order: [['BattleIndex', 'DESC']],
  }).then(async data => {
    const results = await Battletime.findAll({
      where: {
        BattleIndex: {
          [Op.in]: data.rows.map(r => r.BattleIndex),
        },
      },
      include: [
        {
          model: Kuski,
          as: 'KuskiData',
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
  return { ...battles, rows: battleData, Results, PageSize };
};

const BattlesForLevel = async LevelIndex => {
  const battles = await Battle.findAll({
    attributes,
    where: { LevelIndex },
    limit: 100,
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
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
            as: 'KuskiData',
          },
        ],
      },
    ],
    order: [['BattleIndex', 'DESC']],
  });
  return battles;
};

const BattleQueryDefaultArgs = () => {
  return {
    attributes: [
      'KuskiIndex',
      'BattleIndex',
      'LevelIndex',
      'BattleType',
      'Started',
      'Duration',
      'Finished',
      'Aborted',
    ],
    order: [['BattleIndex', 'DESC']],
    limit: 100,
    offset: 0,
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
      },
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
            as: 'KuskiData',
          },
        ],
      },
    ],
  };
};

// todo: implement cripples (if performance for these is reasonable)
// todo: allow in queue battles to show maybe
const BattleQuery = async opts => {
  const KuskiIndexes = Array.isArray(opts.KuskiIndexes)
    ? opts.KuskiIndexes
    : [];

  // const Cripples = Array.isArray(opts.Cripples) ? opts.Cripples : [];

  const durationCond =
    opts.DurationMin || opts.DurationMax
      ? {
          Duration: {
            [Op.and]: [
              ...(opts.DurationMin
                ? [{ [Op.gte]: parseInt(opts.DurationMin, 10) }]
                : []),
              ...(opts.DurationMax
                ? [{ [Op.lte]: parseInt(opts.DurationMax, 10) }]
                : []),
            ],
          },
        }
      : {};

  // might just rely on the client to provide database formatted date
  // strings for this.
  const startedCond =
    opts.StartedMin || opts.StartedMax
      ? {
          Started: {
            [Op.and]: [
              ...(opts.StartedMin ? [{ [Op.gte]: opts.StartedMin }] : []),
              ...(opts.StartedMax ? [{ [Op.lte]: opts.StartedMax }] : []),
            ],
          },
        }
      : {};

  const args = {
    ...BattleQueryDefaultArgs(),
    ...{
      where: {
        ...(KuskiIndexes.length > 0 ? { KuskiIndex: KuskiIndexes } : {}),
        ...(opts.BattleType ? { BattleType: opts.BattleType } : {}),
        ...startedCond,
        ...durationCond,
        Finished: 1,
      },
      limit: opts.pageSize,
      offset: opts.page * opts.pageSize,
      order: [['BattleIndex', opts.sortAsc ? 'ASC' : 'DESC']],
      distinct: true,
    },
  };

  if (opts.countAll) {
    const results = await Battle.findAndCountAll(args);
    return results;
  }

  const results = await Battle.findAll(args);
  return {
    count: null,
    rows: results,
  };
};

const BattlesForDesigner = async (KuskiIndex, page = 0, pageSize = 25) => {
  const byDesigner = await Battle.findAll({
    attributes: [
      'KuskiIndex',
      'BattleIndex',
      'LevelIndex',
      'BattleType',
      'Started',
      'Duration',
    ],
    where: { KuskiIndex },
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
            as: 'KuskiData',
          },
        ],
      },
    ],
  });
  return byDesigner;
};

const BattlesBetween = async (Start, End, Limit = 250) => {
  let fromIndex = 0;
  let toIndex = 9999999999999;
  const from = await Battle.findAll({
    attributes: ['BattleIndex'],
    where: {
      Started: { [Op.lt]: Start },
    },
    order: [['BattleIndex', 'DESC']],
    limit: 1,
  });
  if (from.length === 0) return [];
  fromIndex = from[0].dataValues.BattleIndex + 1;
  const to = await Battle.findAll({
    attributes: ['BattleIndex'],
    where: {
      Started: { [Op.gt]: End },
    },
    order: [['BattleIndex', 'ASC']],
    limit: 1,
  });
  if (to.length > 0) {
    toIndex = to[0].dataValues.BattleIndex - 1;
  }
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
      'Countdown',
    ],
    limit: parseInt(Limit, 10) + 10,
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
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
            as: 'KuskiData',
          },
        ],
      },
    ],
    order: [['BattleIndex', 'DESC']],
    where: {
      BattleIndex: { [Op.between]: [fromIndex, toIndex] },
    },
  };
  const battles = await Battle.findAll(query);
  return filterBattles(battles, parseInt(Limit, 10));
};

const BattleReplays = async BattleIndex => {
  if (Number.isNaN(parseInt(BattleIndex, 10))) {
    return null;
  }
  const battle = await Battle.findOne({ where: { BattleIndex } });
  if (!battle) {
    return [];
  }
  if (!battle.Finished) {
    return [];
  }
  const replays = await TimeFile.findAll({ where: { BattleIndex } });
  return replays;
};

const GetLatest = async limit => {
  const get = await Battle.findAll({
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
      'Countdown',
    ],
    order: [['BattleIndex', 'DESC']],
    limit,
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
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
            as: 'KuskiData',
          },
        ],
      },
    ],
  });
  return get;
};

const GetLatestAsReplays = async limit => {
  const latestBattles = await GetLatest(limit);
  return latestBattles.map(battle => battle2Rec(battle)).filter(Boolean);
};

router
  .get('/replays', async (req, res) => {
    const limit = req.query.limit ?? 100;
    const battles = await GetLatestAsReplays(
      Math.min(parseInt(limit, 10), 100),
    );
    res.json(battles);
  })
  .get('/:limit', async (req, res) => {
    const battles = await GetLatest(
      Math.min(parseInt(req.params.limit, 10), 100),
    );
    res.json(battles);
  })
  .get('/replays/:BattleIndex', async (req, res) => {
    const replays = await BattleReplays(parseInt(req.params.BattleIndex, 10));
    res.json(replays);
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
  .get('/search/generic', async (req, res) => {
    const split = str => {
      return (str || '')
        .trim()
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    };

    const kuskiArr = split(req.query.Kuski);
    const KuskiIndexes = await kuskiIdsfromNames(kuskiArr);

    if (kuskiArr.length > 0 && KuskiIndexes.length === 0) {
      res.json({
        count: 0,
        rows: [],
        error: "No Kuski's found.",
      });
      return;
    }

    const page = parseInt(req.query.page || 0, 10);
    const pageSize = parseInt(req.query.pageSize || 25, 10);
    const sortAsc = req.query.sort === 'ASC';

    const countAndRows = await BattleQuery({
      KuskiIndexes,
      BattleType: req.query.BattleType,
      Cripples: split(req.query.Cripple),
      DurationMin: req.query.DurationMin,
      DurationMax: req.query.DurationMax,
      StartedMin: req.query.StartedMin,
      StartedMax: req.query.StartedMax,
      page,
      pageSize,
      sortAsc,
      // doing countAll on large result sets can get very slow, so do it conditionally
      countAll: KuskiIndexes.length > 0 && KuskiIndexes.length < 3,
    });

    res.json(countAndRows);
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
