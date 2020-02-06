import { forEach, cloneDeep, has } from 'lodash';
import moment from 'moment';
import { Op } from 'sequelize';
import { eachSeries } from 'neo-async';
import { BATTLETYPES, INTERNALS } from './constants/ranking';
import {
  Battle,
  Ranking,
  RankingYearly,
  RankingMonthly,
  RankingWeekly,
  RankingDaily,
  RankingHistory,
  Battletime,
} from './data/models';
import { getBattleType } from './utils/battle';

const getCurrentRankings = async () => {
  const rankingData = await Ranking.findAll();
  return {
    all: rankingData,
  };
};

let Results = [];
let CurrRank = { all: {}, year: {}, month: {}, week: {}, day: {} };
let insertBulk = { all: [], year: [], month: [], week: [], day: [] };

const getBattleResults = async (battleId, done) => {
  const data = await Battletime.findAll({
    where: { BattleIndex: battleId.dataValues.BattleIndex },
    order: [['BattleTimeIndex', 'ASC']],
  });
  Results.push({ battle: battleId.dataValues, result: data });
  const Year = moment(battleId.dataValues.Started).format('YYYY');
  if (!has(CurrRank.year, Year)) {
    const rankingDataYearly = await RankingYearly.findAll({
      where: { Year },
    });
    forEach(rankingDataYearly, c => {
      CurrRank.year[`${c.dataValues.KuskiIndex}-${c.dataValues.Year}`] =
        c.dataValues;
    });
  }
  const Month = moment(battleId.dataValues.Started).format('YYYYMM');
  if (!has(CurrRank.month, Year)) {
    const rankingDataMonthly = await RankingMonthly.findAll({
      where: { Month },
    });
    forEach(rankingDataMonthly, c => {
      CurrRank.month[`${c.dataValues.KuskiIndex}-${c.dataValues.Month}`] =
        c.dataValues;
    });
  }
  const Week = moment(battleId.dataValues.Started).format('YYYYww');
  if (!has(CurrRank.week, Week)) {
    const rankingDataWeekly = await RankingWeekly.findAll({
      where: { Week },
    });
    forEach(rankingDataWeekly, c => {
      CurrRank.month[`${c.dataValues.KuskiIndex}-${c.dataValues.Week}`] =
        c.dataValues;
    });
  }
  const Day = moment(battleId.dataValues.Started).format('YYYYMMDD');
  if (!has(CurrRank.day, Day)) {
    const rankingDataDaily = await RankingDaily.findAll({
      where: { Day },
    });
    forEach(rankingDataDaily, c => {
      CurrRank.month[`${c.dataValues.KuskiIndex}-${c.dataValues.Day}`] =
        c.dataValues;
    });
  }
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

const ranking = (currentRanking, results, kuski, current, RankingDbTable) => {
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
        if (current[r.KuskiIndex][RankingDbTable]) {
          opponentRanking = parseFloat(current[r.KuskiIndex][RankingDbTable]);
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
  const obj = { KuskiIndex: kuski, new: true };
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
  let newRanking = { new: true };
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
    const RankingDbTable = `Ranking${type}`; // battle ranking
    if (!newRanking[RankingDbTable]) {
      newRanking[RankingDbTable] = 1000;
    }
    newRanking[RankingDbTable] = ranking(
      newRanking[RankingDbTable],
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

export function calcRankings(getBattleList, battleResults) {
  return new Promise(resolve => {
    const newRankings = { all: {}, year: {}, month: {}, week: {}, day: {} };
    const history = [];
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
              CurrRank.all,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              '',
              'all',
            );
            CurrRank.all[r.KuskiIndex] = newRankings.all[r.KuskiIndex];
            const RankingBattleType = getBattleType(result.battle);
            let previousRanking = 1000;
            if (CurrRank.all[r.KuskiIndex]) {
              if (CurrRank.all[r.KuskiIndex][`Ranking${RankingBattleType}`]) {
                previousRanking =
                  CurrRank.all[r.KuskiIndex][`Ranking${RankingBattleType}`];
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
            if (CurrRank.all[r.KuskiIndex]) {
              if (CurrRank.all[r.KuskiIndex].RankingAll) {
                previousRanking = CurrRank.all[r.KuskiIndex].RankingAll;
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
              CurrRank.year,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              moment(result.battle.Started).format('YYYY'),
              'year',
            );
            CurrRank.year[
              `${r.KuskiIndex}-${moment(result.battle.Started).format('YYYY')}`
            ] =
              newRankings.year[
                `${r.KuskiIndex}-${moment(result.battle.Started).format(
                  'YYYY',
                )}`
              ];
            // add ranking for month
            newRankings.month[
              `${r.KuskiIndex}-${moment(result.battle.Started).format(
                'YYYYMM',
              )}`
            ] = addRanking(
              CurrRank.month,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              moment(result.battle.Started).format('YYYYMM'),
              'month',
            );
            CurrRank.month[
              `${r.KuskiIndex}-${moment(result.battle.Started).format(
                'YYYYMM',
              )}`
            ] =
              newRankings.month[
                `${r.KuskiIndex}-${moment(result.battle.Started).format(
                  'YYYYMM',
                )}`
              ];
            // add ranking for week
            newRankings.week[
              `${r.KuskiIndex}-${moment(result.battle.Started).format(
                'YYYYww',
              )}`
            ] = addRanking(
              CurrRank.week,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              moment(result.battle.Started).format('YYYYww'),
              'week',
            );
            CurrRank.week[
              `${r.KuskiIndex}-${moment(result.battle.Started).format(
                'YYYYww',
              )}`
            ] =
              newRankings.week[
                `${r.KuskiIndex}-${moment(result.battle.Started).format(
                  'YYYYww',
                )}`
              ];
            // add ranking for day
            newRankings.day[
              `${r.KuskiIndex}-${moment(result.battle.Started).format(
                'YYYYMMDD',
              )}`
            ] = addRanking(
              CurrRank.day,
              getBattleType(result.battle),
              result.result,
              place,
              r.KuskiIndex,
              result.battle.KuskiIndex,
              moment(result.battle.Started).format('YYYYMMDD'),
              'day',
            );
            CurrRank.day[
              `${r.KuskiIndex}-${moment(result.battle.Started).format(
                'YYYYMMDD',
              )}`
            ] =
              newRankings.day[
                `${r.KuskiIndex}-${moment(result.battle.Started).format(
                  'YYYYMMDD',
                )}`
              ];
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
                CurrRank[periodType][result.battle.KuskiIndex] =
                  newRankings[periodType][result.battle.KuskiIndex];
              }
              if (
                !newRankings[periodType][result.battle.KuskiIndex][Designed]
              ) {
                newRankings[periodType][result.battle.KuskiIndex][Designed] = 1;
                CurrRank[periodType][result.battle.KuskiIndex][Designed] = 1;
              } else {
                newRankings[periodType][result.battle.KuskiIndex][
                  Designed
                ] += 1;
                CurrRank[periodType][result.battle.KuskiIndex][Designed] += 1;
              }
            }
            if (!newRankings[periodType][result.battle.KuskiIndex]) {
              newRankings[periodType][result.battle.KuskiIndex] = newRankingRow(
                result.battle.KuskiIndex,
                periodType,
                result.battle.Started,
              );
              CurrRank[periodType][result.battle.KuskiIndex] =
                newRankings[periodType][result.battle.KuskiIndex];
            }
            if (
              !newRankings[periodType][result.battle.KuskiIndex].DesignedAll
            ) {
              newRankings[periodType][result.battle.KuskiIndex].DesignedAll = 1;
              CurrRank[periodType][result.battle.KuskiIndex].DesignedAll = 1;
            } else {
              newRankings[periodType][
                result.battle.KuskiIndex
              ].DesignedAll += 1;
              CurrRank[periodType][result.battle.KuskiIndex].DesignedAll += 1;
            }
          });
        }
      });
      resolve({ newRankings, history });
    });
  });
}

const updateOrCreateRanking = async (data, done) => {
  const insertData = data;
  if (insertData.KuskiIndex) {
    if (has(insertData, 'new')) {
      delete insertData.new;
      insertBulk.all.push(insertData);
      done();
    } else {
      delete insertData.RankingIndex;
      await Ranking.update(insertData, {
        where: { KuskiIndex: insertData.KuskiIndex },
      });
      done();
    }
  } else {
    done();
  }
};

const updateOrCreateRankingYearly = async (data, done) => {
  const insertData = data;
  if (insertData.KuskiIndex) {
    if (has(insertData, 'new')) {
      delete insertData.new;
      insertBulk.year.push(insertData);
      done();
    } else {
      delete insertData.RankingIndex;
      await RankingYearly.update(insertData, {
        where: { KuskiIndex: insertData.KuskiIndex, Year: insertData.Year },
      });
      done();
    }
  } else {
    done();
  }
};

const updateOrCreateRankingMonthly = async (data, done) => {
  const insertData = data;
  if (insertData.KuskiIndex) {
    if (has(insertData, 'new')) {
      delete insertData.new;
      insertBulk.month.push(insertData);
      done();
    } else {
      delete insertData.RankingIndex;
      await RankingMonthly.update(insertData, {
        where: { KuskiIndex: insertData.KuskiIndex, Month: insertData.Month },
      });
      done();
    }
  } else {
    done();
  }
};

const updateOrCreateRankingWeekly = async (data, done) => {
  const insertData = data;
  if (insertData.KuskiIndex) {
    if (has(insertData, 'new')) {
      delete insertData.new;
      insertBulk.week.push(insertData);
      done();
    } else {
      delete insertData.RankingIndex;
      await RankingWeekly.update(insertData, {
        where: { KuskiIndex: insertData.KuskiIndex, Week: insertData.Week },
      });
      done();
    }
  } else {
    done();
  }
};

const updateOrCreateRankingDaily = async (data, done) => {
  const insertData = data;
  if (insertData.KuskiIndex) {
    if (has(insertData, 'new')) {
      delete insertData.new;
      insertBulk.day.push(insertData);
      done();
    } else {
      delete insertData.RankingIndex;
      await RankingDaily.update(insertData, {
        where: { KuskiIndex: insertData.KuskiIndex, Day: insertData.Day },
      });
      done();
    }
  } else {
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

export function updateRankingTable(newRankings) {
  return new Promise(resolve => {
    eachSeries(newRankings.all, updateOrCreateRanking, () => {
      eachSeries(newRankings.year, updateOrCreateRankingYearly, () => {
        eachSeries(newRankings.month, updateOrCreateRankingMonthly, () => {
          eachSeries(newRankings.week, updateOrCreateRankingWeekly, () => {
            eachSeries(newRankings.day, updateOrCreateRankingDaily, () => {
              resolve();
            });
          });
        });
      });
    });
  });
}

export function insertRankingTable(inserts) {
  return new Promise(resolve => {
    Ranking.bulkCreate(inserts.all).then(() => {
      RankingYearly.bulkCreate(inserts.year).then(() => {
        RankingMonthly.bulkCreate(inserts.month).then(() => {
          RankingWeekly.bulkCreate(inserts.week).then(() => {
            RankingDaily.bulkCreate(inserts.day).then(() => {
              resolve();
            });
          });
        });
      });
    });
  });
}

export const deleteRanking = async () => {
  await Ranking.destroy({
    where: {
      KuskiIndex: { [Op.gt]: 0 },
    },
  });
  await RankingYearly.destroy({
    where: {
      KuskiIndex: { [Op.gt]: 0 },
    },
  });
  await RankingMonthly.destroy({
    where: {
      KuskiIndex: { [Op.gt]: 0 },
    },
  });
  await RankingWeekly.destroy({
    where: {
      KuskiIndex: { [Op.gt]: 0 },
    },
  });
  await RankingDaily.destroy({
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
  const getCurrent = await getCurrentRankings();
  CurrRank = { all: {}, year: {}, month: {}, week: {}, day: {} };
  insertBulk = { all: [], year: [], month: [], week: [], day: [] };
  forEach(getCurrent.all, c => {
    CurrRank.all[c.dataValues.KuskiIndex] = c.dataValues;
  });
  let max = await RankingHistory.max('BattleIndex');
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(max)) {
    max = 0;
  }
  const getBattleList = await getBattles(max, limit);
  Results = [];
  const { newRankings, history } = await calcRankings(
    getBattleList,
    getBattleResults,
  );
  await updateRankingTable(newRankings);
  await insertRankingTable(insertBulk);
  await insertHistory(history);
  return history;
};
