import express from 'express';
import connection from '#data/sequelize';
import { Op } from 'sequelize';
import { authContext } from '#utils/auth';
import { formatLevelSearch, fromTo, log } from '#utils/database';
import { groupBy, orderBy, uniqBy } from 'lodash-es';
import {
  Besttime,
  Kuski,
  Level,
  Team,
  BestMultitime,
  LegacyBesttime,
  TimeFile,
} from '../data/models';

const router = express.Router();

const levelInfo = async LevelIndex => {
  const lev = await Level.findOne({
    where: { LevelIndex },
    attributes: ['Hidden', 'Locked', 'Legacy'],
  });
  return lev;
};

export const getTimes = async (
  LevelIndex,
  limit,
  eolOnly = 0,
  Country,
  TeamIndex,
) => {
  const lev = await levelInfo(LevelIndex);
  if (!lev || lev.Locked || lev.Hidden) return [];
  let timeTable = Besttime;
  if (lev.Legacy && !eolOnly) {
    timeTable = LegacyBesttime;
  }
  const kuskiInclude = {
    model: Kuski,
    as: 'KuskiData',
  };
  if (Country) {
    kuskiInclude.where = { Country };
  }
  if (TeamIndex) {
    kuskiInclude.where = { TeamIndex };
  }
  const times = await timeTable.findAll({
    where: { LevelIndex },
    order: [
      ['Time', 'ASC'],
      ['TimeIndex', 'ASC'],
    ],
    limit: parseInt(limit, 10),
    include: [kuskiInclude],
  });
  return times;
};

const getMultiTimes = async (LevelIndex, limit) => {
  const lev = await levelInfo(LevelIndex);
  if (!lev || lev.Locked || lev.Hidden) return [];
  const times = await BestMultitime.findAll({
    where: { LevelIndex },
    order: [
      ['Time', 'ASC'],
      ['MultiTimeIndex', 'ASC'],
    ],
    limit: parseInt(limit, 10),
    include: [
      {
        model: Kuski,
        as: 'Kuski1Data',
      },
      {
        model: Kuski,
        as: 'Kuski2Data',
      },
    ],
  });
  return times;
};

const getLatest = async (KuskiIndex, limit, lev, from, to, UserId = 0) => {
  let where = { KuskiIndex };
  const personal = UserId === parseInt(KuskiIndex, 10);
  const LevelName = formatLevelSearch(lev);
  if (LevelName) {
    const level = await Level.findAll({ where: { LevelName } });
    where.LevelIndex = {
      [Op.in]: level.map(r => r.LevelIndex),
    };
  }
  where = { ...where, ...fromTo(from, to, 'Driven') };
  const include = [
    {
      model: Level,
      as: 'LevelData',
      attributes: ['LevelName', 'Locked', 'Hidden'],
    },
  ];
  if (personal) {
    include.push({
      model: TimeFile,
      as: 'TimeFileData',
    });
  }
  const query = {
    where,
    order: [['TimeIndex', 'DESC']],
    attributes: ['TimeIndex', 'Time', 'Driven', 'LevelIndex'],
    include,
    limit: parseInt(limit, 10) > 10000 ? 10000 : parseInt(limit, 10),
  };
  const times = await Besttime.findAll(query);
  if (personal) {
    return times;
  }
  return times.filter(t => {
    if (t.LevelData) {
      if (t.LevelData.Locked || t.LevelData.Hidden) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  });
};

// Gets first place records driven in an arbitrary time
// interval not including those driven during battles.
// However, if the end of the interval is some date in the past,
// then records that have been beaten after that will get ignored.
// this is not ideal but its the best we can do right now.
// *** IN MOST CASES: end should === now. ***
// However, using an end date in the past can make sense if repeatLevels is false,
// then the function returns all records driven in some interval that still
// stand today.
// Every entry returned was a first place record at the time it was driven,
// but might no longer be, hence CurrentStanding.
// Only one kuski per level can be returned. If a kuski drives many records
// in the interval, the best one is used.
// The same level can occur many times, unless repeatLevels is false.
// When the same level occurs more than once, CurrentStanding can be greater
// than 1, otherwise, it cannot.
// Entries are ordered by the total time spent on the level by all kuskis,
// not by when the record was driven.
// Using a large interval and limit can have performance drawbacks,
// but large or small interval with small (<300 ish) limit is no issue at all.
// For larger limits, repeatLevels false will be 2-3x faster.
const getBestRecordsDrivenRecently = async (
  start,
  end,
  limit,
  repeatLevels = true,
) => {
  // eslint-disable-next-line no-param-reassign
  limit = limit && limit > 0 ? Math.min(limit, 5000) : 100;

  const q = `
    SELECT TopTime0 Time,
           TopDriven0 Driven,
           TopKuskiIndex0 KuskiIndex,
           TopBattleIndex0 BattleIndex,
           levelstats.LevelIndex LevelIndex,
           TimeAll,
           AttemptsAll,
           KuskiCountAll,
           KuskiCountF,
           LeaderHistory,
           LeaderCount,
           1 CurrentStanding,
           UniqueLeaderCount
    FROM levelstats
    INNER JOIN level ON level.LevelIndex = levelstats.LevelIndex
      AND level.Locked = 0 AND level.Hidden = 0
    WHERE TopTime0 IS NOT NULL
      AND TopBattleIndex0 IS NULL
    AND TopDriven0 BETWEEN ? AND ?
    ORDER BY TimeAll DESC
    LIMIT 0, ?
  `;

  const [stats] = await connection.query(q, {
    replacements: [start, end, limit],
    benchmark: true,
    logging: (query, b) => log('query', query, b),
  });

  let records;

  if (!repeatLevels) {
    records = stats.map(s => {
      return {
        ...s,
        LeaderHistory: null,
        CurrentStanding: 1,
      };
    });
  } else {
    // check leader history for prev records on same level
    // driven within same timeframe.
    records = stats.reduce((acc, val) => {
      // first entry of this is already in val. but we'll just add
      // it again anyways.
      const LeaderHistory = JSON.parse(val.LeaderHistory).reverse();

      const uniqLeaderHistory = uniqBy(LeaderHistory, 'KuskiIndex');

      uniqLeaderHistory.forEach((time, index) => {
        if (time.BattleIndex !== null && time.BattleIndex > 0) {
          return;
        }

        if (time.Driven >= start && time.Driven < end) {
          const leaderEntry = {
            ...val,
            LeaderHistory: null,
            CurrentStanding: index + 1,
            Time: time.Time,
            Driven: time.Driven,
            KuskiIndex: time.KuskiIndex,
            // included for clarity (or does it just make it more confusing
            // because why is it there if its always null?, idk).
            BattleIndex: time.BattleIndex,
          };

          acc.push(leaderEntry);
        }
      });

      return acc;
    }, []);

    // re-order and limit
    records = orderBy(records, ['TimeAll'], ['desc']).slice(0, limit);
  }

  const kuskis = await Kuski.findAll({
    attributes: ['KuskiIndex', 'Kuski', 'Country'],
    where: {
      KuskiIndex: records.map(r => r.KuskiIndex),
    },
    include: [
      {
        attributes: ['TeamIndex', 'Team'],
        model: Team,
        as: 'TeamData',
      },
    ],
  });

  // eslint-disable-next-line no-underscore-dangle
  const _kuskis = groupBy(kuskis, 'KuskiIndex');

  const levels = await Level.findAll({
    attributes: ['LevelIndex', 'LevelName', 'LongName'],
    where: {
      LevelIndex: records.map(r => r.LevelIndex),
    },
  });

  // eslint-disable-next-line no-underscore-dangle
  const _levels = groupBy(levels, 'LevelIndex');

  records = records.map(r => {
    return {
      ...r,
      LeaderHistory: undefined,
      KuskiData: _kuskis[r.KuskiIndex] ? _kuskis[r.KuskiIndex][0] : null,
      LevelData: _levels[r.LevelIndex] ? _levels[r.LevelIndex][0] : null,
    };
  });

  return {
    start,
    end,
    count: records.length,
    items: records,
  };
};

router
  // Warning: pass in end = 0 unless you know what you are doing.
  .get('/best-records/:start/:end/:limit/:repeatLevels', async (req, res) => {
    // ie. top 20 records in the last 24 hours:
    // /best-records/0/0/20/1?daysPast=1
    const daysPast = +req.query.daysPast || 7;

    const end = +req.params.end || Math.floor(Date.now() / 1000);
    const start = +req.params.start || end - daysPast * 86400;

    const result = await getBestRecordsDrivenRecently(
      start,
      end,
      +req.params.limit || undefined,
      req.params.repeatLevels === '1',
    );
    res.json(result.items);
  })
  .get('/multi/:LevelIndex/:limit', async (req, res) => {
    const data = await getMultiTimes(req.params.LevelIndex, req.params.limit);
    res.json(data);
  })
  .get('/:LevelIndex/:limit', async (req, res) => {
    const data = await getTimes(req.params.LevelIndex, req.params.limit);
    res.json(data);
  })
  .get('/latest/:KuskiIndex/:limit', async (req, res) => {
    const auth = authContext(req);
    const data = await getLatest(
      req.params.KuskiIndex,
      req.params.limit,
      req.query.level,
      req.query.from,
      req.query.to,
      auth.userid,
    );
    res.json(data);
  })
  .get('/:LevelIndex/:limit/:eolOnly', async (req, res) => {
    const data = await getTimes(
      req.params.LevelIndex,
      req.params.limit,
      parseInt(req.params.eolOnly, 10),
    );
    res.json(data);
  })
  .get(
    '/:LevelIndex/:limit/:eolOnly/:filter/:filterValue',
    async (req, res) => {
      const data = await getTimes(
        req.params.LevelIndex,
        req.params.limit,
        parseInt(req.params.eolOnly, 10),
        req.params.filter === 'country' ? req.params.filterValue : null,
        req.params.filter === 'team' ? req.params.filterValue : null,
      );
      res.json(data);
    },
  );

export default router;
