import express from 'express';
import { authContext } from '#utils/auth';
import { Recap, RankingYearly, Kuski, Battle, Replay } from '#data/models';
import { types } from '#utils/recap';
import { Op } from 'sequelize';

const router = express.Router();

const kuskiRecap = async (Year, KuskiIndex) => {
  const data = await Recap.findAll({
    where: { Year, KuskiIndex },
  });
  return data;
};

const kuskiRecapAll = async KuskiIndex => {
  const data = await Recap.findAll({
    attributes: ['Year', 'Type', 'Value'],
    where: { KuskiIndex },
  });
  return data;
};

const kuskiRanking = async (Year, KuskiIndex) => {
  const ranking = await RankingYearly.findOne({ where: { KuskiIndex, Year } });
  if (ranking) {
    return {
      Year: ranking.Year,
      Wins: ranking.WinsAll,
      Played: ranking.PlayedAll,
      Played5: ranking.Played5All,
      KuskiIndex,
    };
  }
  return null;
};

const kuskiRankingAll = async KuskiIndex => {
  const ranking = await RankingYearly.findAll({ where: { KuskiIndex } });
  if (ranking) {
    return {
      Wins: ranking.WinsAll,
      Played: ranking.PlayedAll,
      Played5: ranking.Played5All,
      KuskiIndex,
    };
  }
  return null;
};

const overAllRecap = async Year => {
  const data = await Recap.findAll({
    where: { Year, KuskiIndex: 0 },
    include: [
      {
        model: Battle,
        as: 'BattleData',
        attributes: ['RecFileName', 'BattleIndex'],
      },
      { model: Replay, as: 'ReplayData', attributes: ['RecFileName', 'UUID'] },
    ],
  });
  return data;
};

const overAllRecapAll = async () => {
  const data = await Recap.findAll({
    attributes: ['Year', 'Type', 'Value', 'OtherIndex'],
    where: { KuskiIndex: 0, Year: { [Op.ne]: 2010 } },
    include: [
      {
        model: Battle,
        as: 'BattleData',
        attributes: ['RecFileName', 'BattleIndex'],
      },
      { model: Replay, as: 'ReplayData', attributes: ['RecFileName', 'UUID'] },
    ],
  });
  return data;
};

const overallRanking = async Year => {
  const data = await RankingYearly.findAll({
    where: { Year },
    include: [{ model: Kuski, as: 'KuskiData' }],
  });
  return data.map(d => ({
    Year: d.Year,
    Wins: d.WinsAll,
    Played: d.PlayedAll,
    Ratio: ((d.WinsAll * 100) / d.Played5All).toFixed(2),
    KuskiIndex: d.KuskiIndex,
    KuskiData: d.KuskiData,
    Designed: d.DesignedAll,
    Ranking: parseFloat(d.RankingAll).toFixed(2),
  }));
};

const overallRankingAll = async () => {
  const data = await RankingYearly.findAll({
    include: [{ model: Kuski, as: 'KuskiData' }],
  });
  return data.map(d => ({
    Year: d.Year,
    Wins: d.WinsAll,
    Played: d.PlayedAll,
    Ratio: ((d.WinsAll * 100) / d.Played5All).toFixed(2),
    KuskiIndex: d.KuskiIndex,
    KuskiData: d.KuskiData,
    Designed: d.DesignedAll,
    Ranking: parseFloat(d.RankingAll).toFixed(2),
  }));
};

const getTop = async (Year, Type) => {
  const data = await Recap.findAll({
    where: { Year, Type },
    include: [{ model: Kuski, as: 'KuskiData' }],
  });
  return data
    .filter(f => f.KuskiIndex)
    .sort((a, b) => b.Value - a.Value)
    .slice(0, 10);
};

router
  .get('/alltime', async (req, res) => {
    const data = await overAllRecapAll(parseInt(req.params.year));
    const ranking = await overallRankingAll(parseInt(req.params.year));
    res.json({ data, ranking, types });
  })
  .get('/:year', async (req, res) => {
    const data = await overAllRecap(parseInt(req.params.year));
    const ranking = await overallRanking(parseInt(req.params.year));
    res.json({ data, types, ranking });
  })
  .get('/bestof/:year', async (req, res) => {
    const year = parseInt(req.params.year);
    const FinishedRuns = await getTop(year, 12);
    const LevelsPlayed = await getTop(year, 16);
    const ChatLines = await getTop(year, 48);
    const UniqueLevelNames = await getTop(year, 54);
    const FF = await getTop(year, 60);
    const OL = await getTop(year, 61);
    const Ap = await getTop(year, 66);
    const Players = await getTop(year, 72);
    res.json({
      FinishedRuns,
      LevelsPlayed,
      ChatLines,
      UniqueLevelNames,
      Players,
      FF,
      OL,
      Ap,
    });
  })
  .get('/alltime/:kuski', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth && auth.userid === parseInt(req.params.kuski)) {
      const data = await kuskiRecapAll(parseInt(req.params.kuski));
      const ranking = await kuskiRankingAll(parseInt(req.params.kuski));
      res.json({ data, ranking, types });
    } else {
      res.sendStatus(401);
    }
  })
  .get('/:year/:kuski', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth && auth.userid === parseInt(req.params.kuski)) {
      const data = await kuskiRecap(
        parseInt(req.params.year),
        parseInt(req.params.kuski),
      );
      const ranking = await kuskiRanking(
        parseInt(req.params.year),
        parseInt(req.params.kuski),
      );
      res.json({ data, types, ranking });
    } else {
      res.sendStatus(401);
    }
  });

export default router;
