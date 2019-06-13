import { forEach } from 'lodash';
import moment from 'moment';
import { Op } from 'sequelize';
import { eachSeries } from 'neo-async';
import { Battle, Kinglist, KinglistYearly, Battletime } from './data/models';

const getCurrentRankings = async () => {
  const rankingData = await Kinglist.findAll();
  const rankingDataYearly = await KinglistYearly.findAll();
  return { all: rankingData, year: rankingDataYearly };
};

let Results = [];

const getBattleResults = async (battleId, done) => {
  const data = await Battletime.findAll({
    where: { BattleIndex: battleId.dataValues.BattleIndex },
    order: [['BattleTimeIndex', 'ASC']],
  });
  Results.push({ battle: battleId.dataValues, result: data });
  done();
};

const getBattles = async last => {
  const data = await Battle.findAll({
    attributes: [
      'BattleIndex',
      'KuskiIndex',
      'LevelIndex',
      'BattleType',
      'NoVolt',
      'NoTurn',
      'OneTurn',
      'NoBrake',
      'NoThrottle',
      'AlwaysThrottle',
      'Drunk',
      'OneWheel',
      'Multi',
      'Started',
      'Duration',
      'Aborted',
      'Finished',
      'InQueue',
    ],
    where: { BattleIndex: { [Op.gt]: last } },
    limit: 100,
  });
  return data;
};

const getBattleType = battle => battle.BattleType;

const addRanking = (current, type, results, place, kuski, designer, period) => {
  let newRanking = {};
  if (period) {
    newRanking = current[`${kuski}-${period}`];
  } else {
    newRanking = current[kuski];
  }
  newRanking.KuskiIndex = kuski;

  const Designed = `Designed${type}`; // battles designed
  if (kuski === designer) {
    if (!newRanking[Designed]) {
      newRanking[Designed] = 1;
    } else {
      newRanking[Designed] += 1;
    }
  }

  const Played = `Played${type}`; // battles played
  if (!newRanking[Played]) {
    newRanking[Played] = 1;
  } else {
    newRanking[Played] += 1;
  }

  const Points = `Points${type}`; // battle experience points
  if (!newRanking[Points]) {
    newRanking[Points] = results.length - place;
  } else {
    newRanking[Points] += results.length - place;
  }

  const Ranking = `Ranking${type}`; // battle ranking
  if (!newRanking[Ranking]) {
    newRanking[Ranking] = 1000;
  }
  let updatedRanking = newRanking[Ranking];
  let beated = false;
  const kk = 0.003;
  const qk = 0.001;
  forEach(results, r => {
    if (r.KuskiIndex === kuski) {
      beated = true;
    } else {
      let opponentRanking = 1000;
      if (current[r.KuskiIndex]) {
        if (current[r.KuskiIndex][Ranking]) {
          opponentRanking = current[r.KuskiIndex][Ranking];
        }
      }
      if (beated) {
        updatedRanking *=
          1 + kk * Math.exp(qk * (opponentRanking - newRanking[Ranking]));
      } else {
        updatedRanking /=
          1 + kk * Math.exp(qk * (newRanking[Ranking] - opponentRanking));
      }
    }
  });
  newRanking[Ranking] = updatedRanking;

  // if won battle
  const Row = `Row${type}`;
  if (place === 0) {
    const Wins = `Wins${type}`; // battle wins
    if (!newRanking[Wins]) {
      newRanking[Wins] = 1;
    } else {
      newRanking[Wins] += 1;
    }
    newRanking[Points] += 1; // battle experience points
    // battle win row
    if ((type === 'NM' || type === 'All') && !period) {
      const BestRow = `BestRow${type}`;
      if (!newRanking[Row]) {
        newRanking[Row] = 1;
      } else {
        newRanking[Row] += 1;
      }
      // update best battle win row
      if (!newRanking[BestRow]) {
        newRanking[BestRow] = 0;
      }
      if (newRanking[Row] > newRanking[BestRow]) {
        newRanking[BestRow] = newRanking[Row];
      }
    }
  } else if ((type === 'NM' || type === 'All') && !period) {
    // if not won battle
    newRanking[Row] = 0; // battle win row
  }
  return newRanking;
};

export function calcRankings(getBattleList, battleResults, current) {
  return new Promise(resolve => {
    const newRankings = { all: {}, year: {} };
    // get battle results for selected battles
    eachSeries(getBattleList, battleResults, () => {
      // loop battles
      forEach(Results, result => {
        if (result.result.length > 0) {
          // loop results
          forEach(result.result, (r, place) => {
            /* if (!has(newRankings.all, r.KuskiIndex)) {
              newRankings.all[r.KuskiIndex] = {};
            } */
            // add ranking for battle type
            newRankings.all[r.KuskiIndex] = addRanking(
              current.all,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
            );
            // add ranking for combined
            newRankings.all[r.KuskiIndex] = addRanking(
              current.all,
              'All',
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
            );
            // add ranking for year battle type
            newRankings.year[
              `${r.KuskiIndex}-${moment(result.battle.Started).format('YYYY')}`
            ] = addRanking(
              current.year,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              moment(result.battle.Started).format('YYYY'),
            );
          });
        }
      });
      resolve(newRankings);
    });
  });
}

const updateOrCreateKinglist = async (data, done) => {
  const obj = await Kinglist.findOne({
    where: { KuskiIndex: data.KuskiIndex },
  });
  if (obj) {
    await obj.update(data);
    done();
  } else {
    await Kinglist.create(data);
    done();
  }
};

const updateOrCreateKinglistYearly = async (data, done) => {
  const obj = await KinglistYearly.findOne({
    where: { KuskiIndex: data.KuskiIndex, Year: data.Year },
  });
  if (obj) {
    await obj.update(data);
    done();
  } else {
    await KinglistYearly.create(data);
    done();
  }
};

export function updateKinglist(newRankings) {
  return new Promise(resolve => {
    eachSeries(newRankings.all, updateOrCreateKinglist, () => {
      eachSeries(newRankings.year, updateOrCreateKinglistYearly, () => {
        resolve();
      });
    });
  });
}

export const updateRanking = async () => {
  const current = { all: {}, year: {} };
  const battle = 0;
  const getCurrent = await getCurrentRankings();
  forEach(getCurrent.all, c => {
    current.all[c.dataValues.KuskiIndex] = c.dataValues;
  });
  forEach(getCurrent.year, c => {
    current.year[`${c.dataValues.KuskiIndex}-${c.dataValues.Year}`] =
      c.dataValues;
  });
  const getBattleList = await getBattles(battle);
  Results = [];
  const newRankings = await calcRankings(
    getBattleList,
    getBattleResults,
    current,
  );
  await updateKinglist(newRankings);
  return newRankings;
};
