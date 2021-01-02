import express from 'express';
import {
  Ranking,
  Kuski,
  RankingYearly,
  RankingMonthly,
  RankingWeekly,
  RankingDaily,
  Team,
  RankingHistory,
} from '../data/models';

const router = express.Router();

const getPersonalRanking = async KuskiIndex => {
  const ranking = await Ranking.findAll({
    where: { KuskiIndex },
  });
  return ranking;
};

const getRanking = async (periodType, period) => {
  const query = {
    include: [
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'KuskiData',
        include: [
          {
            model: Team,
            as: 'TeamData',
          },
        ],
      },
    ],
  };
  let data = [];
  if (periodType === 'overall') {
    data = await Ranking.findAll(query);
  }
  if (periodType === 'year') {
    query.where = { Year: period };
    data = await RankingYearly.findAll(query);
  }
  if (periodType === 'month') {
    query.where = { Month: period };
    data = await RankingMonthly.findAll(query);
  }
  if (periodType === 'week') {
    query.where = { Week: period };
    data = await RankingWeekly.findAll(query);
  }
  if (periodType === 'day') {
    query.where = { Day: period };
    data = await RankingDaily.findAll(query);
  }
  return data;
};

const getRankingHistoryByBattle = async BattleIndex => {
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
    const data = await getRanking(req.params.periodType, req.params.period);
    res.json(data);
  });

export default router;
