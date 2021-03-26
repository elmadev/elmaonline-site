import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from 'utils/database';
import { authContext } from 'utils/auth';
import { Replay, Level, Kuski, Tag } from '../data/models';

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

const getReplays = async (offset = 0, limit = 50) => {
  const data = await Replay.findAndCountAll({
    limit: searchLimit(limit),
    offset: searchOffset(offset),
    where: { Unlisted: 0 },
    order: [['Uploaded', 'DESC']],
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
  });
  return data;
};

const getReplayByReplayId = async ReplayIndex => {
  const data = await Replay.findAll({
    where: { ReplayIndex, Unlisted: 0 },
  });
  return data;
};

const getReplayByDrivenBy = async KuskiIndex => {
  const data = await Replay.findAll({
    where: { DrivenBy: KuskiIndex, Unlisted: 0 },
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
      },
    ],
  });
  return data;
};

const getReplayByUploadedBy = async KuskiIndex => {
  const data = await Replay.findAll({
    where: { UploadedBy: KuskiIndex, Unlisted: 0 },
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
      },
    ],
  });
  return data;
};

const getReplayByUUID = async replayUUID => {
  const data = await Replay.findOne({
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
  });
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
    ],
  });
  return replays;
};

router
  .get('/', async (req, res) => {
    const offset = req.query.pageSize * req.query.page;
    const limit = req.query.pageSize;
    const data = await getReplays(offset, limit);
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
  .get('/:ReplayIndex', async (req, res) => {
    const data = await getReplayByReplayId(req.params.ReplayIndex);
    res.json(data);
  })
  .get('/driven_by/:KuskiIndex', async (req, res) => {
    const data = await getReplayByDrivenBy(req.params.KuskiIndex);
    res.json(data);
  })
  .get('/uploaded_by/:KuskiIndex', async (req, res) => {
    const data = await getReplayByUploadedBy(req.params.KuskiIndex);
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
