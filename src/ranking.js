import { forEach, cloneDeep } from 'lodash';
import moment from 'moment';
import { Op } from 'sequelize';
import { eachSeries } from 'neo-async';
import { BATTLETYPES, INTERNALS } from './constants/ranking';
import {
  Battle,
  Kinglist,
  KinglistYearly,
  KinglistMonthly,
  KinglistWeekly,
  KinglistDaily,
  RankingHistory,
  Battletime,
} from './data/models';
import { getBattleType } from './utils/battle';

const getCurrentRankings = async () => {
  const rankingData = await Kinglist.findAll();
  const rankingDataYearly = await KinglistYearly.findAll();
  const rankingDataMonthly = await KinglistMonthly.findAll();
  const rankingDataWeekly = await KinglistWeekly.findAll();
  const rankingDataDaily = await KinglistDaily.findAll();
  return {
    all: rankingData,
    year: rankingDataYearly,
    month: rankingDataMonthly,
    week: rankingDataWeekly,
    day: rankingDataDaily,
  };
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

const getBattles = async (fromId, limit) => {
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
    where: { BattleIndex: { [Op.gt]: parseInt(fromId, 10) } },
    limit: parseInt(limit, 10),
  });
  return data;
};

const skippedBattles = battle => {
  if (battle.BattleType === 'HT') {
    return true;
  }
  if (battle.Multi) {
    return true;
  }
  if (INTERNALS.indexOf(battle.LevelIndex) > -1) {
    return true;
  }
  return false;
};

const ranking = (currentRanking, results, kuski, current, Ranking) => {
  let updatedRanking = parseFloat(currentRanking);
  let beated = false;
  const kValue = 1;
  const bValue = 800;
  forEach(results, r => {
    if (r.KuskiIndex === kuski) {
      beated = true;
    } else {
      let opponentRanking = 1000;
      if (current[r.KuskiIndex]) {
        if (current[r.KuskiIndex][Ranking]) {
          opponentRanking = parseFloat(current[r.KuskiIndex][Ranking]);
        }
      }
      if (beated) {
        const expectedResult =
          1 / (1 + 10 ** ((opponentRanking - currentRanking) / bValue));
        updatedRanking += kValue * (1 - expectedResult);
      } else {
        const expectedResult =
          1 / (1 + 10 ** ((opponentRanking - currentRanking) / bValue));
        updatedRanking += kValue * (0 - expectedResult);
      }
    }
  });
  return updatedRanking;
};

const newRankingRow = (kuski, periodType, period) => {
  const obj = { KuskiIndex: kuski };
  if (periodType === 'year') {
    obj.Year = moment(period).format('YYYY');
  }
  if (periodType === 'month') {
    obj.Month = moment(period).format('YYYYMM');
  }
  if (periodType === 'week') {
    obj.Week = moment(period).format('YYYYww');
  }
  if (periodType === 'day') {
    obj.Day = moment(period).format('YYYYMMDD');
  }
  return obj;
};

const addRanking = (
  current,
  type,
  results,
  place,
  kuski,
  designer,
  period,
  periodType,
) => {
  let newRanking = {};
  if (period) {
    if (current[`${kuski}-${period}`]) {
      newRanking = cloneDeep(current[`${kuski}-${period}`]);
    }
    if (periodType === 'year' && !newRanking.Year) {
      newRanking.Year = period;
    }
    if (periodType === 'month' && !newRanking.Month) {
      newRanking.Month = period;
    }
    if (periodType === 'week' && !newRanking.Week) {
      newRanking.Week = period;
    }
    if (periodType === 'day' && !newRanking.Day) {
      newRanking.Day = period;
    }
  } else if (current[kuski]) {
    newRanking = cloneDeep(current[kuski]);
  }
  newRanking.KuskiIndex = kuski;

  if (BATTLETYPES[periodType].indexOf(type) > -1) {
    const Played = `Played${type}`; // battles played
    if (!newRanking[Played]) {
      newRanking[Played] = 1;
    } else {
      newRanking[Played] += 1;
    }
  }
  if (!newRanking.PlayedAll) {
    newRanking.PlayedAll = 1;
  } else {
    newRanking.PlayedAll += 1;
  }

  const Points = `Points${type}`; // battle experience points
  if (BATTLETYPES[periodType].indexOf(type) > -1) {
    if (!newRanking[Points]) {
      newRanking[Points] = results.length - place;
    } else {
      newRanking[Points] += results.length - place;
    }
  }
  if (!newRanking.PointsAll) {
    newRanking.PointsAll = results.length - place;
  } else {
    newRanking.PointsAll += results.length - place;
  }

  if (BATTLETYPES[periodType].indexOf(type) > -1) {
    const Ranking = `Ranking${type}`; // battle ranking
    if (!newRanking[Ranking]) {
      newRanking[Ranking] = 1000;
    }
    newRanking[Ranking] = ranking(
      newRanking[Ranking],
      results,
      kuski,
      current,
      Ranking,
    );
  }
  if (!newRanking.RankingAll) {
    newRanking.RankingAll = 1000;
  }
  newRanking.RankingAll = ranking(
    newRanking.RankingAll,
    results,
    kuski,
    current,
    'RankingAll',
  );

  // if won battle
  const Row = `Row${type}`;
  if (place === 0 && results.length >= 5) {
    if (BATTLETYPES[periodType].indexOf(type) > -1) {
      const Wins = `Wins${type}`; // battle wins
      if (!newRanking[Wins]) {
        newRanking[Wins] = 1;
      } else {
        newRanking[Wins] += 1;
      }
    }
    if (!newRanking.WinsAll) {
      newRanking.WinsAll = 1;
    } else {
      newRanking.WinsAll += 1;
    }
    if (BATTLETYPES[periodType].indexOf(type) > -1) {
      newRanking[Points] += 1; // battle experience points
    }
    newRanking.PointsAll += 1;
    // battle win row
    if (
      type === 'NM' &&
      !period &&
      BATTLETYPES[periodType].indexOf(type) > -1
    ) {
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
    if (!period) {
      if (!newRanking.RowAll) {
        newRanking.RowAll = 1;
      } else {
        newRanking.RowAll += 1;
      }
      // update best battle win row
      if (!newRanking.BestRowAll) {
        newRanking.BestRowAll = 0;
      }
      if (newRanking.RowAll > newRanking.BestRowAll) {
        newRanking.BestRowAll = newRanking.RowAll;
      }
    }
  } else if (results.length >= 5) {
    if (
      type === 'NM' &&
      !period &&
      BATTLETYPES[periodType].indexOf(type) > -1
    ) {
      // if not won battle
      newRanking[Row] = 0; // battle win row
    }
    if (!period) {
      newRanking.RowAll = 0;
    }
  }
  return newRanking;
};

export function calcRankings(getBattleList, battleResults, current) {
  return new Promise(resolve => {
    const newRankings = { all: {}, year: {}, month: {}, week: {}, day: {} };
    const history = [];
    let updatedCurrent = cloneDeep(current);
    // get battle results for selected battles
    eachSeries(getBattleList, battleResults, () => {
      // loop battles
      forEach(Results, result => {
        // skip 1htt, multi and ints
        if (skippedBattles(result.battle)) {
          return;
        }
        if (result.result.length > 0) {
          // loop results
          forEach(result.result, (r, place) => {
            // skip designer
            if (r.KuskiIndex === result.battle.KuskiIndex) {
              return;
            }
            // add ranking for all time
            newRankings.all[r.KuskiIndex] = addRanking(
              updatedCurrent.all,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              '',
              'all',
            );
            const RankingBattleType = getBattleType(result.battle);
            let previousRanking = 1000;
            if (current.all[r.KuskiIndex]) {
              if (current.all[r.KuskiIndex][`Ranking${RankingBattleType}`]) {
                previousRanking =
                  current.all[r.KuskiIndex][`Ranking${RankingBattleType}`];
              }
            }
            history.push({
              KuskiIndex: r.KuskiIndex,
              BattleIndex: result.battle.BattleIndex,
              BattleType: RankingBattleType,
              Played:
                newRankings.all[r.KuskiIndex][`Played${RankingBattleType}`],
              Ranking:
                newRankings.all[r.KuskiIndex][`Ranking${RankingBattleType}`],
              Increase:
                newRankings.all[r.KuskiIndex][`Ranking${RankingBattleType}`] -
                previousRanking,
              Points:
                newRankings.all[r.KuskiIndex][`Points${RankingBattleType}`],
              Wins: newRankings.all[r.KuskiIndex][`Wins${RankingBattleType}`],
              Designed:
                newRankings.all[r.KuskiIndex][`Designed${RankingBattleType}`],
              Position: place + 1,
              Started: moment(result.battle.Started).format('X'),
            });
            previousRanking = 1000;
            if (current.all[r.KuskiIndex]) {
              if (current.all[r.KuskiIndex].RankingAll) {
                previousRanking = current.all[r.KuskiIndex].RankingAll;
              }
            }
            history.push({
              KuskiIndex: r.KuskiIndex,
              BattleIndex: result.battle.BattleIndex,
              BattleType: 'All',
              Played: newRankings.all[r.KuskiIndex].PlayedAll,
              Ranking: newRankings.all[r.KuskiIndex].RankingAll,
              Increase:
                newRankings.all[r.KuskiIndex].RankingAll - previousRanking,
              Points: newRankings.all[r.KuskiIndex].PointsAll,
              Wins: newRankings.all[r.KuskiIndex].WinsAll,
              Designed: newRankings.all[r.KuskiIndex].DesignedAll,
              Position: place + 1,
              Started: moment(result.battle.Started).format('X'),
            });
            // add ranking for year
            newRankings.year[
              `${r.KuskiIndex}-${moment(result.battle.Started).format('YYYY')}`
            ] = addRanking(
              updatedCurrent.year,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              moment(result.battle.Started).format('YYYY'),
              'year',
            );
            // add ranking for month
            newRankings.month[
              `${r.KuskiIndex}-${moment(result.battle.Started).format(
                'YYYYMM',
              )}`
            ] = addRanking(
              updatedCurrent.month,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              moment(result.battle.Started).format('YYYYMM'),
              'month',
            );
            // add ranking for week
            newRankings.week[
              `${r.KuskiIndex}-${moment(result.battle.Started).format(
                'YYYYww',
              )}`
            ] = addRanking(
              updatedCurrent.week,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              moment(result.battle.Started).format('YYYYww'),
              'week',
            );
            // add ranking for day
            newRankings.day[
              `${r.KuskiIndex}-${moment(result.battle.Started).format(
                'YYYYMMDD',
              )}`
            ] = addRanking(
              updatedCurrent.day,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              moment(result.battle.Started).format('YYYYMMDD'),
              'day',
            );
          });
          const Designed = `Designed${getBattleType(result.battle)}`; // battles designed
          forEach(newRankings, (nR, periodType) => {
            if (
              BATTLETYPES[periodType].indexOf(getBattleType(result.battle)) > -1
            ) {
              if (!newRankings[periodType][result.battle.KuskiIndex]) {
                newRankings[periodType][
                  result.battle.KuskiIndex
                ] = newRankingRow(
                  result.battle.KuskiIndex,
                  periodType,
                  result.battle.Started,
                );
              }
              if (
                !newRankings[periodType][result.battle.KuskiIndex][Designed]
              ) {
                newRankings[periodType][result.battle.KuskiIndex][Designed] = 1;
              } else {
                newRankings[periodType][result.battle.KuskiIndex][
                  Designed
                ] += 1;
              }
            }
            if (!newRankings[periodType][result.battle.KuskiIndex]) {
              newRankings[periodType][result.battle.KuskiIndex] = newRankingRow(
                result.battle.KuskiIndex,
                periodType,
                result.battle.Started,
              );
            }
            if (
              !newRankings[periodType][result.battle.KuskiIndex].DesignedAll
            ) {
              newRankings[periodType][result.battle.KuskiIndex].DesignedAll = 1;
            } else {
              newRankings[periodType][
                result.battle.KuskiIndex
              ].DesignedAll += 1;
            }
          });
          updatedCurrent = cloneDeep(newRankings);
        }
      });
      resolve({ newRankings, history });
    });
  });
}

const updateOrCreateKinglist = async (data, done) => {
  let obj = false;
  if (data.KuskiIndex) {
    obj = await Kinglist.findOne({
      where: { KuskiIndex: data.KuskiIndex },
    });
  }
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

const updateOrCreateKinglistMonthly = async (data, done) => {
  const obj = await KinglistMonthly.findOne({
    where: { KuskiIndex: data.KuskiIndex, Month: data.Month },
  });
  if (obj) {
    await obj.update(data);
    done();
  } else {
    await KinglistMonthly.create(data);
    done();
  }
};

const updateOrCreateKinglistWeekly = async (data, done) => {
  const obj = await KinglistWeekly.findOne({
    where: { KuskiIndex: data.KuskiIndex, Week: data.Week },
  });
  if (obj) {
    await obj.update(data);
    done();
  } else {
    await KinglistWeekly.create(data);
    done();
  }
};

const updateOrCreateKinglistDaily = async (data, done) => {
  const obj = await KinglistDaily.findOne({
    where: { KuskiIndex: data.KuskiIndex, Day: data.Day },
  });
  if (obj) {
    await obj.update(data);
    done();
  } else {
    await KinglistDaily.create(data);
    done();
  }
};

export function insertHistory(history) {
  return new Promise(resolve => {
    RankingHistory.bulkCreate(history).then(() => {
      resolve();
    });
  });
}

export function updateKinglist(newRankings) {
  return new Promise(resolve => {
    eachSeries(newRankings.all, updateOrCreateKinglist, () => {
      eachSeries(newRankings.year, updateOrCreateKinglistYearly, () => {
        eachSeries(newRankings.month, updateOrCreateKinglistMonthly, () => {
          eachSeries(newRankings.week, updateOrCreateKinglistWeekly, () => {
            eachSeries(newRankings.day, updateOrCreateKinglistDaily, () => {
              resolve();
            });
          });
        });
      });
    });
  });
}

export const deleteRanking = async () => {
  await Kinglist.destroy({
    where: {
      KuskiIndex: { [Op.gt]: 0 },
    },
  });
  await KinglistYearly.destroy({
    where: {
      KuskiIndex: { [Op.gt]: 0 },
    },
  });
  await KinglistMonthly.destroy({
    where: {
      KuskiIndex: { [Op.gt]: 0 },
    },
  });
  await KinglistWeekly.destroy({
    where: {
      KuskiIndex: { [Op.gt]: 0 },
    },
  });
  await KinglistDaily.destroy({
    where: {
      KuskiIndex: { [Op.gt]: 0 },
    },
  });
  await RankingHistory.destroy({
    where: {
      KuskiIndex: { [Op.gt]: 0 },
    },
  });
  return true;
};

export const updateRanking = async limit => {
  const current = { all: {}, year: {}, month: {}, week: {}, day: {} };
  const getCurrent = await getCurrentRankings();
  forEach(getCurrent.all, c => {
    current.all[c.dataValues.KuskiIndex] = c.dataValues;
  });
  forEach(getCurrent.year, c => {
    current.year[`${c.dataValues.KuskiIndex}-${c.dataValues.Year}`] =
      c.dataValues;
  });
  forEach(getCurrent.month, c => {
    current.month[`${c.dataValues.KuskiIndex}-${c.dataValues.Month}`] =
      c.dataValues;
  });
  forEach(getCurrent.week, c => {
    current.week[`${c.dataValues.KuskiIndex}-${c.dataValues.Week}`] =
      c.dataValues;
  });
  forEach(getCurrent.day, c => {
    current.day[`${c.dataValues.KuskiIndex}-${c.dataValues.Day}`] =
      c.dataValues;
  });
  const max = await RankingHistory.max('BattleIndex');
  const getBattleList = await getBattles(max, limit);
  Results = [];
  const { newRankings, history } = await calcRankings(
    getBattleList,
    getBattleResults,
    current,
  );
  await updateKinglist(newRankings);
  await insertHistory(history);
  return history;
};
