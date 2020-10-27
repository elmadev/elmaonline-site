import express from 'express';
import { forEach } from 'lodash';
import { authContext } from 'utils/auth';
import { eachSeries } from 'neo-async';
import { like, searchLimit, searchOffset } from 'utils/database';
import { Op } from 'sequelize';
import { firstEntry, lastEntry, inBetween } from 'utils/sort';
import {
  Besttime,
  LevelPackLevel,
  Kuski,
  LevelPack,
  Level,
  Team,
  BestMultitime,
} from '../data/models';

const router = express.Router();

const getKuski = async k => {
  const findKuski = await Kuski.findOne({
    where: { Kuski: k },
  });
  return findKuski;
};

const getRecords = async LevelPackName => {
  const packInfo = await LevelPack.findOne({
    where: { LevelPackName },
  });
  const times = await LevelPackLevel.findAll({
    where: { LevelPackIndex: packInfo.LevelPackIndex },
    order: [['Sort', 'ASC'], ['LevelPackLevelIndex', 'ASC']],
    include: [
      {
        model: Besttime,
        as: 'LevelBesttime',
        attributes: ['TimeIndex', 'Time', 'KuskiIndex'],
        order: [['Time', 'ASC'], ['TimeIndex', 'ASC']],
        limit: 1,
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'KuskiData',
            include: [
              {
                model: Team,
                as: 'TeamData',
                attributes: ['Team'],
              },
            ],
          },
        ],
      },
      {
        model: Level,
        as: 'Level',
        attributes: ['LevelName', 'LongName', 'Hidden'],
      },
    ],
  });
  return times.filter(t => !t.Level.Hidden);
};

const getMultiRecords = async LevelPackName => {
  const packInfo = await LevelPack.findOne({
    where: { LevelPackName },
  });
  const times = await LevelPackLevel.findAll({
    where: { LevelPackIndex: packInfo.LevelPackIndex },
    order: [['LevelPackLevelIndex', 'ASC']],
    include: [
      {
        model: BestMultitime,
        as: 'LevelMultiBesttime',
        attributes: ['MultiTimeIndex', 'Time', 'KuskiIndex1', 'KuskiIndex2'],
        order: [['Time', 'ASC'], ['MultiTimeIndex', 'ASC']],
        limit: 1,
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'Kuski1Data',
            include: [
              {
                model: Team,
                as: 'TeamData',
                attributes: ['Team'],
              },
            ],
          },
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'Kuski2Data',
            include: [
              {
                model: Team,
                as: 'TeamData',
                attributes: ['Team'],
              },
            ],
          },
        ],
      },
      {
        model: Level,
        as: 'Level',
        attributes: ['LevelName', 'LongName', 'Hidden'],
      },
    ],
  });
  return times.filter(t => !t.Level.Hidden);
};

const getPersonalTimes = async (LevelPackName, KuskiIndex) => {
  const packInfo = await LevelPack.findOne({
    where: { LevelPackName },
  });
  const times = await LevelPackLevel.findAll({
    where: { LevelPackIndex: packInfo.LevelPackIndex },
    order: [['LevelPackLevelIndex', 'ASC']],
    include: [
      {
        model: Besttime,
        as: 'LevelBesttime',
        attributes: ['TimeIndex', 'Time', 'KuskiIndex'],
        where: { KuskiIndex },
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'KuskiData',
          },
        ],
      },
      {
        model: Level,
        as: 'Level',
        attributes: ['LevelName', 'LongName', 'Hidden'],
      },
    ],
  });
  return times.filter(t => !t.Level.Hidden);
};

const getTimes = async LevelPackIndex => {
  const times = await LevelPackLevel.findAll({
    where: { LevelPackIndex },
    attributes: ['LevelIndex'],
    include: [
      {
        model: Besttime,
        as: 'LevelBesttime',
        attributes: ['TimeIndex', 'Time', 'KuskiIndex'],
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'KuskiData',
          },
        ],
      },
      {
        model: Level,
        as: 'Level',
        attributes: ['Hidden'],
      },
    ],
  });
  return times;
};

const getPacksByQuery = async query => {
  const packs = await LevelPack.findAll({
    where: {
      [Op.or]: [
        { LevelPackName: { [Op.like]: `${like(query)}%` } },
        { LevelPackLongName: { [Op.like]: `${like(query)}%` } },
      ],
    },
    include: [
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'KuskiData',
      },
    ],
  });

  const matchingLevels = await Level.findAll({
    attributes: ['LevelName', 'LevelIndex'],
    where: { LevelName: { [Op.like]: `${like(query)}%` } },
  });

  const levels = await LevelPackLevel.findAll({
    attributes: ['LevelPackIndex', 'LevelIndex'],
    where: {
      LevelIndex: { [Op.in]: matchingLevels.map(lev => lev.LevelIndex) },
    },
    include: [
      {
        model: LevelPack,
        as: 'LevelPack',
        attributes: ['LevelPackName', 'LevelPackLongName'],
        include: [
          {
            model: Kuski,
            as: 'KuskiData',
            attributes: ['Kuski', 'Country'],
          },
        ],
      },
    ],
  });

  return [...packs, ...levels].filter(
    (v, i, a) => a.findIndex(x => x.LevelPackIndex === v.LevelPackIndex) === i,
  );
};

const getLevelsByQuery = async (query, offset) => {
  const levels = await Level.findAll({
    attributes: [
      'LevelIndex',
      'LevelName',
      'CRC',
      'LongName',
      'Apples',
      'Killers',
      'Flowers',
      'Locked',
      'SiteLock',
      'Hidden',
    ],
    offset: searchOffset(offset),
    where: {
      LevelName: {
        [Op.like]: `${like(query)}%`,
      },
      Locked: 0,
    },
    limit: searchLimit(offset),
    order: [['LevelName', 'ASC']],
  });
  return levels;
};

const getLevelsByQueryAll = async query => {
  const levels = await Level.findAll({
    attributes: [
      'LevelIndex',
      'LevelName',
      'CRC',
      'LongName',
      'Apples',
      'Killers',
      'Flowers',
      'Locked',
      'SiteLock',
      'Hidden',
    ],
    where: {
      LevelName: {
        [Op.like]: `${like(query)}%`,
      },
      Locked: 0,
    },
    limit: 100,
    order: [['LevelName', 'ASC']],
  });
  return levels;
};

const totalTimes = times => {
  const tts = [];
  forEach(times, level => {
    if (!level.Level.Hidden) {
      forEach(level.LevelBesttime, time => {
        const findKuski = tts.findIndex(x => x.KuskiIndex === time.KuskiIndex);
        if (findKuski > -1) {
          tts[findKuski] = {
            ...tts[findKuski],
            tt: tts[findKuski].tt + time.Time,
            count: tts[findKuski].count + 1,
            TimeIndex:
              time.TimeIndex > tts[findKuski].TimeIndex
                ? time.TimeIndex
                : tts[findKuski].TimeIndex,
          };
        } else {
          tts.push({
            KuskiData: time.KuskiData,
            tt: time.Time,
            KuskiIndex: time.KuskiIndex,
            count: 1,
            TimeIndex: time.TimeIndex,
          });
        }
      });
    }
  });
  return tts.filter(x => x.count === times.length);
};

const pointList = [
  40,
  30,
  25,
  22,
  20,
  18,
  16,
  14,
  12,
  11,
  10,
  9,
  8,
  7,
  6,
  5,
  4,
  3,
  2,
  1,
];

const kinglist = times => {
  const points = [];
  forEach(times, level => {
    if (!level.Level.Hidden) {
      const sortedTimes = level.LevelBesttime.sort((a, b) => a.Time - b.Time);
      let no = 0;
      forEach(sortedTimes, data => {
        const time = data.dataValues;
        const findKuski = points.findIndex(
          x => x.KuskiIndex === time.KuskiIndex,
        );
        if (findKuski > -1) {
          points[findKuski] = {
            ...points[findKuski],
            points: points[findKuski].points + pointList[no],
            TimeIndex:
              time.TimeIndex > points[findKuski].TimeIndex
                ? time.TimeIndex
                : points[findKuski].TimeIndex,
          };
        } else {
          points.push({
            KuskiData: time.KuskiData,
            points: pointList[no],
            KuskiIndex: time.KuskiIndex,
            TimeIndex: time.TimeIndex,
          });
        }
        no += 1;
        if (no >= pointList.length) {
          return false;
        }
        return true;
      });
    }
  });
  return points;
};

const AddLevelPack = async data => {
  const NewPack = await LevelPack.create(data);
  return NewPack;
};

const DeleteLevel = async data => {
  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
  });
  if (pack.KuskiIndex === data.KuskiIndex) {
    await LevelPackLevel.destroy({
      where: {
        LevelIndex: data.LevelIndex,
        LevelPackIndex: data.LevelPackIndex,
      },
    });
    return true;
  }
  return false;
};

const AddLevel = async data => {
  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
  });
  const level = await Level.findOne({
    where: { LevelIndex: data.LevelIndex },
  });
  if (level.Locked) {
    return 'Level is locked.';
  }
  if (pack.KuskiIndex === data.KuskiIndex) {
    let Sort = '';
    if (data.levels > 0) {
      Sort = lastEntry(data.last.Sort);
    } else {
      Sort = firstEntry();
    }
    await LevelPackLevel.create({
      LevelPackIndex: data.LevelPackIndex,
      LevelIndex: data.LevelIndex,
      Sort,
    });
    return '';
  }
  return 'This is not your level pack';
};

const SortLevel = async data => {
  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
  });
  if (pack.KuskiIndex === data.KuskiIndex) {
    const { LevelIndex } = data.levels[data.source.index];
    const beforeIndex =
      data.destination.index === 0
        ? data.destination.index
        : data.destination.index - 1;
    const midIndex = data.destination.index;
    const afterIndex =
      data.destination.index === data.levels.length - 1
        ? data.destination.index
        : data.destination.index + 1;
    let Sort = '';
    if (data.source.index > data.destination.index) {
      Sort = inBetween(
        data.levels[beforeIndex].Sort,
        data.levels[midIndex].Sort,
        -1,
      );
    } else {
      Sort = inBetween(
        data.levels[midIndex].Sort,
        data.levels[afterIndex].Sort,
        1,
      );
    }
    await LevelPackLevel.update(
      { Sort },
      {
        where: { LevelPackIndex: data.LevelPackIndex, LevelIndex },
      },
    );
    return true;
  }
  return false;
};

const SortPackUpdate = async (data, done) => {
  await LevelPackLevel.update(
    { Sort: data.Sort },
    { where: { LevelPackLevelIndex: data.LevelPackLevelIndex } },
  );
  done();
};

const SortPack = async data => {
  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
  });
  if (pack.KuskiIndex === data.KuskiIndex) {
    const updateBulk = [];
    let Sort = '';
    forEach(data.levels, l => {
      if (!Sort) {
        Sort = firstEntry();
      } else {
        Sort = lastEntry(Sort);
      }
      updateBulk.push({ LevelPackLevelIndex: l.LevelPackLevelIndex, Sort });
    });
    await eachSeries(updateBulk, SortPackUpdate);
    return true;
  }
  return false;
};

router
  .get('/:LevelPackIndex/totaltimes', async (req, res) => {
    const data = await getTimes(req.params.LevelPackIndex);
    const tts = totalTimes(data);
    const points = kinglist(data);
    res.json({ tts, points });
  })
  .get('/:LevelPackName/personal/:KuskiIndex', async (req, res) => {
    const getKuskiIndex = await getKuski(req.params.KuskiIndex);
    if (getKuskiIndex) {
      const data = await getPersonalTimes(
        req.params.LevelPackName,
        getKuskiIndex.dataValues.KuskiIndex,
      );
      res.json(data);
    } else {
      res.json({ error: 'Kuski does not exist' });
    }
  })
  .get('/:LevelPackName/records', async (req, res) => {
    const records = await getRecords(req.params.LevelPackName);
    res.json(records);
  })
  .get('/:LevelPackName/multirecords', async (req, res) => {
    const records = await getMultiRecords(req.params.LevelPackName);
    res.json(records);
  })
  .get('/search/:query', async (req, res) => {
    const packs = await getPacksByQuery(req.params.query);
    res.json(packs);
  })
  .get('/searchLevel/:query', async (req, res) => {
    const levs = await getLevelsByQueryAll(req.params.query);
    res.json(levs);
  })
  .get('/searchLevel/:query/:offset', async (req, res) => {
    const levs = await getLevelsByQuery(req.params.query, req.params.offset);
    res.json(levs);
  })
  .post('/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const add = await AddLevelPack({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      res.json(add);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/admin/deleteLevel', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const del = await DeleteLevel({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      if (del) {
        res.json({ success: 1 });
      } else {
        res.json({ success: 0, error: 'This is not your level pack' });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/admin/addLevel', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const add = await AddLevel({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      if (add) {
        res.json({ success: 0, error: add });
      } else {
        res.json({ success: 1 });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/admin/sortLevel', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const sort = await SortLevel({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      if (sort) {
        res.json({ success: 1 });
      } else {
        res.json({ success: 0, error: 'This is not your level pack' });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/admin/sort', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const sort = await SortPack({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      if (sort) {
        res.json({ success: 1 });
      } else {
        res.json({ success: 0, error: 'This is not your level pack' });
      }
    } else {
      res.sendStatus(401);
    }
  });

export default router;
