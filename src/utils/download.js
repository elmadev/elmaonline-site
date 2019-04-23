import { Battle, Level } from '../data/models';

const getReplayDataByBattleId = async battleId => {
  const replayData = await Battle.findOne({
    attributes: ['RecFileName', 'RecData'],
    where: { BattleIndex: battleId },
  });
  return replayData;
};

export function getReplayByBattleId(battleId) {
  return new Promise((resolve, reject) => {
    getReplayDataByBattleId(battleId).then(data => {
      if (data !== null) {
        resolve({
          file: data.dataValues.RecData,
          filename: `${data.dataValues.RecFileName}.rec`,
        });
      } else {
        reject(new Error('replay not found'));
      }
    });
  });
}

const getLevelData = async id => {
  const levelData = await Level.findOne({
    attributes: ['LevelName', 'LevelData', 'Locked'],
    where: { LevelIndex: id },
  });
  const battleData = await Battle.findOne({
    attributes: ['Finished', 'Aborted', 'InQueue'],
    where: { LevelIndex: id },
  });
  return { level: levelData, battle: battleData };
};

export function getLevel(id) {
  return new Promise((resolve, reject) => {
    getLevelData(id).then(data => {
      const { Locked, LevelName, LevelData } = data.level.dataValues;
      const { Finished, Aborted, InQueue } = data.battle.dataValues;
      if (
        data !== null &&
        Locked === 0 &&
        (Finished === 1 ||
          Aborted === 1 ||
          (Finished === 0 && InQueue === 0 && Aborted === 0)) // meaning ongoing
      ) {
        resolve({
          file: LevelData,
          filename: `${LevelName}.lev`,
        });
      } else {
        reject(new Error('level not found'));
      }
    });
  });
}
