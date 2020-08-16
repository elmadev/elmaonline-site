import {
  Battle,
  Level,
  LevelPackLevel,
  LevelPack,
  SiteCupTime,
  SiteCup,
} from 'data/models';
import { eachSeries } from 'neo-async';
import { forEach } from 'lodash';
import generate from 'nanoid/generate';
import fs from 'fs';
import archiver from 'archiver';
import { isBefore } from 'date-fns';
import config from '../config';

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

const getReplayDataByCupTimeId = async CupTimeIndex => {
  const replayData = await SiteCupTime.findOne({
    attributes: ['RecData'],
    where: { CupTimeIndex },
    include: [
      {
        model: SiteCup,
        as: 'CupData',
        attributes: ['EndTime'],
      },
    ],
  });
  return replayData;
};

export function getReplayByCupTimeId(cupTimeId, filename) {
  return new Promise((resolve, reject) => {
    getReplayDataByCupTimeId(cupTimeId).then(data => {
      if (data !== null) {
        if (isBefore(new Date(data.dataValues.EndTime), new Date())) {
          reject(new Error('Event not over'));
        } else if (data.dataValues.RecData) {
          resolve({
            file: data.dataValues.RecData,
            filename: `${filename}.rec`,
          });
        } else {
          reject(new Error('Replay data not found'));
        }
      } else {
        reject(new Error('Replay not found'));
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

const getLevels = async LevelPackName => {
  const levelData = await LevelPack.findOne({
    where: { LevelPackName },
    include: [
      {
        model: LevelPackLevel,
        as: 'Levels',
      },
    ],
  });
  return levelData;
};

export function getLevel(id) {
  return new Promise((resolve, reject) => {
    getLevelData(id).then(data => {
      const { Locked, LevelName, LevelData } = data.level.dataValues;
      if (!data.battle) {
        if (data.level !== null && Locked === 0) {
          resolve({
            file: LevelData,
            filename: `${LevelName}.lev`,
          });
        } else {
          reject(new Error('level not found'));
        }
      } else {
        const { Finished, Aborted, InQueue } = data.battle.dataValues;
        if (
          data.level !== null &&
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
      }
    });
  });
}

export const zipFiles = files => {
  return new Promise((resolve, reject) => {
    const uuid = generate('0123456789abcdefghijklmnopqrstuvwxyz', 10);
    const output = fs.createWriteStream(
      `.${config.publicFolder}/temp/${uuid}.zip`,
    );
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });
    output.on('close', () => {
      resolve(`.${config.publicFolder}/temp/${uuid}.zip`);
    });
    archive.on('error', err => {
      reject(err);
    });
    archive.pipe(output);
    forEach(files, file => {
      archive.append(Buffer.from(file.file), { name: file.filename });
    });
    archive.finalize();
  });
};

const zipLevelPack = levels => {
  return new Promise(resolve => {
    const levelData = [];
    const levelDataIterator = async (level, done) => {
      const data = await getLevel(level.dataValues.LevelIndex);
      levelData.push(data);
      done();
    };
    eachSeries(levels, levelDataIterator, async () => {
      const zip = await zipFiles(levelData);
      resolve(zip);
    });
  });
};

export const getLevelPack = async name => {
  const levels = await getLevels(name);
  if (levels) {
    if (levels.Levels.length > 0) {
      const zip = await zipLevelPack(levels.Levels);
      const fileData = fs.readFileSync(zip);
      fs.unlink(zip, () => {});
      return fileData;
    }
  }
  return false;
};
