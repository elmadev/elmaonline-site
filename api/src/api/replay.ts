import express from 'express';
import { Op, UniqueConstraintError } from 'sequelize';
import type { FindOptions, Model, Order, WhereOptions } from 'sequelize';
import {
  like,
  searchLimit,
  searchPageLimit,
  searchOffset,
} from '#utils/database.js';
import { authContext, authRights } from '#utils/auth.js';
import { format } from 'date-fns';
import { forEach, groupBy } from 'lodash-es';
import crypto from 'crypto';
import { sortResults } from '#utils/battle.js';
import { shareTimeFile } from '#utils/upload.js';
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
import { toUnixSeconds } from '#data/columns.ts';
import type {
  ReplayByUUIDResponse,
  ReplayCreateBody,
  ReplayCreateResponse,
  ReplayItem,
  ReplayListQuery,
  ReplayPublishBody,
  ReplayPublishResponse,
  ReplayRow,
  ReplayShareBody,
  ReplayShareResponse,
  ReplayUpdateBody,
} from '#contract/replay.ts';
import type { RawQuery, Req, Res } from '#utils/express.ts';
import type { SiteCupTimeInstance } from '#data/models/SiteCupTime.ts';
import type { BattleInstance } from '#data/models/Battle.ts';
import { queryInt, queryIntList, queryString } from '#utils/query.ts';

const router = express.Router();

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

const cuptime2Rec = (c: SiteCupTimeInstance, uuid: string): ReplayItem => {
  const { TimeData } = c;
  if (!TimeData) {
    throw new Error('cuptime2Rec requires the TimeData include');
  }
  return {
    ...emptyRec,
    CupTimeIndex: c.CupTimeIndex,
    DrivenBy: c.KuskiIndex,
    UploadedBy: c.KuskiIndex,
    // dataValues skips the Driven getter, which would turn it into unix seconds
    Uploaded: toUnixSeconds(TimeData.dataValues.Driven),
    LevelIndex: TimeData.LevelIndex,
    TimeIndex: c.TimeIndex,
    ReplayTime: c.Time * 10,
    Finished: TimeData.Finished === 'F' ? 1 : 0,
    UUID: `c-${c.CupTimeIndex}`,
    RecFileName: `${uuid.replace(`c-${c.CupTimeIndex}-`, '')}.rec`,
    DrivenByData: c.KuskiData,
    UploadedByData: c.KuskiData,
    LevelData: TimeData.LevelData,
    Views: c.Views,
  };
};

export const battle2Rec = (c: BattleInstance): ReplayItem | null => {
  if (!c.Results) {
    throw new Error('battle2Rec requires the Results include');
  }
  const sorted = [...c.Results].sort(sortResults(c.BattleType));
  if (c.dataValues.RecFileName) {
    return {
      ...emptyRec,
      BattleIndex: c.BattleIndex,
      DrivenBy: sorted[0].KuskiIndex,
      UploadedBy: sorted[0].KuskiIndex,
      Apples: sorted[0].Apples,
      Uploaded: Number(c.get('Started')) || 0,
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

const timeFile2Rec = (c: Model): ReplayItem | null => {
  const time = c.dataValues.TimeData;
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

const getReplays = async ({
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
}: ReplayFilter): Promise<ReplayItem[]> => {
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

const getReplayByReplayId = async (
  ReplayIndex: number,
): Promise<ReplayItem[]> => {
  const data = await Replay.findAll({
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
  data?: ReplayRow[],
) => {
  if (!KuskiIndex && !Fingerprint) {
    return;
  }
  const Day = format(new Date(), 'yyyyMMdd');
  const Timestamp = format(new Date(), 't');
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
  const grouped = groupBy(logs, 'UUID');
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
        Timestamp: Number(Timestamp),
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
        Timestamp: Number(Timestamp),
        CupTimeIndex: Number(r.split('-')[1]),
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
        Timestamp: Number(Timestamp),
        BattleIndex: Number(rec.split('-')[1]),
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
        Timestamp: Number(Timestamp),
        TimeIndex: Number(rec.split('_')[2]),
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
): Promise<ReplayByUUIDResponse> => {
  const replays = replayUUID.split(';');
  const { cuprecs, winners, timefiles, uploaded } = splitReplayTypes(replays);
  const combined: (ReplayItem | null)[] = [];
  if (cuprecs.length > 0) {
    const cuptimes = await findCupRecs({
      CupTimeIndex: { [Op.in]: cuprecs.map(c => c.split('-')[1]) },
    });
    if (replays.length > 1) {
      forEach(cuptimes, c => {
        const uuid = cuprecs.find(r => r.includes(`c-${c.CupTimeIndex}`));
        if (uuid) {
          combined.push(cuptime2Rec(c, uuid));
        }
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
  let listData: ReplayRow[] | undefined;
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

const getReplaysSearchDriven = async (
  query: string,
  offset: string,
): Promise<ReplayItem[]> => {
  const data = await Replay.findAll({
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

const getReplaysSearchLevel = async (
  query: string,
  offset: string,
): Promise<ReplayItem[]> => {
  const data = await Replay.findAll({
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

const getReplaysSearchFilename = async (
  query: string,
  offset: string,
): Promise<ReplayItem[]> => {
  const replays = await Replay.findAll({
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

const getRandomReplays = async (limit = 100): Promise<ReplayItem[]> => {
  const maxReplayIndex = await getMaxReplayIndex();
  const requestedLimit = searchLimit(limit);
  const randomIndices = generateRandomReplayIndices(
    maxReplayIndex,
    Math.min(requestedLimit * 2, maxReplayIndex),
  );

  const data = await Replay.findAll({
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

const InsertReplay = async (data: ReplayCreateBody, userid: number) => {
  const insertData = { ...data, UploadedBy: userid };
  if (insertData.DrivenBy !== 0) {
    insertData.DrivenByText = '';
  }
  // unique MD5 index guards against concurrent uploads of the same replay
  let replay;
  try {
    replay = await Replay.create(insertData);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return { error: 'Duplicate upload.' };
    }
    throw error;
  }

  // Set tags
  const tags = insertData.Tags.filter(tag => !tag.Hidden).map(
    tag => tag.TagIndex,
  );
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
): Promise<ReplayPublishResponse> => {
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

const getReplaysByLevelIndex = async (
  LevelIndex: number,
): Promise<ReplayItem[]> => {
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
    .filter(b => b.RecFileName !== null && b.Results?.length)
    .flatMap(c => battle2Rec(c) ?? []);

  const timeFiles = battleReplays.flatMap(c => timeFile2Rec(c) ?? []);

  const combined = [...winners, ...timeFiles]
    .sort((a, b) => (a?.ReplayTime || 0) - (b?.ReplayTime || 0))
    .filter(
      (c, index, all) =>
        all.findIndex(x => x.DrivenBy === c.DrivenBy) === index,
    );

  return [...replays, ...combined]
    .sort((a, b) => (a?.ReplayTime || 0) - (b?.ReplayTime || 0))
    .slice(0, 1000);
};

const shareReplay = async (
  data: ReplayShareBody & { KuskiIndex: number; Kuski: string },
): Promise<ReplayShareResponse | false> => {
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
  if (time.KuskiIndex === data.KuskiIndex) {
    const RecFileName = createRecName(
      data.LevelData.LevelName,
      data.Kuski,
      time.Time,
    );
    const isMoved = await shareTimeFile(data.TimeFileData, RecFileName);
    if (isMoved) {
      const inserted = await InsertReplay(
        {
          DrivenBy: time.KuskiIndex,
          UploadedBy: time.KuskiIndex,
          LevelIndex: time.LevelIndex,
          TimeIndex: time.TimeIndex,
          ReplayTime: time.Time * 10,
          Finished: time.Finished === 'F' ? 1 : 0,
          Uploaded: Number(format(new Date(), 't')),
          Unlisted: Number(data.Unlisted),
          Hide: Number(data.Hide),
          Bug: time.Finished === 'B' ? 1 : 0,
          Comment: data.Comment,
          UUID: data.TimeFileData.UUID,
          RecFileName,
          MD5: data.TimeFileData.MD5,
          Tags: data.Tags,
        },
        time.KuskiIndex,
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
  data: ReplayUpdateBody & { KuskiIndex: number; mod: boolean },
): Promise<200 | 401 | 404> => {
  const rec = await Replay.findOne({
    where: { UUID: data.ReplayUuid, RecFileName: `${data.RecFileName}.rec` },
  });
  if (!rec) {
    return 404;
  }
  if (rec.dataValues.UploadedBy === data.KuskiIndex || data.mod) {
    const update: Partial<ReplayRow> = {};
    if (rec.dataValues.UploadedBy === data.KuskiIndex) {
      update.Comment = data.edit.Comment;
      update.Unlisted = data.edit.Unlisted;
    }
    const k = data.edit.DrivenBy
      ? await Kuski.findOne({ where: { Kuski: data.edit.DrivenBy } })
      : null;
    if (k) {
      update.DrivenBy = k.KuskiIndex;
      update.DrivenByText = '';
    } else {
      update.DrivenBy = 0;
      update.DrivenByText = data.edit.DrivenBy;
    }
    rec.update(update);

    // Set tags
    const tags: number[] = data.edit.Tags.filter(tag => !tag.Hidden).map(
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

const parseListQuery = (
  query: Partial<Record<keyof ReplayListQuery, unknown>>,
): ReplayFilter => {
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

router
  .get(
    '/',
    async (
      req: Req<unknown, RawQuery<ReplayListQuery>>,
      res: Res<ReplayItem[]>,
    ) => {
      const data = await getReplays(parseListQuery(req.query));
      res.json(data);
    },
  )
  .post(
    '/',
    async (req: Req<ReplayCreateBody>, res: Res<ReplayCreateResponse>) => {
      const auth = authContext(req);
      if (auth.auth) {
        const insert = await InsertReplay(req.body, auth.userid);
        res.json(insert);
      } else {
        res.sendStatus(401);
      }
    },
  )
  .post(
    '/update',
    async (req: Req<ReplayPublishBody>, res: Res<ReplayPublishResponse>) => {
      const auth = authContext(req);
      if (auth.auth) {
        const update = await UpdateReplay(req.body.ReplayIndex, auth.userid);
        res.json(update);
      } else {
        res.sendStatus(401);
      }
    },
  )
  .post(
    '/share',
    async (req: Req<ReplayShareBody>, res: Res<ReplayShareResponse>) => {
      const auth = authContext(req);
      if (auth.auth) {
        const success = await shareReplay({
          ...req.body,
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
    },
  )
  .post('/edit', async (req: Req<ReplayUpdateBody>, res) => {
    const auth = await authRights(req);
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
  .get(
    '/my',
    async (
      req: Req<unknown, RawQuery<ReplayListQuery>>,
      res: Res<ReplayItem[]>,
    ) => {
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
    },
  )
  .get(
    '/random',
    async (
      req: Req<unknown, RawQuery<{ limit: number }>>,
      res: Res<ReplayItem[]>,
    ) => {
      const limit = queryInt(req.query.limit) || 100;
      const data = await getRandomReplays(limit);
      res.json(data);
    },
  )
  .get('/:ReplayIndex', async (req, res: Res<ReplayItem[]>) => {
    const ReplayIndex = queryInt(req.params.ReplayIndex);
    const data =
      ReplayIndex === undefined ? [] : await getReplayByReplayId(ReplayIndex);
    res.json(data);
  })
  .get(
    '/driven_by/:KuskiIndex',
    async (
      req: Req<unknown, RawQuery<ReplayListQuery>>,
      res: Res<ReplayItem[]>,
    ) => {
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
    async (
      req: Req<unknown, RawQuery<ReplayListQuery>>,
      res: Res<ReplayItem[]>,
    ) => {
      const auth = authContext(req);
      const data = await getReplays({
        ...parseListQuery(req.query),
        UploadedBy: queryInt(req.params.KuskiIndex),
        UserId: auth.userid,
      });
      res.json(data);
    },
  )

  .get('/byUUID/:UUID', async (req, res: Res<ReplayByUUIDResponse>) => {
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

  .get('/byLevelIndex/:LevelIndex', async (req, res: Res<ReplayItem[]>) => {
    const LevelIndex = queryInt(req.params.LevelIndex);
    const data =
      LevelIndex === undefined ? [] : await getReplaysByLevelIndex(LevelIndex);
    res.json(data);
  })

  .get(
    '/search/byDriven/:query/:offset',
    async (req, res: Res<ReplayItem[]>) => {
      const data = await getReplaysSearchDriven(
        req.params.query,
        req.params.offset,
      );
      res.json(data);
    },
  )
  .get(
    '/search/byLevel/:query/:offset',
    async (req, res: Res<ReplayItem[]>) => {
      const data = await getReplaysSearchLevel(
        req.params.query,
        req.params.offset,
      );
      res.json(data);
    },
  )
  .get(
    '/search/byFilename/:query/:offset',
    async (req, res: Res<ReplayItem[]>) => {
      const data = await getReplaysSearchFilename(
        req.params.query,
        req.params.offset,
      );
      res.json(data);
    },
  );

export default router;
