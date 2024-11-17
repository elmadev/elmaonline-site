import express from 'express';
import path from 'path';
import fs from 'fs';
import util from 'util';
import { readChunkSync } from 'read-chunk';

import config from '../config.js';
import { authContext } from '#utils/auth';
import { uuid } from '#utils/calcs';
import { Level } from '#data/models';

import { PIG_LEV_FNAME_LEN, getPigData } from '#okevalidator/okevalidator';

const router = express.Router();

const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const deleteFile = util.promisify(fs.unlink);

const findLevelNameFromDat = file => {
  const levIDBuffer = readChunkSync(file, {
    length: PIG_LEV_FNAME_LEN,
    startPosition: 20,
  });
  const LevelName = levIDBuffer.toString('utf-8').replace(/\0/g, '');
  return LevelName;
};

const getInternalLevelFromName = async LevelName => {
  const internalLevelMap = {
    'QWQUU001.LEV': 2,
    'QWQUU002.LEV': 4,
    'QWQUU003.LEV': 5,
    'QWQUU004.LEV': 6,
    'QWQUU005.LEV': 7,
    'QWQUU006.LEV': 8,
    'QWQUU007.LEV': 9,
    'QWQUU008.LEV': 10,
    'QWQUU009.LEV': 15,
    'QWQUU010.LEV': 59,
    'QWQUU011.LEV': 78,
    'QWQUU012.LEV': 109,
    'QWQUU013.LEV': 139,
    'QWQUU014.LEV': 219,
    'QWQUU015.LEV': 71,
    'QWQUU016.LEV': 51,
    'QWQUU017.LEV': 165,
    'QWQUU018.LEV': 57,
    'QWQUU019.LEV': 128,
    'QWQUU020.LEV': 197,
    'QWQUU021.LEV': 43,
    'QWQUU022.LEV': 107,
    'QWQUU023.LEV': 98,
    'QWQUU024.LEV': 100,
    'QWQUU025.LEV': 175,
    'QWQUU026.LEV': 192,
    'QWQUU027.LEV': 38,
    'QWQUU028.LEV': 198,
    'QWQUU029.LEV': 31,
    'QWQUU030.LEV': 16,
    'QWQUU031.LEV': 18,
    'QWQUU032.LEV': 164,
    'QWQUU033.LEV': 66,
    'QWQUU034.LEV': 131,
    'QWQUU035.LEV': 156,
    'QWQUU036.LEV': 357,
    'QWQUU037.LEV': 45,
    'QWQUU038.LEV': 13,
    'QWQUU039.LEV': 408,
    'QWQUU040.LEV': 412,
    'QWQUU041.LEV': 24,
    'QWQUU042.LEV': 416,
    'QWQUU043.LEV': 415,
    'QWQUU044.LEV': 95,
    'QWQUU045.LEV': 29,
    'QWQUU046.LEV': 33,
    'QWQUU047.LEV': 46,
    'QWQUU048.LEV': 21,
    'QWQUU049.LEV': 52,
    'QWQUU050.LEV': 257,
    'QWQUU051.LEV': 135,
    'QWQUU052.LEV': 133,
    'QWQUU053.LEV': 413,
    'QWQUU054.LEV': 17,
  };

  const LevelIndex = internalLevelMap[LevelName.toUpperCase()];

  if (!LevelIndex) {
    return null;
  }

  const level = await Level.findOne({
    attributes: ['LevelName', 'LevelData', 'LevelIndex'],
    where: { LevelIndex },
  });

  return level;
};

const move = (file, dest) => {
  return new Promise((resolve, reject) => {
    file.mv(dest, mvErr => {
      if (mvErr) {
        reject(mvErr);
      } else {
        fs.chmod(dest, 0o664, chmodErr => {
          if (chmodErr) {
            reject(chmodErr);
          } else {
            resolve();
          }
        });
      }
    });
  });
};

export const getDatInfo = async (datFile, filename, LevelIndex) => {
  try {
    const tempDir = `.${config.publicFolder}/temp/`;

    const datDirPath = path.join(tempDir, 'dat');
    const pigDirPath = path.join(tempDir, 'pig');
    const recDirPath = path.join(tempDir, 'rec');
    const levDirPath = path.join(tempDir, 'lev');

    // Ensure the directories exists
    await mkdir(datDirPath, { recursive: true });
    await mkdir(recDirPath, { recursive: true });
    await mkdir(pigDirPath, { recursive: true });
    await mkdir(levDirPath, { recursive: true });

    const fileUuid = uuid(16);
    const datFilePath = `.${config.publicFolder}/temp/dat/${fileUuid}-${filename}`;

    await move(datFile, datFilePath);

    const LevelName = findLevelNameFromDat(datFilePath);
    let lev;

    if (/^QWQUU\d{3}\.LEV$/i.test(LevelName)) {
      lev = await getInternalLevelFromName(LevelName);
    } else if (LevelIndex) {
      lev = await Level.findOne({
        attributes: ['LevelName', 'LevelData', 'LevelIndex'],
        where: { LevelIndex },
      });
    }

    if (!lev) {
      return {
        error: 'Level not found',
        datInfo: null,
        file: filename,
      };
    }

    const levFilePath = `.${config.publicFolder}/temp/lev/${LevelName}`;

    await writeFile(levFilePath, lev.LevelData);
    const pigData = await getPigData(datFilePath, tempDir);

    if (pigData.finished === 0) {
      return {
        error: 'Not finished',
        datInfo: pigData,
        file: filename,
      };
    }

    await deleteFile(datFilePath);
    await deleteFile(levFilePath);

    return {
      error: null,
      datInfo: pigData,
      file: filename,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return {
      error,
      datInfo: null,
      file: filename,
    };
  }
};

router.post('/getdatinfo', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file was provided.' });
  }

  if (!req.body || !req.body.filename) {
    return res.status(400).json({ error: 'No filename was provided.' });
  }
  const getAuth = authContext(req);
  if (getAuth.auth) {
    const result = await getDatInfo(
      req.files.file,
      req.body.filename,
      req.body.levelid,
    );
    res.json(result);
  } else {
    res.sendStatus(401);
  }
});

export default router;
