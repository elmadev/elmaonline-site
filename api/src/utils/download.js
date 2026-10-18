import {
  Battle,
  Level,
  LevelPackLevel,
  LevelPack,
  SiteCupTime,
  SiteCup,
  Kuski,
  SiteCupGroup,
} from '#data/models';
import neoAsync from 'neo-async';
const { eachSeries } = neoAsync;
import stream from 'stream';
import { forEach } from 'lodash-es';
import request from 'request';
import { Op } from 'sequelize';
import { uuid } from '#utils/calcs';
import fs from 'fs';
import archiver from 'archiver';
import { isAfter } from 'date-fns';
import { filterResults, admins } from '#utils/cups';
import { Jimp, intToRGBA, JimpMime } from 'jimp';
import config from '../config.js';

const getReplayDataByBattleId = async battleId => {
  const replayData = await Battle.findOne({
    attributes: ['RecFileName', 'RecData'],
    where: { BattleIndex: battleId },
  });
  return replayData;
};

const getAllShirtData = async () => {
  const kuskiData = await Kuski.findAll({
    attributes: ['Kuski', 'KuskiIndex', 'BmpCRC', 'BmpData'],
    where: {
      BmpData: {
        [Op.ne]: null,
      },
    },
  });
  return kuskiData;
};

export const getReplayByBattleId = async battleId => {
  const data = await getReplayDataByBattleId(battleId);
  if (!data?.RecData?.length) {
    return null;
  }
  return {
    file: data.RecData,
    filename: `${data.RecFileName}.rec`,
  };
};

const getReplayDataByCupTimeId = async CupTimeIndex => {
  const replayData = await SiteCupTime.findOne({
    attributes: ['RecData', 'Code', 'UUID', 'MD5', 'TimeIndex'],
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

export const getReplayByCupTimeId = async (cupTimeId, filename, code = '') => {
  const data = await getReplayDataByCupTimeId(cupTimeId);
  if (!data) {
    throw new Error('Replay not found');
  }
  const { RecData, Code, UUID, MD5, TimeIndex, CupData } = data;
  if (isAfter(new Date(CupData.EndTime * 1000), new Date())) {
    if (code !== Code) {
      throw new Error('Event not over');
    }
    return { file: RecData, filename: `${filename}.rec` };
  }
  if (!CupData.ShowResults) {
    throw new Error('Event not public');
  }
  if (MD5 && UUID && TimeIndex) {
    return { UUID, MD5, TimeIndex, filename: `${filename}.rec` };
  }
  if (RecData) {
    return { file: RecData, filename: `${filename}.rec` };
  }
  throw new Error('Replay data not found');
};

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

export const getLevel = async id => {
  const { level, battle } = await getLevelData(id);
  if (!level || level.Locked !== 0) {
    return null;
  }
  if (battle) {
    const { Finished, Aborted, InQueue } = battle;
    const ongoing = Finished === 0 && InQueue === 0 && Aborted === 0;
    if (Finished !== 1 && Aborted !== 1 && !ongoing) {
      return null;
    }
  }
  return { file: level.LevelData, filename: `${level.LevelName}.lev` };
};

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
      // workaround for this issue https://github.com/archiverjs/node-archiver/issues/542
      // OG: archive.append(Buffer.from(file.file), { name: file.filename });
      const ReadableStream = stream.Readable;
      const zipInputStream = new ReadableStream();
      zipInputStream.push(Buffer.from(file.file));
      zipInputStream.push(null);
      archive.append(zipInputStream, { name: file.filename });
    });
    archive.finalize();
  });
};

const zipLevelPack = levels => {
  return new Promise(resolve => {
    const levelData = [];
    const levelDataIterator = async (level, done) => {
      // locked levels and levels in queued battles are left out of the zip
      try {
        const data = await getLevel(level.dataValues.LevelIndex);
        if (data) {
          levelData.push(data);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
      done();
    };
    eachSeries(levels, levelDataIterator, async () => {
      const zip = await zipFiles(levelData);
      resolve(zip);
    });
  });
};

async function zipAllShirts() {
  const playerData = await getAllShirtData();
  return new Promise(resolve => {
    const shirtData = [];
    const shirtDataIterator = async (player, done) => {
      shirtData.push({
        file: player.BmpData,
        filename: `${player.Kuski}.bmp`,
      });
      done();
    };
    eachSeries(playerData, shirtDataIterator, async () => {
      const zip = await zipFiles(shirtData);
      resolve(zip);
    });
  });
}

export const getAllShirts = async () => {
  const zip = await zipAllShirts();
  const fileData = fs.readFileSync(zip);
  fs.unlink(zip, () => {});
  return fileData;
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
        done();
      } else if (rec.UUID) {
        request.get(
          {
            url: `https://eol.ams3.digitaloceanspaces.com/${config.s3SubFolder}time/${rec.UUID}-${rec.MD5}/${rec.TimeIndex}.rec`,
            encoding: null,
          },
          (err, res, s3Data) => {
            recData.push({
              file: s3Data,
              filename: `${filename}${rec.KuskiData.Kuski}.rec`,
            });
            done();
          },
        );
      } else {
        done();
      }
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
          'UUID',
          'MD5',
          'TimeIndex',
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

export const getShirtBmpByKuskiId = async KuskiIndex => {
  const kuskiData = await Kuski.scope(null).findOne({
    where: { KuskiIndex },
  });
  if (!kuskiData || !kuskiData.BmpCRC || !kuskiData.BmpData) {
    return { file: null, filename: '', error: 'no bmp data' };
  }
  return { file: kuskiData.BmpData, filename: `${kuskiData.Kuski}.bmp` };
};

export const getShirtByKuskiId = async KuskiIndex => {
  const kuskiData = await Kuski.scope(null).findOne({
    where: { KuskiIndex },
  });
  if (!kuskiData || !kuskiData.BmpCRC || !kuskiData.BmpData) {
    return { file: null, filename: '', error: 'no bmp data' };
  }
  const image = await Jimp.read(kuskiData.BmpData);
  const alphaKey = intToRGBA(image.getPixelColor(0, 0));
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
  const imageBuffer = await image.getBuffer(JimpMime.png);
  return { file: imageBuffer, filename: kuskiData.Kuski };
};
