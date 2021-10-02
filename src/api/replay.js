import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from 'utils/database';
import { authContext } from 'utils/auth';
import { format } from 'date-fns';
import { shareTimeFile } from 'utils/upload';
import {
  Replay,
  Level,
  Kuski,
  Tag,
  ReplayRating,
  Time,
  TimeFile,
  LevelPackLevel,
} from '../data/models';
import sequelize from '../data/sequelize';

const router = express.Router();

const attributes = [
  'ReplayIndex',
  'DrivenBy',
  'DrivenByText',
  'UploadedBy',
  'LevelIndex',
  'TimeIndex',
  'ReplayTime',
  'Finished',
  'Uploaded',
  'Unlisted',
  'UUID',
  'RecFileName',
  'Comment',
  'TAS',
  'Bug',
  'Nitro',
];

const getReplays = async (
  offset = 0,
  limit = 50,
  tags = [],
  sortBy = 'uploaded',
  order = 'desc',
  UploadedBy = 0,
  DrivenBy = 0,
  UserId = 0,
  LevelPackIndex = 0,
) => {
  const getOrder = () => {
    if (sortBy === 'rating') {
      return [sequelize.literal(`ratingAvg ${order}`)];
    }
    return [['Uploaded', order]];
  };

  let where = { Unlisted: 0, Hide: 0 };
  if (UploadedBy) {
    if (UserId === UploadedBy) {
      where = { UploadedBy };
    } else {
      where = { UploadedBy, Unlisted: 0, Hide: 0 };
    }
  }
  if (DrivenBy) {
    if (UserId === DrivenBy) {
      where = { DrivenBy };
    } else {
      where = { DrivenBy, Unlisted: 0, Hide: 0 };
    }
  }

  // Filter by level pack
  let packLevels = [];
  if (LevelPackIndex) {
    packLevels = await LevelPackLevel.findAll({
      attributes: ['LevelIndex'],
      where: {
        LevelPackIndex,
      },
    }).then(data => data.map(r => r.LevelIndex));
  }
  const levelWhere = packLevels.length ? { LevelIndex: packLevels } : {};

  const data = await Replay.findAndCountAll({
    limit: searchLimit(limit),
    offset: searchOffset(offset),
    where,
    order: getOrder(),
    group: ['ReplayIndex'],
    ...(tags.length && {
      having: sequelize.literal(`(
        SELECT count('TagIndex')
        FROM replay_tags
        WHERE replay_tags.ReplayIndex = replay.ReplayIndex
        AND replay_tags.TagIndex IN (${tags.join()})) >= ${tags.length}`),
    }),
    attributes: {
      include: [
        [
          sequelize.literal(`(
                  SELECT round(avg(Vote), 1)
                  FROM replay_rating
                  WHERE
                  replay_rating.ReplayIndex = replay.ReplayIndex
              )`),
          'ratingAvg',
        ],
      ],
    },
    include: [
      {
        model: ReplayRating,
        as: 'Rating',
      },
      {
        model: Tag,
        as: 'Tags',
        through: {
          attributes: [],
        },
      },
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
        where: levelWhere,
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country', 'KuskiIndex', 'BmpCRC'],
        as: 'DrivenByData',
      },
    ],
  });
  return data;
};

const getReplayByReplayId = async ReplayIndex => {
  const data = await Replay.findAll({
    where: { ReplayIndex, Unlisted: 0 },
  });
  return data;
};

const getReplayByUUID = async replayUUID => {
  const query = {
    where: { UUID: replayUUID },
    include: [
      {
        model: Tag,
        as: 'Tags',
        through: {
          attributes: [],
        },
      },
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'DrivenByData',
      },
    ],
  };
  if (replayUUID.includes(';')) {
    query.where = {
      UUID: {
        [Op.in]: replayUUID.split(';'),
      },
    };
    const listData = await Replay.findAll(query);
    return listData;
  }
  const data = await Replay.findOne(query);
  return data;
};

const getReplaysSearchDriven = async (query, offset) => {
  const data = await Replay.findAll({
    limit: searchLimit(offset),
    offset: searchOffset(offset),
    where: { Unlisted: 0 },
    order: [['Uploaded', 'DESC']],
    include: [
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'DrivenByData',
        where: { Kuski: { [Op.like]: `${like(query)}%` } },
      },
    ],
  });
  return data;
};

const getReplaysSearchLevel = async (query, offset) => {
  const data = await Replay.findAll({
    limit: searchLimit(offset),
    offset: searchOffset(offset),
    order: [['ReplayTime', 'ASC']],
    where: { Unlisted: 0 },
    include: [
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
        where: { LevelName: { [Op.like]: `${like(query)}%` } },
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'DrivenByData',
      },
    ],
  });
  return data;
};

const getReplaysSearchFilename = async (query, offset) => {
  const replays = await Replay.findAll({
    offset: searchOffset(offset),
    where: {
      RecFileName: {
        [Op.like]: `${like(query)}%`,
      },
      Unlisted: 0,
    },
    limit: searchLimit(offset),
    order: [['RecFileName', 'ASC']],
    include: [
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
      },
      {
        model: Kuski,
        as: 'UploadedByData',
        attributes: ['KuskiIndex', 'Kuski', 'Country', 'TeamIndex'],
      },
      {
        model: Kuski,
        as: 'DrivenByData',
        attributes: ['KuskiIndex', 'Kuski', 'Country', 'TeamIndex'],
      },
    ],
  });
  return replays;
};

const InsertReplay = async (data, userid) => {
  const insertData = { ...data, UploadedBy: userid };
  if (insertData.DrivenBy !== 0) {
    insertData.DrivenByText = '';
  }
  const replay = await Replay.create(insertData);

  // Set tags
  const tags = insertData.Tags.filter(tag => !tag.Hidden).map(
    tag => tag.TagIndex,
  );
  // Add DNF tag when needed
  if (!replay.Finished) {
    const dnfTag = await Tag.findOne({ where: { Name: 'DNF' } });
    tags.push(dnfTag.TagIndex);
  }
  await replay.setTags(tags);

  return replay;
};

const UpdateReplay = async (ReplayIndex, userid) => {
  const replay = await Replay.findOne({
    where: { ReplayIndex },
  });
  if (replay) {
    if (replay.UploadedBy === userid) {
      await replay.update({ Unlisted: 0 });
    }
  }
  return replay;
};

const getReplaysByLevelIndex = async LevelIndex => {
  const replays = await Replay.findAll({
    attributes,
    where: { LevelIndex, Unlisted: 0 },
    limit: 100,
    order: [['ReplayIndex', 'DESC']],
    include: [
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'DrivenByData',
      },
      {
        model: Tag,
        as: 'Tags',
        through: {
          attributes: [],
        },
      },
    ],
  });
  return replays;
};

const shareReplay = async data => {
  const time = await Time.findOne({
    where: { TimeIndex: data.TimeIndex },
  });
  if (!time) {
    return false;
  }
  if (time.KuskiIndex === data.KuskiIndex) {
    const timeAsString = `${time.Time}`;
    const levName =
      data.LevelData.LevelName.substring(0, 6) === 'QWQUU0'
        ? data.LevelData.LevelName.substring(6, 8)
        : data.LevelData.LevelName;
    const RecFileName = `${levName}${data.Kuski.substring(
      0,
      Math.min(15 - (levName.length + timeAsString.length), 4),
    )}${timeAsString}.rec`;
    const isMoved = await shareTimeFile(data.TimeFileData, RecFileName);
    if (isMoved) {
      await InsertReplay(
        {
          DrivenBy: time.KuskiIndex,
          UploadedBy: time.KuskiIndex,
          LevelIndex: time.LevelIndex,
          TimeIndex: time.TimeIndex,
          ReplayTime: time.Time * 10,
          Finished: time.Finished === 'F' ? 1 : 0,
          Uploaded: format(new Date(), 't'),
          Unlisted: data.Unlisted,
          Hide: data.Hide,
          Bug: time.Finished === 'B' ? 1 : 0,
          Comment: data.Comment,
          UUID: data.TimeFileData.UUID,
          RecFileName,
          MD5: data.TimeFileData.MD5,
          Tags: data.Tags,
        },
        time.KuskiIndex,
      );
      await TimeFile.update(
        { Shared: 1 },
        { where: { TimeFileIndex: data.TimeFileData.TimeFileIndex } },
      );
      return true;
    }
  }
  return false;
};

const EditReplay = async data => {
  const rec = await Replay.findOne({
    where: { UUID: data.ReplayUuid, RecFileName: `${data.RecFileName}.rec` },
  });
  if (!rec) {
    return 404;
  }
  if (rec.dataValues.UploadedBy === data.KuskiIndex) {
    const update = { Comment: data.edit.Comment, Unlisted: data.edit.Unlisted };
    const k = await Kuski.findOne({ where: { Kuski: data.edit.DrivenBy } });
    if (k) {
      update.DrivenBy = k.KuskiIndex;
    } else {
      update.DrivenBy = 0;
      update.DrivenByText = data.edit.DrivenBy;
    }
    rec.update(update);
    return 200;
  }
  return 401;
};

router
  .get('/', async (req, res) => {
    const offset = req.query.pageSize * req.query.page || 0;
    const limit = req.query.pageSize;
    const uploadedBy = 0;
    const drivenBy = 0;
    const userId = 0;

    const data = await getReplays(
      offset,
      limit,
      req.query.tags,
      req.query.sortBy,
      req.query.order,
      uploadedBy,
      drivenBy,
      userId,
      req.query.levelPack,
    );
    res.json(data);
  })
  .post('/', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const insert = await InsertReplay(req.body, auth.userid);
      res.json(insert);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/update', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const update = await UpdateReplay(req.body.ReplayIndex, auth.userid);
      res.json(update);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/share', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const success = await shareReplay({
        ...req.body,
        KuskiIndex: auth.userid,
        Kuski: auth.user,
      });
      if (success) {
        res.json({ success: 1 });
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/edit', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const edit = await EditReplay({ ...req.body, KuskiIndex: auth.userid });
      res.sendStatus(edit);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/my', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const offset = req.query.pageSize * req.query.page || 0;
      const limit = req.query.pageSize;
      const data = await getReplays(
        offset,
        limit,
        req.query.tags,
        req.query.sortBy,
        req.query.order,
        auth.userid,
      );
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/:ReplayIndex', async (req, res) => {
    const data = await getReplayByReplayId(req.params.ReplayIndex);
    res.json(data);
  })
  .get('/driven_by/:KuskiIndex', async (req, res) => {
    const auth = authContext(req);
    const data = await getReplays(
      req.query.pageSize * req.query.page || 0,
      req.query.pageSize,
      req.query.tags,
      req.query.sortBy,
      req.query.order,
      0,
      parseInt(req.params.KuskiIndex, 10),
      auth.userid,
    );
    res.json(data);
  })
  .get('/uploaded_by/:KuskiIndex', async (req, res) => {
    const auth = authContext(req);
    const data = await getReplays(
      req.query.pageSize * req.query.page || 0,
      req.query.pageSize,
      req.query.tags,
      req.query.sortBy,
      req.query.order,
      parseInt(req.params.KuskiIndex, 10),
      0,
      auth.userid,
    );
    res.json(data);
  })

  .get('/byUUID/:UUID', async (req, res) => {
    const data = await getReplayByUUID(req.params.UUID);
    res.json(data);
  })

  .get('/byLevelIndex/:LevelIndex', async (req, res) => {
    const data = await getReplaysByLevelIndex(req.params.LevelIndex);
    res.json(data);
  })

  .get('/search/byDriven/:query/:offset', async (req, res) => {
    const data = await getReplaysSearchDriven(
      req.params.query,
      req.params.offset,
    );
    res.json(data);
  })
  .get('/search/byLevel/:query/:offset', async (req, res) => {
    const data = await getReplaysSearchLevel(
      req.params.query,
      req.params.offset,
    );
    res.json(data);
  })
  .get('/search/byFilename/:query/:offset', async (req, res) => {
    const data = await getReplaysSearchFilename(
      req.params.query,
      req.params.offset,
    );
    res.json(data);
  });

export default router;
