import express from 'express';
import sequelize from 'sequelize';
import { authContext } from '#utils/auth';
import { has, intersection } from 'lodash-es';
import { getLevel as getLevelSecure } from '#utils/download';
import {
  Level,
  Time,
  LevelStats,
  Battle,
  Tag,
  LevelPackLevel,
  Kuski,
} from '../data/models';
import connection from '../data/sequelize';
import { fromToTime, searchLimit, searchOffset, like } from '#utils/database';

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
      WHERE level_tags.TagIndex IN (:tags)
	    AND level_tags.LevelIndex = level.LevelIndex
      GROUP BY level_tags.LevelIndex
      HAVING COUNT(level_tags.TagIndex) >= :compareCount;`;
  }

  if (query) {
    const [levelIndexes] = await connection.query(query, {
      replacements: { tags, compareCount },
    });
    return levelIndexes.map(l => l.LevelIndex);
  }
  return [];
};

const getLevelIndexesByFinishedBy = async finishedBy => {
  const query = `SELECT LevelIndex from besttime WHERE KuskiIndex = :finishedBy`;

  const [levelIndexes] = await connection.query(query, {
    replacements: { finishedBy },
  });
  return levelIndexes.map(l => l.LevelIndex);
};

const getLevels = async (
  offset = 0,
  limit = 50,
  tags = [],
  order = 'desc',
  AddedBy = 0,
  UserId = 0,
  LevelPackIndex = 0,
  excludedTags = [],
  finished = 'all',
  battled = 'all',
  finishedBy = 0,
  query = '',
) => {
  // Don't show hidden levels in search.
  // Showing them makes hiding finishedBy filtering slow.
  let where = { Locked: 0, Hidden: 0 };
  if (AddedBy) {
    if (UserId === AddedBy) {
      where = { AddedBy, Hidden: 0 };
    } else {
      where = { AddedBy, Locked: 0, Hidden: 0 };
    }
  }

  // Search term
  where = {
    ...where,
    LevelName: {
      [sequelize.Op.like]: `${like(query)}%`,
    },
  };

  // Filter by level pack
  let packLevels = [];

  if (LevelPackIndex) {
    const data = await LevelPackLevel.findAll({
      attributes: ['LevelIndex'],
      where: {
        LevelPackIndex,
      },
    });

    packLevels = data.map(r => r.LevelIndex);
  }

  // Compicated stuff. Review and recheck.
  const getFinishedByFinishedLevels = async finishedBy => {
    if (!finishedBy || finished == 'all') {
      return [];
    }

    const levelIndexesByFinishedBy = await getLevelIndexesByFinishedBy(
      finishedBy,
    );

    return levelIndexesByFinishedBy;
  };

  const levelIndexesByTags = await getLevelIndexesByTags(tags);
  const levelIndexesByExcludedTags = await getLevelIndexesByTags(
    excludedTags,
    true,
  );

  const levelIndexesByFinishedBy = await getFinishedByFinishedLevels(
    finishedBy,
  );

  const includeFinishedByLevelIndexes = finishedBy && finished === 'true';
  const excludeFinishedByLevelIndexes = finishedBy && finished === 'false';

  const getInIndexes = () => {
    // Arrays to be used in the intersection
    const arraysToUse = [
      LevelPackIndex ? packLevels : [],
      tags.length ? levelIndexesByTags : [],
      includeFinishedByLevelIndexes ? levelIndexesByFinishedBy : [],
    ];

    // Filter out arrays with false boolean values
    const arraysToIntersect = arraysToUse.filter(array => array.length > 0);

    // Find the intersection of arrays to use
    const intersectionResult =
      arraysToIntersect.length > 0 ? intersection(...arraysToIntersect) : [];

    return intersectionResult;
  };

  const getNotInIndexes = () => {
    const arraysToUse = [
      excludedTags.length ? levelIndexesByExcludedTags : [],
      excludeFinishedByLevelIndexes ? levelIndexesByFinishedBy : [],
    ];

    const arraysToConcat = arraysToUse.filter(array => array.length > 0);

    return arraysToConcat.length > 0 ? [].concat(...arraysToConcat) : [];
  };

  const shouldIncludeInIndexes =
    tags.length || includeFinishedByLevelIndexes || LevelPackIndex;
  const shouldExcludeFromIndexes =
    excludedTags.length || excludeFinishedByLevelIndexes;

  if (shouldIncludeInIndexes || shouldExcludeFromIndexes) {
    where = {
      ...where,
      LevelIndex: {
        ...(shouldIncludeInIndexes
          ? { [sequelize.Op.in]: getInIndexes() }
          : {}),
        ...(shouldExcludeFromIndexes
          ? { [sequelize.Op.notIn]: getNotInIndexes() }
          : {}),
      },
    };
  }

  const getIsBattledHavingCondition = () => {
    if (battled === 'all') {
      return {};
    }

    return {
      BattleCount: {
        [battled === 'true' ? sequelize.Op.gt : sequelize.Op.eq]: 0,
      },
    };
  };

  const getIsFinishedHavingCondition = () => {
    if (finished === 'all' || finishedBy) {
      return {};
    }

    return {
      Besttime: {
        [finished === 'true' ? sequelize.Op.not : sequelize.Op.eq]: null,
      },
    };
  };

  const having = {
    ...getIsBattledHavingCondition(),
    ...getIsFinishedHavingCondition(),
  };

  const data = await Level.findAll({
    limit: searchLimit(limit),
    offset: searchOffset(offset),
    where,
    having,
    order: [['LevelIndex', order]],
    attributes: [
      'LevelIndex',
      'LevelName',
      'LongName',
      'Apples',
      'Killers',
      'Added',
      [
        sequelize.literal(
          '(SELECT COUNT(*) FROM battle WHERE battle.LevelIndex = level.LevelIndex)',
        ),
        'BattleCount',
      ],
      [
        sequelize.literal(
          `(SELECT Time FROM besttime WHERE besttime.LevelIndex = level.LevelIndex AND level.Hidden != 1 LIMIT 1)`,
        ),
        'Besttime',
      ],
    ],
    include: [
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
    ],
  });
  return {
    rows: data,
    count: 300000,
  };
};

const getKuskisWhoAddedLevels = async () => {
  const query = `
    SELECT DISTINCT kuski.KuskiIndex, kuski.Kuski, kuski.Country
    FROM kuski
    JOIN level ON kuski.KuskiIndex = level.AddedBy`;

  const [kuskis] = await connection.query(query);
  return kuskis;
};

router.get('/kuskis', async (req, res) => {
  const data = await getKuskisWhoAddedLevels();
  res.json(data);
});

router.get('/', async (req, res) => {
  const offset = req.query.pageSize * req.query.page || 0;
  const limit = req.query.pageSize;

  const auth = authContext(req);
  let userId = 0;
  if (auth.auth) {
    userId = auth.userid;
  }

  const data = await getLevels(
    offset,
    limit,
    req.query.tags,
    req.query.order,
    req.query.addedBy,
    userId,
    req.query.levelPack,
    req.query.excludedTags,
    req.query.finished,
    req.query.battled,
    req.query.finishedBy,
    req.query.q,
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
