import express from 'express';
import type { Response } from 'express';
import { Op, UniqueConstraintError } from 'sequelize';
import type { FindOptions, Model, Order, WhereOptions } from 'sequelize';
import {
  like,
  searchLimit,
  searchPageLimit,
  searchOffset,
} from '#utils/database.js';
import { authContext, authRights } from '#utils/auth.js';
import { format, getUnixTime } from 'date-fns';
import { forEach, groupBy } from 'lodash-es';
import crypto from 'crypto';
import { sortResults } from '#utils/battle.js';
import { shareTimeFile } from '#utils/upload.js';
import { queryInt, queryIntList, queryString } from '#utils/query.ts';
import { toUnixSeconds } from '#data/columns.ts';
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
import type { ReplayInstance } from '#data/models/Replay.ts';
import type { ApiError } from '#contract/endpoint.ts';
import type {
  EditReplayBody,
  InsertReplayBody,
  ReplayByUUIDResult,
  ReplayData,
  ReplayEndpoints,
  ShareReplayBody,
  ShareReplayResult,
  UpdateReplayResult,
} from '#contract/replay.ts';

const router = express.Router();

// the response of a route, by its key in the contract
type Res<Key extends keyof ReplayEndpoints> = Response<
  ReplayEndpoints[Key]['res']
>;

const createRecName = (LevelName: string, nick: string, recTime: number) => {
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

// the checksum of the rec file is not for clients
const publicColumns = { exclude: ['MD5'] };

const emptyRec: ReplayData = {
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
  Unlisted: 0,
  Hide: 0,
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

const findCupRecs = async (where: WhereOptions) => {
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

const findBattleRecs = async (where: WhereOptions) => {
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

// the models these come from aren't typed yet, so their values are read
// through dataValues. Anything built here is checked against ReplayData
const cuptime2Rec = (c: Model, uuid: string): ReplayData => {
  const time = c.dataValues.TimeData;
  return {
    ...emptyRec,
    CupTimeIndex: c.dataValues.CupTimeIndex,
    DrivenBy: c.dataValues.KuskiIndex,
    UploadedBy: c.dataValues.KuskiIndex,
    Uploaded: toUnixSeconds(time?.dataValues?.Driven),
    LevelIndex: time.dataValues.LevelIndex,
    TimeIndex: c.dataValues.TimeIndex,
    ReplayTime: c.dataValues.Time * 10,
    Finished: time.Finished === 'F' ? 1 : 0,
    Bug: time.Finished === 'B' ? 1 : 0,
    UUID: `c-${c.dataValues.CupTimeIndex}`,
    RecFileName: `${uuid.replace(`c-${c.dataValues.CupTimeIndex}-`, '')}.rec`,
    DrivenByData: c.dataValues.KuskiData,
    UploadedByData: c.dataValues.KuskiData,
    LevelData: time.dataValues.LevelData,
    Views: c.dataValues.Views,
  };
};

export const battle2Rec = (c: Model): ReplayData | null => {
  const sorted = [...c.dataValues.Results].sort(
    sortResults(c.dataValues.BattleType),
  );
  if (c.dataValues.RecFileName) {
    return {
      ...emptyRec,
      BattleIndex: c.dataValues.BattleIndex,
      DrivenBy: sorted[0].KuskiIndex,
      UploadedBy: sorted[0].KuskiIndex,
      Apples: sorted[0].Apples,
      // Started is read through its getter, as unix seconds
      Uploaded: Number(c.get('Started')) || 0,
      LevelIndex: c.dataValues.LevelIndex,
      TimeIndex: sorted[0].TimeIndex,
      ReplayTime: sorted[0].Time * 10,
      UUID: `b-${c.dataValues.BattleIndex}`,
      RecFileName: c.dataValues.RecFileName,
      DrivenByData: sorted[0].KuskiData,
      UploadedByData: sorted[0].KuskiData,
      LevelData: c.dataValues.LevelData,
      Views: c.dataValues.Views,
    };
  }

  return null;
};

const findTimeFiles = async (where: WhereOptions) => {
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

const timeFile2Rec = (c: Model): ReplayData | null => {
  const time = c.dataValues.TimeData;
  // the time is always there, it's an inner join
  if (!time) {
    return null;
  }
  return {
    ...emptyRec,
    BattleIndex: c.dataValues.BattleIndex,
    DrivenBy: time.dataValues.KuskiIndex,
    UploadedBy: time.dataValues.KuskiIndex,
    LevelIndex: time.dataValues.LevelIndex,
    TimeIndex: c.dataValues.TimeIndex,
    ReplayTime: time.dataValues.Time * 10,
    Uploaded: toUnixSeconds(time.dataValues.Driven),
    UUID: `${c.dataValues.UUID}_${c.dataValues.MD5}_${c.dataValues.TimeIndex}`,
    RecFileName: createRecName(
      time.dataValues.LevelData.dataValues.LevelName,
      time.dataValues.KuskiData.Kuski,
      time.dataValues.Time,
    ),
    DrivenByData: time.dataValues.KuskiData,
    UploadedByData: time.dataValues.KuskiData,
    LevelData: time.dataValues.LevelData,
    Views: c.dataValues.Views,
  };
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
  'Hide',
  'UUID',
  'RecFileName',
  'Comment',
  'TAS',
  'Bug',
  'Nitro',
  'Views',
];

type ReplayFilter = {
  offset?: number;
  limit?: number;
  tags?: number[];
  excludedTags?: number[];
  sortBy?: string;
  order?: 'asc' | 'desc';
  UploadedBy?: number;
  DrivenBy?: number;
  // the user asking. Their own replays include the unlisted ones
  UserId?: number;
  LevelPackIndex?: number;
  LevelIndex?: number;
};

// the list endpoints take the same query, see ReplayListQuery
const parseListQuery = (query: Record<string, unknown>): ReplayFilter => {
  const pageSize = queryInt(query.pageSize);
  return {
    offset: (pageSize ?? 0) * (queryInt(query.page) ?? 0),
    limit: pageSize,
    tags: queryIntList(query.tags),
    excludedTags: queryIntList(query.excludedTags),
    sortBy: queryString(query.sortBy),
    order: queryString(query.order)?.toLowerCase() === 'asc' ? 'asc' : 'desc',
    LevelPackIndex: queryInt(query.levelPack),
    LevelIndex: queryInt(query.level),
  };
};

const getReplays = async ({
  offset = 0,
  limit = 50,
  tags = [],
  excludedTags = [],
  sortBy = 'uploaded',
  order = 'desc',
  UploadedBy = 0,
  DrivenBy = 0,
  UserId = 0,
  LevelPackIndex = 0,
  LevelIndex = 0,
}: ReplayFilter) => {
  const getOrder = (): Order => {
    if (sortBy === 'rating') {
      return [
        sequelize.literal(`ratingAvg ${order}`),
        sequelize.literal(`ratingCnt ${order}`),
      ];
    }

    if (sortBy === 'views') {
      return [sequelize.literal(`Views ${order}`)];
    }

    if (sortBy === 'time') {
      return [sequelize.literal(`ReplayTime ${order}`)];
    }

    return [['Uploaded', order]];
  };

  let where: WhereOptions = { Unlisted: 0, Hide: 0 };
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
  let packLevels: number[] = [];
  if (LevelPackIndex) {
    packLevels = await LevelPackLevel.findAll({
      attributes: ['LevelIndex'],
      where: {
        LevelPackIndex,
      },
    }).then(data => data.map(r => r.dataValues.LevelIndex));
  }
  let levelWhere: WhereOptions = packLevels.length
    ? { LevelIndex: packLevels }
    : {};

  // Filter by level (overrides level pack filtering)
  if (LevelIndex) {
    levelWhere = { LevelIndex };
  }

  // the tag indexes are numbers, they can't change the query
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
      ...publicColumns,
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

const getReplayByReplayId = async (ReplayIndex: number) => {
  const data = await Replay.findAll({
    attributes: publicColumns,
    where: { ReplayIndex, Unlisted: 0 },
  });
  return data;
};

const splitReplayTypes = (replays: string[]) => {
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

const updateViews = async (
  replays: string[],
  Fingerprint: string | undefined,
  KuskiIndex: number,
  data?: ReplayInstance[],
) => {
  const Day = format(new Date(), 'yyyyMMdd');
  const Timestamp = format(new Date(), 't');
  if (!KuskiIndex && !Fingerprint) {
    return;
  }
  const where = {
    Day,
    ...(KuskiIndex ? { KuskiIndex } : { Fingerprint }),
    UUID: {
      [Op.in]: replays.map(r =>
        r.substring(0, 2) === 'c-'
          ? `${r.split('-')[0]}-${r.split('-')[1]}`
          : r,
      ),
    },
  };
  const logs = await ReplayLog.findAll({ where });
  const grouped = groupBy(
    logs.map(log => log.dataValues),
    'UUID',
  );
  const { cuprecs, winners, timefiles, uploaded } = splitReplayTypes(replays);
  uploaded.forEach(rec => {
    if (!grouped[rec]) {
      const recData = data?.find(r => r.UUID === rec);
      if (!recData) {
        return;
      }
      ReplayLog.create({
        KuskiIndex,
        Fingerprint,
        UUID: rec,
        Day,
        Timestamp,
        ReplayIndex: recData.ReplayIndex,
      });
      Replay.increment(
        { Views: 1 },
        { where: { ReplayIndex: recData.ReplayIndex } },
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

const getReplayByUUID = async (
  replayUUID: string,
  Fingerprint: string | undefined,
  KuskiIndex: number,
): Promise<ReplayByUUIDResult> => {
  const replays = replayUUID.split(';');
  const { cuprecs, winners, timefiles, uploaded } = splitReplayTypes(replays);
  const combined: (ReplayData | null)[] = [];
  if (cuprecs.length > 0) {
    const cuptimes = await findCupRecs({
      CupTimeIndex: { [Op.in]: cuprecs.map(c => c.split('-')[1]) },
    });
    if (replays.length > 1) {
      forEach(cuptimes, c => {
        combined.push(
          cuptime2Rec(
            c,
            cuprecs.find(r => r.includes(`c-${c.dataValues.CupTimeIndex}`)) ??
              '',
          ),
        );
      });
    } else {
      updateViews(replays, Fingerprint, KuskiIndex);
      if (cuptimes.length === 0) {
        return null;
      }
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
      if (battles.length === 0) {
        return null;
      }
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
      if (battlerecs.length === 0) {
        return null;
      }
      updateViews(replays, Fingerprint, KuskiIndex);
      return timeFile2Rec(battlerecs[0]);
    }
  }
  const query: FindOptions = {
    attributes: publicColumns,
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
    if (data) {
      updateViews(replays, Fingerprint, KuskiIndex, [data]);
    }
    return data;
  }
  let listData: ReplayInstance[] | undefined;
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
    .map(uuid => combined.find(rec => rec?.UUID === uuid) ?? null);
};

const getReplaysSearchDriven = async (query: string, offset: string) => {
  const data = await Replay.findAll({
    attributes: publicColumns,
    limit: searchPageLimit(offset),
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

const getReplaysSearchLevel = async (query: string, offset: string) => {
  const data = await Replay.findAll({
    attributes: publicColumns,
    limit: searchPageLimit(offset),
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

const getReplaysSearchFilename = async (query: string, offset: string) => {
  const replays = await Replay.findAll({
    attributes: publicColumns,
    offset: searchOffset(offset),
    where: {
      RecFileName: {
        [Op.like]: `${like(query)}%`,
      },
      Unlisted: 0,
    },
    limit: searchPageLimit(offset),
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

const getMaxReplayIndex = async (): Promise<number> => {
  const result: number | null = await Replay.max('ReplayIndex');
  return result || 1;
};

const generateRandomReplayIndices = (maxIndex: number, count: number) => {
  const indices = new Set<number>();
  while (indices.size < count) {
    indices.add(crypto.randomInt(1, maxIndex + 1));
  }
  return Array.from(indices);
};

const getRandomReplays = async (limit = 100) => {
  const maxReplayIndex = await getMaxReplayIndex();
  const requestedLimit = searchLimit(limit);
  const randomIndices = generateRandomReplayIndices(
    maxReplayIndex,
    Math.min(requestedLimit * 2, maxReplayIndex),
  );

  const data = await Replay.findAll({
    attributes: publicColumns,
    limit: requestedLimit,
    where: {
      Unlisted: 0,
      ReplayIndex: { [Op.in]: randomIndices },
    },
    include: [
      {
        model: Level,
        attributes: ['LevelName', 'LevelIndex'],
        as: 'LevelData',
        where: { Locked: 0 },
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

  const sortedData = randomIndices
    .map(index => data.find(replay => replay.ReplayIndex === index))
    .filter(replay => replay !== undefined)
    .slice(0, requestedLimit);

  return sortedData;
};

const InsertReplay = async (
  data: InsertReplayBody,
  userid: number,
): Promise<ReplayInstance | ApiError> => {
  // unique MD5 index guards against concurrent uploads of the same replay
  let replay: ReplayInstance;
  try {
    replay = await Replay.create({
      UUID: data.UUID,
      RecFileName: data.RecFileName,
      Uploaded: data.Uploaded,
      ReplayTime: data.ReplayTime,
      Finished: data.Finished,
      LevelIndex: data.LevelIndex,
      Unlisted: data.Unlisted,
      Hide: data.Hide,
      DrivenBy: data.DrivenBy,
      DrivenByText: data.DrivenBy !== 0 ? '' : data.DrivenByText,
      TAS: data.TAS,
      Bug: data.Bug,
      Nitro: data.Nitro,
      Comment: data.Comment,
      MD5: data.MD5,
      UploadedBy: userid,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return { error: 'Duplicate upload.' };
    }
    throw error;
  }

  // Set tags
  const tags = data.Tags.filter(tag => !tag.Hidden).map(tag => tag.TagIndex);
  // Add DNF tag when needed
  if (!replay.Finished) {
    const dnfTag = await Tag.findOne({ where: { Name: 'DNF' } });
    if (dnfTag) {
      tags.push(dnfTag.TagIndex);
    }
  }
  await replay.setTags(tags);

  return replay;
};

const UpdateReplay = async (
  ReplayIndex: number,
  userid: number,
): Promise<UpdateReplayResult> => {
  const replay = await Replay.findOne({
    where: { ReplayIndex },
  });
  if (!replay) {
    return { success: 0, error: 'Replay not found.' };
  }
  if (replay.UploadedBy !== userid) {
    return {
      success: 0,
      error: 'Only the original uploader can make this replay public.',
    };
  }
  await replay.update({ Unlisted: 0 });
  return {
    success: 1,
    ReplayIndex: replay.ReplayIndex,
    UUID: replay.UUID,
    RecFileName: replay.RecFileName,
    Unlisted: replay.Unlisted,
  };
};

const getReplaysByLevelIndex = async (LevelIndex: number) => {
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

  const finishedBattles = battles.filter(
    b => b.dataValues.Finished === 1 || b.dataValues.Aborted === 1,
  );
  const battleReplays = await findTimeFiles({
    BattleIndex: {
      [Op.in]: finishedBattles.map(r => r.dataValues.BattleIndex),
    },
  });

  const winners = battles
    .filter(
      b => b.dataValues.RecFileName !== null && b.dataValues.Results.length > 0,
    )
    .map(c => {
      return battle2Rec(c);
    });

  const byReplayTime = (a: ReplayData, b: ReplayData) =>
    (a.ReplayTime ?? 0) - (b.ReplayTime ?? 0);

  let combined: ReplayData[] = [];

  if (battleReplays.length !== 0) {
    combined = battleReplays
      .map(c => timeFile2Rec(c))
      .filter(rec => rec !== null);
  }
  combined = [...winners.filter(rec => rec !== null), ...combined].sort(
    byReplayTime,
  );
  combined = combined.filter(
    (c, index) => combined.findIndex(x => x.DrivenBy === c.DrivenBy) === index,
  );

  const all: ReplayData[] = [...replays, ...combined];
  return all.sort(byReplayTime).slice(0, 1000);
};

const shareReplay = async (
  data: ShareReplayBody & { KuskiIndex: number; Kuski: string },
): Promise<ShareReplayResult | false> => {
  const time = await Time.findOne({
    where: { TimeIndex: data.TimeIndex },
  });
  if (!time) {
    return false;
  }
  const recExists = await Replay.findOne({
    where: { MD5: data.TimeFileData.MD5 },
  });
  if (recExists) {
    return { success: 0, error: 'duplicate' };
  }
  if (time.dataValues.KuskiIndex === data.KuskiIndex) {
    const RecFileName = createRecName(
      data.LevelData.LevelName,
      data.Kuski,
      time.dataValues.Time,
    );
    const isMoved = await shareTimeFile(data.TimeFileData, RecFileName);
    if (isMoved) {
      const inserted = await InsertReplay(
        {
          DrivenBy: time.dataValues.KuskiIndex,
          DrivenByText: '',
          LevelIndex: time.dataValues.LevelIndex,
          ReplayTime: time.dataValues.Time * 10,
          Finished: time.dataValues.Finished === 'F' ? 1 : 0,
          Uploaded: getUnixTime(new Date()),
          Unlisted: Number(data.Unlisted),
          Hide: Number(data.Hide),
          TAS: 0,
          Bug: time.dataValues.Finished === 'B' ? 1 : 0,
          Nitro: 0,
          Comment: data.Comment,
          UUID: data.TimeFileData.UUID,
          RecFileName,
          MD5: data.TimeFileData.MD5,
          Tags: data.Tags,
        },
        time.dataValues.KuskiIndex,
      );
      if ('error' in inserted) {
        return { success: 0, error: 'Duplicate upload' };
      }
      await TimeFile.update(
        { Shared: 1 },
        { where: { TimeFileIndex: data.TimeFileData.TimeFileIndex } },
      );
      return { success: 1 };
    }
  }
  return false;
};

const EditReplay = async (
  data: EditReplayBody & { KuskiIndex: number; mod: boolean },
) => {
  const rec = await Replay.findOne({
    where: { UUID: data.ReplayUuid, RecFileName: `${data.RecFileName}.rec` },
  });
  if (!rec) {
    return 404;
  }
  if (rec.UploadedBy === data.KuskiIndex || data.mod) {
    const update: Partial<
      Pick<ReplayData, 'Comment' | 'Unlisted' | 'DrivenBy' | 'DrivenByText'>
    > = {};
    if (rec.UploadedBy === data.KuskiIndex) {
      update.Comment = data.edit.Comment;
      update.Unlisted = data.edit.Unlisted;
    }
    const k = await Kuski.findOne({ where: { Kuski: data.edit.DrivenBy } });
    if (k) {
      update.DrivenBy = k.dataValues.KuskiIndex;
      update.DrivenByText = '';
    } else {
      update.DrivenBy = 0;
      update.DrivenByText = data.edit.DrivenBy;
    }
    await rec.update(update);

    // Set tags
    const tags = data.edit.Tags.filter(tag => !tag.Hidden).map(
      tag => tag.TagIndex,
    );
    // hidden tags cannot be edited here, so keep the existing ones
    const currentTags = await rec.getTags();
    tags.push(
      ...currentTags.filter(tag => tag.Hidden).map(tag => tag.TagIndex),
    );
    // Add DNF tag when needed
    if (!rec.Finished) {
      const dnfTag = await Tag.findOne({ where: { Name: 'DNF' } });
      if (dnfTag) {
        tags.push(dnfTag.TagIndex);
      }
    }
    await rec.setTags([...new Set(tags)]);

    return 200;
  }
  return 401;
};

router
  .get('/', async (req, res: Res<'GET /replay'>) => {
    const data = await getReplays(parseListQuery(req.query));
    res.json(data);
  })
  .post('/', async (req, res: Res<'POST /replay'>) => {
    const auth = authContext(req);
    if (auth.auth) {
      const body: InsertReplayBody = req.body;
      const insert = await InsertReplay(body, auth.userid);
      res.json(insert);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/update', async (req, res: Res<'POST /replay/update'>) => {
    const auth = authContext(req);
    if (auth.auth) {
      const update = await UpdateReplay(req.body.ReplayIndex, auth.userid);
      res.json(update);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/share', async (req, res: Res<'POST /replay/share'>) => {
    const auth = authContext(req);
    if (auth.auth) {
      const body: ShareReplayBody = req.body;
      const success = await shareReplay({
        ...body,
        KuskiIndex: auth.userid,
        Kuski: auth.user,
      });
      if (success) {
        res.json(success);
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/edit', async (req, res: Res<'POST /replay/edit'>) => {
    const auth = await authRights(req);
    if (auth.auth) {
      const body: EditReplayBody = req.body;
      const edit = await EditReplay({
        ...body,
        KuskiIndex: auth.userid,
        mod: auth.mod,
      });
      res.sendStatus(edit);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/my', async (req, res: Res<'GET /replay/my'>) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await getReplays({
        ...parseListQuery(req.query),
        UploadedBy: auth.userid,
      });
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/random', async (req, res: Res<'GET /replay/random'>) => {
    const limit = queryInt(req.query.limit) || 100;
    const data = await getRandomReplays(limit);
    res.json(data);
  })
  .get('/:ReplayIndex', async (req, res: Res<'GET /replay/:ReplayIndex'>) => {
    const ReplayIndex = queryInt(req.params.ReplayIndex);
    const data =
      ReplayIndex === undefined ? [] : await getReplayByReplayId(ReplayIndex);
    res.json(data);
  })
  .get(
    '/driven_by/:KuskiIndex',
    async (req, res: Res<'GET /replay/driven_by/:KuskiIndex'>) => {
      const auth = authContext(req);
      const data = await getReplays({
        ...parseListQuery(req.query),
        DrivenBy: queryInt(req.params.KuskiIndex),
        UserId: auth.userid,
      });
      res.json(data);
    },
  )
  .get(
    '/uploaded_by/:KuskiIndex',
    async (req, res: Res<'GET /replay/uploaded_by/:KuskiIndex'>) => {
      const auth = authContext(req);
      const data = await getReplays({
        ...parseListQuery(req.query),
        UploadedBy: queryInt(req.params.KuskiIndex),
        UserId: auth.userid,
      });
      res.json(data);
    },
  )

  .get('/byUUID/:UUID', async (req, res: Res<'GET /replay/byUUID/:UUID'>) => {
    let KuskiIndex = 0;
    const auth = authContext(req);
    if (auth.auth) {
      KuskiIndex = auth.userid;
    }
    const data = await getReplayByUUID(
      req.params.UUID,
      queryString(req.query.f),
      KuskiIndex,
    );
    res.json(data);
  })

  .get(
    '/byLevelIndex/:LevelIndex',
    async (req, res: Res<'GET /replay/byLevelIndex/:LevelIndex'>) => {
      const LevelIndex = queryInt(req.params.LevelIndex);
      const data =
        LevelIndex === undefined
          ? []
          : await getReplaysByLevelIndex(LevelIndex);
      res.json(data);
    },
  )

  .get(
    '/search/byDriven/:query/:offset',
    async (req, res: Res<'GET /replay/search/byDriven/:query/:offset'>) => {
      const data = await getReplaysSearchDriven(
        req.params.query,
        req.params.offset,
      );
      res.json(data);
    },
  )
  .get(
    '/search/byLevel/:query/:offset',
    async (req, res: Res<'GET /replay/search/byLevel/:query/:offset'>) => {
      const data = await getReplaysSearchLevel(
        req.params.query,
        req.params.offset,
      );
      res.json(data);
    },
  )
  .get(
    '/search/byFilename/:query/:offset',
    async (req, res: Res<'GET /replay/search/byFilename/:query/:offset'>) => {
      const data = await getReplaysSearchFilename(
        req.params.query,
        req.params.offset,
      );
      res.json(data);
    },
  );

export default router;
