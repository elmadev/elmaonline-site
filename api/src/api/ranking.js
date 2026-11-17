import express from 'express';
import { getKuskiData } from '#utils/kuskiData';
import {
  Ranking,
  RankingYearly,
  RankingMonthly,
  RankingWeekly,
  RankingDaily,
  RankingHistory,
} from '#data/models';

const router = express.Router();

const getPersonalRanking = async KuskiIndex => {
  const ranking = await Ranking.findAll({
    where: { KuskiIndex },
  });
  return ranking;
};

const rankingTables = {
  overall: [Ranking, null],
  year: [RankingYearly, 'Year'],
  month: [RankingMonthly, 'Month'],
  week: [RankingWeekly, 'Week'],
  day: [RankingDaily, 'Day'],
};

// raw rows instead of model instances to lower memory usage
const getRanking = async (periodType, period) => {
  if (!Object.hasOwn(rankingTables, periodType)) {
    return [];
  }
  const [Model, periodColumn] = rankingTables[periodType];
  const rows = await Model.findAll({
    where: periodColumn ? { [periodColumn]: period } : {},
    raw: true,
  });
  const kuskiData = await getKuskiData(rows.map(r => r.KuskiIndex));
  for (const row of rows) {
    row.KuskiData = kuskiData.get(row.KuskiIndex) ?? null;
  }
  return rows;
};

// memory cache for /:periodType/:period
const rankingTtl = 10 * 60 * 1000;
const rankingMax = 20;
const rankingCache = new Map();

export const clearRankingCache = () => {
  rankingCache.clear();
};

const cachedRankingJson = (periodType, period) => {
  const key = `${periodType}|${period}`;
  const cached = rankingCache.get(key);
  if (cached && Date.now() - cached.time < rankingTtl) {
    return cached.promise;
  }
  const promise = getRanking(periodType, period).then(data =>
    JSON.stringify(data),
  );
  rankingCache.delete(key);
  rankingCache.set(key, { time: Date.now(), promise });
  promise.catch(() => {
    if (rankingCache.get(key)?.promise === promise) {
      rankingCache.delete(key);
    }
  });
  if (rankingCache.size > rankingMax) {
    rankingCache.delete(rankingCache.keys().next().value);
  }
  return promise;
};

const getRankingHistoryByBattle = async BattleIndex => {
  if (Number.isNaN(parseInt(BattleIndex, 10))) {
    return null;
  }
  const RankingHistoryByBattle = await RankingHistory.findAll({
    where: { BattleIndex },
  });
  return RankingHistoryByBattle;
};

router
  .get('/kuski/:KuskiIndex', async (req, res) => {
    const data = await getPersonalRanking(req.params.KuskiIndex);
    res.json(data);
  })
  .get('/battle/:BattleIndex', async (req, res) => {
    const data = await getRankingHistoryByBattle(req.params.BattleIndex);
    res.json(data);
  })
  .get('/:periodType/:period', async (req, res) => {
    if (!Object.hasOwn(rankingTables, req.params.periodType)) {
      res.json([]);
      return;
    }
    const json = await cachedRankingJson(
      req.params.periodType,
      req.params.period,
    );
    res.type('json').send(json);
  });

export default router;
