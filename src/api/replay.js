import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from '#utils/database';
import { authContext } from '#utils/auth';
import { format } from 'date-fns';
import { forEach, groupBy } from 'lodash-es';
import { sortResults } from '#utils/battle';
import { shareTimeFile } from '#utils/upload';
import {
  Replay,
  Level,
  Kuski,
  Tag,
  ReplayRating,
  Time,
  TimeFile,
  LevelPackLevel,
  AllFinished,
  Battle,
  Battletime,
  SiteCupTime,
  ReplayLog,
} from '#data/models';
import sequelize from '../data/sequelize.js';

const router = express.Router();

const createRecName = (LevelName, nick, recTime) => {
  const timeAsString = `${recTime}`;
  const levName =
    LevelName.substring(0, 6) === 'QWQUU0'
      ? LevelName.substring(6, 8)
      : LevelName.replace('#', '');
  return `${levName}${nick.substring(
    0,
    Math.min(15 - (levName.length + timeAsString.length), 4),
  )}${timeAsString}.rec`;
};

const emptyRec = {
  ReplayIndex: 0,
  BattleIndex: 0,
  CupTimeIndex: 0,
  DrivenBy: 0,
  DrivenByText: '',
  UploadedBy: 0,
  LevelIndex: 0,
  TimeIndex: 0,
  ReplayTime: 0,
  Finished: 1,
  Uploaded: 0,
  UUID: '',
  RecFileName: '',
  Comment: '',
  TAS: 0,
  Bug: 0,
  Nitro: 0,
  DrivenByData: null,
  UploadedByData: null,
  Tags: [],
  Views: 0,
};

const findCupRecs = async where => {
  const findCupTimes = await SiteCupTime.findAll({
    where,
    attributes: ['CupTimeIndex', 'KuskiIndex', 'TimeIndex', 'Time', 'Views'],
    include: [
      {
        model: Time,
        as: 'TimeData',
        attributes: [
          'KuskiIndex',
          'Time',
          'Apples',
          'Driven',
          'Finished',
          'LevelIndex',
        ],
        include: [
          {
            model: Level,
            as: 'LevelData',
            attributes: ['LevelName'],
          },
        ],
      },
      {
        model: Kuski,
        as: 'KuskiData',
      },
    ],
  });
  return findCupTimes;
};

const findBattleRecs = async where => {
  const findBattles = await Battle.findAll({
    where,
    include: [
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
  return findBattles;
};

const cuptime2Rec = (c, uuid) => {
  return {
    ...emptyRec,
    CupTimeIndex: c.dataValues.CupTimeIndex,
    DrivenBy: c.dataValues.KuskiIndex,
    UploadedBy: c.dataValues.KuskiIndex,
    Uploaded: format(new Date(c.dataValues.TimeData.dataValues.Driven), 't'),
    LevelIndex: c.dataValues.TimeData.dataValues.LevelIndex,
    TimeIndex: c.dataValues.TimeIndex,
    ReplayTime: c.dataValues.Time * 10,
    Finished: c.dataValues.TimeData.Finished,
    UUID: `c-${c.dataValues.CupTimeIndex}`,
    RecFileName: `${uuid.replace(`c-${c.dataValues.CupTimeIndex}-`, '')}.rec`,
    DrivenByData: c.dataValues.KuskiData,
    UploadedByData: c.dataValues.KuskiData,
    LevelData: c.dataValues.TimeData.dataValues.LevelData,
    Views: c.dataValues.Views,
  };
};

export const battle2Rec = c => {
  const sorted = [...c.Results].sort(sortResults(c.BattleType));
  if (c.dataValues.RecFileName) {
    return {
      ...emptyRec,
      BattleIndex: c.BattleIndex,
      DrivenBy: sorted[0].KuskiIndex,
      UploadedBy: sorted[0].KuskiIndex,
      Uploaded: format(new Date(c.Started * 1000), 't'),
      LevelIndex: c.LevelIndex,
      TimeIndex: sorted[0].TimeIndex,
      ReplayTime: sorted[0].Time * 10,
      UUID: `b-${c.BattleIndex}`,
      RecFileName: c.RecFileName,
      DrivenByData: sorted[0].KuskiData,
      UploadedByData: sorted[0].KuskiData,
      LevelData: c.LevelData,
      Views: c.Views,
    };
  }

  return null;
};

const findTimeFiles = async where => {
  const battleReplays = await TimeFile.findAll({
    where,
    attributes: ['TimeIndex', 'UUID', 'MD5', 'Views'],
    include: [
      {
        model: AllFinished,
        as: 'TimeData',
        attributes: [
          'KuskiIndex',
          'Time',
          'Apples',
          'Driven',
          'Finished',
          'LevelIndex',
        ],
        required: true,
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
      },
    ],
  });
  return battleReplays;
};

const timeFile2Rec = c => {
  if (c.TimeData) {
    return {
      ...emptyRec,
      BattleIndex: c.dataValues.BattleIndex,
      DrivenBy: c.TimeData.dataValues.KuskiIndex,
      UploadedBy: c.TimeData.dataValues.KuskiIndex,
      LevelIndex: c.TimeData.dataValues.LevelIndex,
      TimeIndex: c.dataValues.TimeIndex,
      ReplayTime: c.TimeData.dataValues.Time * 10,
      Uploaded: c.TimeData.dataValues.Driven,
      UUID: `${c.dataValues.UUID}_${c.dataValues.MD5}_${c.dataValues.TimeIndex}`,
      RecFileName: createRecName(
        c.TimeData.dataValues.LevelData.dataValues.LevelName,
        c.TimeData.dataValues.KuskiData.Kuski,
        c.TimeData.dataValues.Time,
      ),
      DrivenByData: c.TimeData.dataValues.KuskiData,
      UploadedByData: c.TimeData.dataValues.KuskiData,
      LevelData: c.TimeData.dataValues.LevelData,
      Views: c.dataValues.Views,
    };
  }
  return c;
};

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
  'Views',
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
  excludedTags = [],
  LevelIndex = 0,
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

    if (sortBy === 'time') {
      return [[sequelize.literal(`ReplayTime ${order}`)]];
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
  if (LevelPackIndex && LevelPackIndex !== '0') {
    packLevels = await LevelPackLevel.findAll({
      attributes: ['LevelIndex'],
      where: {
        LevelPackIndex,
      },
    }).then(data => data.map(r => r.LevelIndex));
  }
  let levelWhere = packLevels.length ? { LevelIndex: packLevels } : {};

  // Filter by level (overrides level pack filtering)
  if (LevelIndex && LevelIndex !== '0') {
    levelWhere = { LevelIndex };
  }

  let having = '';
  if (tags.length) {
    having = `(
      SELECT count('TagIndex')
      FROM replay_tags
      WHERE replay_tags.ReplayIndex = replay.ReplayIndex
      AND replay_tags.TagIndex IN (${tags.join()})) >= ${tags.length}`;
  }
  if (excludedTags.length) {
    having += having ? ' AND ' : '';

    having += `(
      SELECT count('TagIndex')
      FROM replay_tags
      WHERE replay_tags.ReplayIndex = replay.ReplayIndex
      AND replay_tags.TagIndex IN (${excludedTags.join()})) = 0`;
  }

  const data = await Replay.findAll({
    limit: searchLimit(limit),
    offset: searchOffset(offset),
    where,
    order: getOrder(),
    group: ['ReplayIndex'],
    ...(having && {
      having: sequelize.literal(having),
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
        [
          sequelize.literal(`(
                  SELECT count(*)
                  FROM replay_rating
                  WHERE
                  replay_rating.ReplayIndex = replay.ReplayIndex
              )`),
          'ratingCnt',
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
        ...(Object.keys(levelWhere).length && {
          where: levelWhere,
        }),
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

const splitReplayTypes = replays => {
  const cuprecs = replays.filter(r => r.includes('c-'));
  const winners = replays.filter(r => r.includes('b-'));
  const timefiles = replays.filter(
    r => !r.includes('b-') && r.includes('_') && !r.includes('c-'),
  );
  const uploaded = replays.filter(
    r => !r.includes('_') && !r.includes('b-') && !r.includes('c-'),
  );
  return { cuprecs, winners, timefiles, uploaded };
};

const updateViews = async (replays, Fingerprint, KuskiIndex, data) => {
  const Day = format(new Date(), 'yyyyMMdd');
  const Timestamp = format(new Date(), 't');
  const where = { Day };
  if (!KuskiIndex && !Fingerprint) {
    return;
  }
  if (KuskiIndex) {
    where.KuskiIndex = KuskiIndex;
  } else if (Fingerprint) {
    where.Fingerprint = Fingerprint;
  }
  where.UUID = {
    [Op.in]: replays.map(r =>
      r.substring(0, 2) === 'c-' ? `${r.split('-')[0]}-${r.split('-')[1]}` : r,
    ),
  };
  const logs = await ReplayLog.findAll({ where });
  const grouped = groupBy(logs, 'UUID');
  const { cuprecs, winners, timefiles, uploaded } = splitReplayTypes(replays);
  uploaded.forEach(rec => {
    if (!grouped[rec]) {
      const recData = data.find(r => r.UUID === rec);
      ReplayLog.create({
        KuskiIndex,
        Fingerprint,
        UUID: rec,
        Day,
        Timestamp,
        ReplayIndex: recData.dataValues.ReplayIndex,
      });
      Replay.increment(
        { Views: 1 },
        { where: { ReplayIndex: recData.dataValues.ReplayIndex } },
      );
    }
  });
  cuprecs.forEach(rec => {
    const r = `${rec.split('-')[0]}-${rec.split('-')[1]}`;
    if (!grouped[r]) {
      ReplayLog.create({
        KuskiIndex,
        Fingerprint,
        UUID: r,
        Day,
        Timestamp,
        CupTimeIndex: r.split('-')[1],
      });
      SiteCupTime.increment(
        { Views: 1 },
        { where: { CupTimeIndex: r.split('-')[1] } },
      );
    }
  });
  winners.forEach(rec => {
    if (!grouped[rec]) {
      ReplayLog.create({
        KuskiIndex,
        Fingerprint,
        UUID: rec,
        Day,
        Timestamp,
        BattleIndex: rec.split('-')[1],
      });
      Battle.increment(
        { Views: 1 },
        { where: { BattleIndex: rec.split('-')[1] } },
      );
    }
  });
  timefiles.forEach(rec => {
    if (!grouped[rec]) {
      ReplayLog.create({
        KuskiIndex,
        Fingerprint,
        UUID: rec,
        Day,
        Timestamp,
        TimeIndex: rec.split('_')[2],
      });
      TimeFile.increment(
        { Views: 1 },
        { where: { TimeIndex: rec.split('_')[2] } },
      );
    }
  });
};

const getReplayByUUID = async (replayUUID, Fingerprint, KuskiIndex) => {
  const replays = replayUUID.split(';');
  const { cuprecs, winners, timefiles, uploaded } = splitReplayTypes(replays);
  const combined = [];
  if (cuprecs.length > 0) {
    const cuptimes = await findCupRecs({
      CupTimeIndex: { [Op.in]: cuprecs.map(c => c.split('-')[1]) },
    });
    if (replays.length > 1) {
      forEach(cuptimes, c => {
        combined.push(
          cuptime2Rec(
            c,
            cuprecs.find(r => r.includes(`c-${c.dataValues.CupTimeIndex}`)),
          ),
        );
      });
    } else {
      updateViews(replays, Fingerprint, KuskiIndex);
      return cuptime2Rec(cuptimes[0], cuprecs[0]);
    }
  }
  if (winners.length > 0) {
    const battles = await findBattleRecs({
      BattleIndex: { [Op.in]: winners.map(w => w.split('-')[1]) },
    });
    if (replays.length > 1) {
      forEach(battles, b => {
        combined.push(battle2Rec(b));
      });
    } else {
      updateViews(replays, Fingerprint, KuskiIndex);
      return battle2Rec(battles[0]);
    }
  }
  if (timefiles.length > 0) {
    const battlerecs = await findTimeFiles({
      UUID: { [Op.in]: timefiles.map(tf => tf.split('_')[0]) },
      MD5: { [Op.in]: timefiles.map(tf => tf.split('_')[1]) },
      TimeIndex: { [Op.in]: timefiles.map(tf => tf.split('_')[2]) },
    });
    if (replays.length > 1) {
      forEach(battlerecs, b => {
        combined.push(timeFile2Rec(b));
      });
    } else {
      updateViews(replays, Fingerprint, KuskiIndex);
      return timeFile2Rec(battlerecs[0]);
    }
  }
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
        attributes: ['Kuski', 'Country', 'KuskiIndex', 'BmpCRC'],
        as: 'DrivenByData',
      },
    ],
  };
  if (replays.length === 1) {
    const data = await Replay.findOne(query);
    updateViews(replays, Fingerprint, KuskiIndex, [data]);
    return data;
  }
  let listData;
  if (uploaded.length > 0) {
    query.where = {
      UUID: {
        [Op.in]: uploaded,
      },
    };
    listData = await Replay.findAll(query);
    forEach(listData, l => {
      combined.push(l);
    });
  }
  updateViews(replays, Fingerprint, KuskiIndex, listData);
  return replays
    .map(uuid =>
      uuid.includes('c-')
        ? `${uuid.split('-')[0]}-${uuid.split('-')[1]}`
        : uuid,
    )
    .map(uuid => combined.find(rec => rec.UUID === uuid));
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
    limit: 1000,
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

  const battles = await findBattleRecs({ LevelIndex });

  if (!battles) {
    return replays;
  }

  const finishedBattles = battles.filter(
    b => b.Finished === 1 || b.Aborted === 1,
  );
  const battleReplays = await findTimeFiles({
    BattleIndex: { [Op.in]: finishedBattles.map(r => r.BattleIndex) },
  });

  const winners = battles
    .filter(b => b.RecFileName !== null && b.Results.length > 0)
    .map(c => {
      return battle2Rec(c);
    });

  let combined = [];

  if (battleReplays.length !== 0) {
    combined = battleReplays.map(c => {
      return timeFile2Rec(c);
    });
  }
  combined = [...winners, ...combined].sort(
    (a, b) => a.ReplayTime - b.ReplayTime,
  );
  combined = combined.filter(
    (c, index) => combined.findIndex(x => x.DrivenBy === c.DrivenBy) === index,
  );

  return [...replays, ...combined]
    .sort((a, b) => a.ReplayTime - b.ReplayTime)
    .slice(0, 1000);
};

const shareReplay = async data => {
  const time = await Time.findOne({
    where: { TimeIndex: data.TimeIndex },
  });
  if (!time) {
    return false;
  }
  if (time.KuskiIndex === data.KuskiIndex) {
    const RecFileName = createRecName(
      data.LevelData.LevelName,
      data.Kuski,
      time.Time,
    );
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
  if (rec.dataValues.UploadedBy === data.KuskiIndex || data.mod) {
    const update = {};
    if (rec.dataValues.UploadedBy === data.KuskiIndex) {
      update.Comment = data.edit.Comment;
      update.Unlisted = data.edit.Unlisted;
    }
    const k = await Kuski.findOne({ where: { Kuski: data.edit.DrivenBy } });
    if (k) {
      update.DrivenBy = k.KuskiIndex;
      update.DrivenByText = '';
    } else {
      update.DrivenBy = 0;
      update.DrivenByText = data.edit.DrivenBy;
    }
    rec.update(update);

    // Set tags
    const tags = data.edit.Tags.filter(tag => !tag.Hidden).map(
      tag => tag.TagIndex,
    );
    // Add DNF tag when needed
    if (!rec.Finished) {
      const dnfTag = await Tag.findOne({ where: { Name: 'DNF' } });
      tags.push(dnfTag.TagIndex);
    }
    await rec.setTags(tags);

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
      req.query.excludedTags,
      req.query.level,
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
      const edit = await EditReplay({
        ...req.body,
        KuskiIndex: auth.userid,
        mod: auth.mod,
      });
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
    let KuskiIndex = 0;
    const auth = authContext(req);
    if (auth.auth) {
      KuskiIndex = auth.userid;
    }
    const data = await getReplayByUUID(
      req.params.UUID,
      req.query.f,
      KuskiIndex,
    );
    res.json(data);
  })

  .get('/byLevelIndex/:LevelIndex', async (req, res) => {
    const data = await getReplaysByLevelIndex(req.params.LevelIndex);
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
