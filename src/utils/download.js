import {
  Battle,
  Level,
  LevelPackLevel,
  LevelPack,
  SiteCupTime,
  SiteCup,
  Kuski,
  SiteCupGroup,
} from 'data/models';
import { eachSeries } from 'neo-async';
import { forEach } from 'lodash';
import { uuid } from 'utils/calcs';
import fs from 'fs';
import archiver from 'archiver';
import { isAfter } from 'date-fns';
import { filterResults, admins } from 'utils/cups';
import jimp from 'jimp';
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
    attributes: ['RecData', 'Code'],
    where: { CupTimeIndex },
    include: [
      {
        model: SiteCup,
        as: 'CupData',
        attributes: ['EndTime', 'ShowResults'],
      },
    ],
  });
  return replayData;
};

export function getReplayByCupTimeId(cupTimeId, filename, code = '') {
  return new Promise((resolve, reject) => {
    getReplayDataByCupTimeId(cupTimeId).then(data => {
      if (data !== null) {
        if (
          isAfter(new Date(data.dataValues.CupData.EndTime * 1000), new Date())
        ) {
          if (code === data.dataValues.Code) {
            resolve({
              file: data.dataValues.RecData,
              filename: `${filename}.rec`,
            });
          } else {
            reject(new Error('Event not over'));
          }
        } else if (!data.dataValues.CupData.ShowResults) {
          reject(new Error('Event not public'));
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
    const fileUuid = uuid();
    const output = fs.createWriteStream(
      `.${config.publicFolder}/temp/${fileUuid}.zip`,
    );
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });
    output.on('close', () => {
      resolve(`.${config.publicFolder}/temp/${fileUuid}.zip`);
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

const zipEventRecs = (recs, filename) => {
  return new Promise(resolve => {
    const recData = [];
    const recDataIterator = async (rec, done) => {
      if (rec.Replay) {
        recData.push({
          file: rec.RecData,
          filename: `${filename}${rec.KuskiData.Kuski}.rec`,
        });
      }
      done();
    };
    eachSeries(recs, recDataIterator, async () => {
      const zip = await zipFiles(recData);
      resolve(zip);
    });
  });
};

const getCupEvent = async (CupIndex, cupGroup, auth) => {
  const data = await SiteCup.findAll({
    where: { CupIndex },
    include: [
      {
        model: SiteCupTime,
        attributes: [
          'KuskiIndex',
          'Time',
          'TimeExists',
          'CupTimeIndex',
          'Replay',
          'RecData',
        ],
        as: 'CupTimes',
        required: false,
        where: { TimeExists: 1 },
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'TeamIndex', 'Country'],
            as: 'KuskiData',
          },
        ],
      },
    ],
  });
  if (auth.auth) {
    return filterResults(data, admins(cupGroup), auth.userid);
  }
  return filterResults(data);
};

export const getEventReplays = async (CupIndex, filename, auth) => {
  const event = await SiteCup.findOne({
    where: { CupIndex },
  });
  const cupGroup = await SiteCupGroup.findOne({
    where: { CupGroupIndex: event.CupGroupIndex },
  });
  let allow = false;
  if (
    isAfter(new Date(), event.dataValues.EndTime) &&
    event.dataValues.Updated &&
    event.dataValues.ShowResults
  ) {
    allow = true;
  } else if (auth.auth) {
    const a = admins(cupGroup);
    if (a.length > 0 && a.indexOf(auth.userid) > -1) {
      allow = true;
    }
  }
  if (allow) {
    const recs = await getCupEvent(CupIndex, cupGroup, auth);
    if (recs.length > 0) {
      const zip = await zipEventRecs(recs[0].CupTimes, filename);
      const fileData = fs.readFileSync(zip);
      fs.unlink(zip, () => {});
      return fileData;
    }
  }
  return false;
};

export const getShirtByKuskiId = async KuskiIndex => {
  const kuskiData = await Kuski.findOne({ where: { KuskiIndex } });
  const image = await jimp.read(kuskiData.BmpData);
  const alphaKey = jimp.intToRGBA(image.getPixelColor(0, 0));
  const replaceColor = { r: 0, g: 0, b: 0, a: 0 };
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    if (
      image.bitmap.data[idx + 0] === alphaKey.r &&
      image.bitmap.data[idx + 1] === alphaKey.g &&
      image.bitmap.data[idx + 2] === alphaKey.b &&
      image.bitmap.data[idx + 3] === alphaKey.a
    ) {
      image.bitmap.data[idx + 0] = replaceColor.r;
      image.bitmap.data[idx + 1] = replaceColor.g;
      image.bitmap.data[idx + 2] = replaceColor.b;
      image.bitmap.data[idx + 3] = replaceColor.a;
    }
  });
  image.rotate(90);
  const imageBuffer = await image.getBufferAsync(jimp.MIME_PNG);
  return { file: imageBuffer, filename: kuskiData.Kuski };
};
