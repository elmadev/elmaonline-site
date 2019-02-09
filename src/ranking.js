import { forEach, has } from 'lodash';
import { Op } from 'sequelize';
import { eachSeries } from 'neo-async';
import { Battle, Kinglist, Battletime } from './data/models';

const getCurrentRankings = async () => {
  const rankingData = await Kinglist.findAll();
  return rankingData;
};

const Results = [];

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
    where: { BattleIndex: { [Op.gt]: last } },
    limit: 100,
  });
  return data;
};

const getBattleType = battle => battle.BattleType;

const addRanking = (current, type, participants, place) => {
  const newRanking = current;

  const Played = `Played${type}`; // battles played
  if (!newRanking[Played]) {
    newRanking[Played] = 1;
  } else {
    newRanking[Played] += 1;
  }

  const Points = `Points${type}`; // battle experience points
  if (!newRanking[Points]) {
    newRanking[Points] = participants - place;
  } else {
    newRanking[Points] += participants - place;
  }

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
    if (type === 'NM' || type === 'All') {
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
  } else if (type === 'NM' || type === 'All') {
    // if not won battle
    newRanking[Row] = 0; // battle win row
  }
  return newRanking;
};

export function calcRankings(getBattleList, battleResults, current) {
  return new Promise(resolve => {
    const newRankings = current;
    // get battle results for selected battles
    eachSeries(getBattleList, battleResults, () => {
      // loop battles
      forEach(Results, result => {
        if (result.result.length > 0) {
          // loop results
          forEach(result.result, (r, place) => {
            if (!has(newRankings, r.KuskiIndex)) {
              newRankings[r.KuskiIndex] = {};
            }
            // add ranking for battle type
            newRankings[r.KuskiIndex] = addRanking(
              newRankings[r.KuskiIndex],
              getBattleType(result.battle),
              result.result.length,
              place,
            );
            // add ranking for combined
            newRankings[r.KuskiIndex] = addRanking(
              newRankings[r.KuskiIndex],
              'All',
              result.result.length,
              place,
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

export function updateKinglist(newRankings) {
  return new Promise(resolve => {
    eachSeries(newRankings, updateOrCreateKinglist, () => {
      resolve();
    });
  });
}

export const updateRanking = async () => {
  const current = {};
  const battle = 0;
  const getCurrent = await getCurrentRankings();
  forEach(getCurrent, c => {
    current[c.dataValues.KuskiIndex] = c.dataValues;
  });
  const getBattleList = await getBattles(battle);
  const newRankings = await calcRankings(
    getBattleList,
    getBattleResults,
    current,
  );
  await updateKinglist(newRankings);
  return newRankings;
};
