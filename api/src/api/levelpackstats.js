import express from 'express';
import { Op } from 'sequelize';
import sequelize from '#data/sequelize';
import { LevelPackStats, Kuski, Team } from '#data/models';

const router = express.Router();

const attributes = [
  'LevelPackIndex',
  'TotalTime',
  'LevelsFinished',
  'Records',
  'Points',
  'LastUpdated',
];

const getStatsByLevelPackIndex = async LevelPackIndex => {
  const stats = await LevelPackStats.findAll({
    where: { LevelPackIndex },
    attributes,
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['KuskiIndex', 'Kuski', 'Country'],
        include: [
          {
            model: Team,
            as: 'TeamData',
            attributes: ['Team'],
          },
        ],
      },
    ],
  });

  return stats;
};

const getStatsByKuski = async KuskiIndex => {
  const stats = await LevelPackStats.findAll({
    where: { KuskiIndex },
    attributes,
  });

  return stats;
};

const getKuskiTotalTimeCounts = async () => {
  const stats = await LevelPackStats.findAll({
    where: {
      TotalTime: {
        [Op.ne]: 0,
      },
    },
    attributes: [
      [sequelize.col('levelpack_stats.KuskiIndex'), 'KuskiIndex'],
      [
        sequelize.fn('COUNT', sequelize.col('levelpack_stats.KuskiIndex')),
        'Count',
      ],
    ],
    group: [sequelize.col('levelpack_stats.KuskiIndex')],
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['KuskiIndex', 'Kuski', 'Country'],
        include: [
          {
            model: Team,
            as: 'TeamData',
            attributes: ['Team'],
          },
        ],
      },
    ],
    order: [[sequelize.literal('Count'), 'DESC']],
  });

  return stats;
};

const getKuskiPointsSum = async () => {
  const stats = await LevelPackStats.findAll({
    attributes: [
      [sequelize.col('levelpack_stats.KuskiIndex'), 'KuskiIndex'],
      [
        sequelize.fn('SUM', sequelize.col('levelpack_stats.Points')),
        'TotalPoints',
      ],
    ],
    group: [sequelize.col('levelpack_stats.KuskiIndex')],
    having: sequelize.literal('SUM(levelpack_stats.Points) > 0'),
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['KuskiIndex', 'Kuski', 'Country'],
        include: [
          {
            model: Team,
            as: 'TeamData',
            attributes: ['Team'],
          },
        ],
      },
    ],
    order: [[sequelize.literal('TotalPoints'), 'DESC']],
  });

  return stats;
};

const getKuskiRecordsSum = async () => {
  const stats = await LevelPackStats.findAll({
    attributes: [
      [sequelize.col('levelpack_stats.KuskiIndex'), 'KuskiIndex'],
      [
        sequelize.fn('SUM', sequelize.col('levelpack_stats.Records')),
        'TotalRecords',
      ],
    ],
    group: [sequelize.col('levelpack_stats.KuskiIndex')],
    having: sequelize.literal('SUM(levelpack_stats.Records) > 0'),
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['KuskiIndex', 'Kuski', 'Country'],
        include: [
          {
            model: Team,
            as: 'TeamData',
            attributes: ['Team'],
          },
        ],
      },
    ],
    order: [[sequelize.literal('TotalRecords'), 'DESC']],
  });

  return stats;
};

router.get('/levelpack/:LevelPackIndex', async (req, res) => {
  const LevelPackIndex = parseInt(req.params.LevelPackIndex);

  if (!LevelPackIndex || isNaN(LevelPackIndex)) {
    res.status(400).json({ error: 'Invalid LevelPackIndex' });
    return;
  }

  try {
    const stats = await getStatsByLevelPackIndex(LevelPackIndex);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/kuski/:KuskiIndex', async (req, res) => {
  const KuskiIndex = parseInt(req.params.KuskiIndex);

  if (!KuskiIndex || isNaN(KuskiIndex)) {
    res.status(400).json({ error: 'Invalid KuskiIndex' });
    return;
  }

  try {
    const stats = await getStatsByKuski(KuskiIndex);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/totaltime-counts', async (req, res) => {
  try {
    const stats = await getKuskiTotalTimeCounts();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/points-sum', async (req, res) => {
  try {
    const stats = await getKuskiPointsSum();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/records-sum', async (req, res) => {
  try {
    const stats = await getKuskiRecordsSum();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
