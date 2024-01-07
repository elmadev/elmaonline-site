import express from 'express';
import sequelize from 'sequelize';
import { authContext } from '#utils/auth';
import { has } from 'lodash-es';
import { getLevel as getLevelSecure } from '#utils/download';
import {
  Level,
  Time,
  LevelStats,
  Battle,
  Tag,
  LevelPackLevel,
  Kuski,
  Besttime,
} from '../data/models';
import connection from '../data/sequelize';
import { fromToTime, searchLimit, searchOffset } from '#utils/database';

const router = express.Router();

const attributes = [
  'LevelIndex',
  'LevelName',
  'CRC',
  'LongName',
  'Apples',
  'Killers',
  'Flowers',
  'Locked',
  'HardLocked',
  'Hidden',
  'Legacy',
  'AcceptBugs',
];

const getLevel = async (LevelIndex, withStats = false) => {
  const include = [];

  const battles = await Battle.findAll({ where: { LevelIndex } });
  const ongoingBattles = battles.filter(
    b => b.Finished === 0 && b.Aborted === 0 && b.InQueue === 0,
  );

  if (withStats && ongoingBattles.length === 0) {
    include.push(
      {
        attributes: [
          'TimeF',
          'TimeE',
          'TimeD',
          'TimeAll',
          'AttemptsF',
          'AttemptsE',
          'AttemptsD',
          'AttemptsAll',
          'MaxSpeedF',
          'MaxSpeedE',
          'MaxSpeedD',
          'MaxSpeedAll',
          'LeaderCount',
          'UniqueLeaderCount',
          'KuskiCountF',
          'KuskiCountAll',
        ],
        model: LevelStats,
        as: 'LevelStatsData',
      },
      {
        model: Tag,
        as: 'Tags',
        through: {
          attributes: [],
        },
      },
    );
  }

  const level = await Level.findOne({
    attributes,
    where: { LevelIndex },
    include,
  });

  if (withStats && (level.Locked || level.Hidden)) {
    // level.LevelStatsData = null; is NOT the same.
    level.set('LevelStatsData', null);
  }

  return level;
};

const getLevelData = async LevelIndex => {
  try {
    const { file } = await getLevelSecure(LevelIndex);
    return { LevelIndex, LevelData: file };
  } catch (e) {
    return { LevelIndex, LevelData: null };
  }
};

const getLevelStatsForPlayer = async (LevelIndex, KuskiIndex, from, to) => {
  const stats = await Time.findAll({
    group: ['Finished'],
    attributes: [
      'Finished',
      [sequelize.fn('COUNT', 'Finished'), 'RunCount'],
      [sequelize.fn('SUM', sequelize.col('Time')), 'TimeSum'],
      [sequelize.fn('min', sequelize.col('Driven')), 'FirstPlayed'],
      [sequelize.fn('max', sequelize.col('Driven')), 'LastPlayed'],
    ],
    where: { LevelIndex, KuskiIndex, ...fromToTime(from, to, 'Driven') },
  });

  return stats;
};

export const getFavouritedBy = async LevelIndex => {
  const query = `
    SELECT
      fav.KuskiIndex,
      pack.LevelPackIndex,
      pack.LevelPackName
    FROM
      levelpack_favourite fav
      INNER JOIN levelpack pack ON pack.LevelPackIndex = fav.LevelPackIndex
    WHERE
      fav.LevelPackIndex IN(
        SELECT
          LevelPackIndex FROM levelpack_level
        WHERE
          LevelIndex = ${LevelIndex})
    `;

  const [favouritedBy] = await connection.query(query);

  return favouritedBy;
};

const UpdateLevel = async (LevelIndex, update) => {
  const updateLevel = await Level.update(update, { where: { LevelIndex } });
  return updateLevel;
};

const getLevelIndexesByTags = async (tags, onlyOneMatchIsEnough = false) => {
  const compareCount = onlyOneMatchIsEnough ? 1 : tags.length;

  let query = null;
  if (tags.length) {
    query = `
      SELECT DISTINCT level_tags.LevelIndex
      FROM level_tags, level
      WHERE level_tags.TagIndex IN (${tags.join()})
	    AND level_tags.LevelIndex = level.LevelIndex
      GROUP BY level_tags.LevelIndex
      HAVING COUNT(level_tags.TagIndex) >= ${compareCount};`;
  }

  if (query) {
    const [levelIndexes] = await connection.query(query);
    return levelIndexes.map(l => l.LevelIndex);
  }
  return [];
};

const getLevels = async (
  offset = 0,
  limit = 50,
  tags = [],
  sortBy = 'added',
  order = 'desc',
  AddedBy = 0,
  UserId = 0,
  LevelPackIndex = 0,
  excludedTags = [],
  finished = 'all',
) => {
  const getOrder = () => {
    if (sortBy === 'rating') {
      return [
        [sequelize.literal(`ratingAvg ${order}`)],
        [sequelize.literal(`ratingCnt ${order}`)],
      ];
    }

    if (sortBy === 'views') {
      return [[sequelize.literal(`Views ${order}`)]];
    }

    return [['LevelIndex', order]];
  };

  let where = { Locked: 0 };
  if (AddedBy) {
    if (UserId === AddedBy) {
      where = { AddedBy };
    } else {
      where = { AddedBy, Locked: 0 };
    }
  }

  // // Filter by level pack
  // let packLevels = [];
  // if (LevelPackIndex) {
  //   packLevels = await LevelPackLevel.findAll({
  //     attributes: ['LevelIndex'],
  //     where: {
  //       LevelPackIndex,
  //     },
  //   }).then(data => data.map(r => r.LevelIndex));
  // }
  // const levelWhere = packLevels.length ? { LevelIndex: packLevels } : {};

  const levelIndexesByTags = await getLevelIndexesByTags(tags);
  const levelIndexesByExcludedTags = await getLevelIndexesByTags(
    excludedTags,
    true,
  );
  if (tags.length || excludedTags.length) {
    where = {
      ...where,
      LevelIndex: {
        ...(tags.length && { [sequelize.Op.in]: levelIndexesByTags }),
        ...(excludedTags.length && {
          [sequelize.Op.notIn]: levelIndexesByExcludedTags,
        }),
      },
    };
  }

  const isFinishedCondition =
    finished !== 'all'
      ? finished === 'true'
        ? { '$Besttime.Time$': { [sequelize.Op.not]: null } } // true: levels where besttime.time exists
        : { '$Besttime.Time$': null } // false: levels where besttime is null
      : {}; // all: no condition

  where = {
    ...where,
    ...isFinishedCondition,
  };

  const data = await Level.findAll({
    limit: searchLimit(limit),
    offset: searchOffset(offset),
    where,
    order: getOrder(),
    attributes: [
      'LevelIndex',
      'LevelName',
      'LongName',
      'Apples',
      'Killers',
      'Flowers',
      'Added',
      //   include: [
      //     [
      //       sequelize.literal(`(
      //               SELECT round(avg(Vote), 1)
      //               FROM level_rating
      //               WHERE
      //               level_rating.LevelIndex = level.LevelIndex
      //           )`),
      //       'ratingAvg',
      //     ],
      //     [
      //       sequelize.literal(`(
      //               SELECT count(*)
      //               FROM level_rating
      //               WHERE
      //               level_rating.LevelIndex = level.LevelIndex
      //           )`),
      //       'ratingCnt',
      //     ],
      //   ],
    ],
    include: [
      // {
      //   model: LevelRating,
      //   as: 'Rating',
      // },
      {
        model: Tag,
        as: 'Tags',
        through: {
          attributes: [],
        },
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country', 'KuskiIndex'],
        as: 'KuskiData',
      },
      {
        model: Besttime,
        attributes: ['Time'],
        required: false,
        as: 'Besttime',
        where: {
          '$level.Hidden$': { [sequelize.Op.not]: 1 },
        },
      },
    ],
    subQuery: false,
  });
  return {
    rows: data,
    count: 300000,
  };
};

router.get('/', async (req, res) => {
  const offset = req.query.pageSize * req.query.page || 0;
  const limit = req.query.pageSize;
  // const addedBy = 0;
  const userId = 0;

  const data = await getLevels(
    offset,
    limit,
    req.query.tags,
    req.query.sortBy,
    req.query.order,
    req.query.addedBy,
    userId,
    req.query.levelPack,
    req.query.excludedTags,
    req.query.finished,
  );
  res.json(data);
});

router.get('/:LevelIndex', async (req, res) => {
  const data = await getLevel(req.params.LevelIndex, req.query.stats || false);
  res.json(data);
});

router.post('/:LevelIndex', async (req, res) => {
  const auth = authContext(req);
  if (auth.mod) {
    let update = { success: 0 };
    if (has(req.body, 'Locked')) {
      update = await UpdateLevel(req.params.LevelIndex, {
        Locked: parseInt(req.body.Locked, 10),
      });
    }
    if (has(req.body, 'HardLocked')) {
      update = await UpdateLevel(req.params.LevelIndex, {
        HardLocked: parseInt(req.body.HardLocked, 10),
      });
    }
    if (has(req.body, 'Hidden')) {
      update = await UpdateLevel(req.params.LevelIndex, {
        Hidden: parseInt(req.body.Hidden, 10),
      });
    }
    res.json(update);
  } else {
    res.sendStatus(401);
  }
});

router.post('/:LevelIndex/tags', async (req, res) => {
  const auth = authContext(req);

  const level = await Level.findByPk(req.params.LevelIndex);

  if (auth.mod || auth.userid === level.AddedBy) {
    await level.setTags(req.body.Tags);
    const response = await getLevel(req.params.LevelIndex, 1);
    res.json(response);
  } else {
    res.sendStatus(401);
  }
});

router.get('/leveldata/:LevelIndex', async (req, res) => {
  const data = await getLevelData(req.params.LevelIndex);
  res.json(data);
});

router.get('/timestats/:LevelIndex', async (req, res) => {
  const auth = authContext(req);
  let KuskiIndex = 0;
  if (auth.auth) {
    KuskiIndex = auth.userid;
  }

  const data = await getLevelStatsForPlayer(
    req.params.LevelIndex,
    KuskiIndex,
    req.query.from,
    req.query.to,
  );
  res.json(data);
});

export default router;
