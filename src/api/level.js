import express from 'express';
import sequelize from 'sequelize';
import { authContext } from '#utils/auth';
import { has } from 'lodash-es';
import { getLevel as getLevelSecure } from '#utils/download';
import { Level, Time, LevelStats, Battle } from '../data/models';
import connection from '../data/sequelize';

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
    include.push({
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
    });
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

const getLevelStatsForPlayer = async (LevelIndex, KuskiIndex) => {
  const stats = await Time.findAll({
    group: ['Finished'],
    attributes: [
      'Finished',
      [sequelize.fn('COUNT', 'Finished'), 'RunCount'],
      [sequelize.fn('SUM', sequelize.col('Time')), 'TimeSum'],
      [sequelize.fn('min', sequelize.col('Driven')), 'FirstPlayed'],
      [sequelize.fn('max', sequelize.col('Driven')), 'LastPlayed'],
    ],
    where: { LevelIndex, KuskiIndex },
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

  const data = await getLevelStatsForPlayer(req.params.LevelIndex, KuskiIndex);
  res.json(data);
});

export default router;
