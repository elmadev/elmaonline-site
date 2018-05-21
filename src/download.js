import { Battle, Level } from './data/models';

const getReplayData = async id => {
  const replayData = await Battle.findOne({
    attributes: ['RecFileName', 'RecData'],
    where: { BattleIndex: id },
  });
  return replayData;
};

export function getReplay(id) {
  return new Promise(resolve => {
    getReplayData(id).then(data => {
      resolve({
        file: data.dataValues.RecData,
        filename: `${data.dataValues.RecFileName}.rec`,
      });
    });
  });
}

const getLevelData = async id => {
  const levelData = await Level.findOne({
    attributes: ['LevelName', 'LevelData'],
    where: { LevelIndex: id },
  });
  return levelData;
};

export function getLevel(id) {
  return new Promise(resolve => {
    getLevelData(id).then(data => {
      resolve({
        file: data.dataValues.LevelData,
        filename: `${data.dataValues.LevelName}.lev`,
      });
    });
  });
}
