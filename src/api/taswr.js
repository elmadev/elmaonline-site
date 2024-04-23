import express from 'express';
import sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';
import util from 'util';
import { readChunkSync } from 'read-chunk';
import { format } from 'date-fns';

import connection from '../data/sequelize';
import config from '../config';
import { authContext } from '#utils/auth';
import { uuid } from '#utils/calcs';
import { Level, TasWr } from '../data/models';

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

const TAS_WR_BUG_FACTOR_LIMIT = 200;

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

const getIntenalLevelIndexFromName = LevelName => {
  return internalLevelMap[LevelName.toUpperCase()];
};

const getInternalLevelFromName = async LevelName => {
  const LevelIndex = getIntenalLevelIndexFromName(LevelName);

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
    console.log(error);
    return {
      error,
      datInfo: null,
      file: filename,
    };
  }
};

const getTasWrs = async (levelIndex, bugFactor, changedFps) => {
  let subquery = `
    SELECT LevelIndex, MIN(Time) as FastestTime
    FROM taswr
  `;

  let conditions = [];
  if (bugFactor !== undefined) {
    conditions.push(`BugFactor <= ${bugFactor}`);
  }
  if (changedFps !== undefined) {
    conditions.push(`ChangedFps = ${changedFps}`);
  }
  if (conditions.length) {
    subquery += ' WHERE ' + conditions.join(' AND ');
  }

  subquery += ' GROUP BY LevelIndex';

  let query = `
    SELECT LevelData.LevelIndex, LevelData.LevelName, LevelData.LongName, 
           COALESCE(sq.FastestTime, 600000) as FastestTime, 
           KuskiData.Kuski, KuskiData.KuskiIndex, KuskiData.Country, TeamData.Team
    FROM level AS LevelData
    LEFT JOIN (${subquery}) as sq ON LevelData.LevelIndex = sq.LevelIndex
    LEFT JOIN taswr ON sq.LevelIndex = taswr.LevelIndex AND sq.FastestTime = taswr.Time
    LEFT JOIN kuski AS KuskiData ON taswr.KuskiIndex = KuskiData.KuskiIndex
    LEFT JOIN team AS TeamData ON KuskiData.TeamIndex = TeamData.TeamIndex
  `;

  if (levelIndex) {
    query += ` WHERE LevelData.LevelIndex = ${levelIndex}`;
  } else {
    const levelIndexes = Object.values(internalLevelMap).join(', ');
    query += ` WHERE LevelData.LevelIndex IN (${levelIndexes})`;
  }

  query +=
    ' ORDER BY CAST(SUBSTRING(LOWER(LevelData.LevelName), 6) AS UNSIGNED)';

  const results = await connection.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });

  // Transform the results to nest Kuski and Level information
  let transformedResults = [];
  results.forEach(result => {
    const existingResult = transformedResults.find(
      r => r.LevelData.LevelIndex === result.LevelIndex,
    );
    if (!existingResult || result.FastestTime < existingResult.Time) {
      transformedResults = transformedResults.filter(
        r => r.LevelData.LevelIndex !== result.LevelIndex,
      );
      transformedResults.push({
        Time: result.FastestTime,
        LevelData: {
          LevelIndex: result.LevelIndex,
          LevelName: result.LevelName,
          LongName: result.LongName,
        },
        KuskiData: {
          Kuski: result.Kuski,
          KuskiIndex: result.KuskiIndex,
          Country: result.Country,
          TeamData: {
            Team: result.Team,
          },
        },
      });
    }
  });

  return transformedResults;
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
    return res.json(result);
  } else {
    return res.sendStatus(401);
  }
});

router.get('/wrs/:tableOption', async (req, res) => {
  const tableOption = parseInt(req.params.tableOption, 10);
  let result;

  switch (tableOption) {
    case 1:
      result = await getTasWrs();
      break;
    case 2:
      result = await getTasWrs(undefined, TAS_WR_BUG_FACTOR_LIMIT);
      break;
    case 3:
      result = await getTasWrs(undefined, TAS_WR_BUG_FACTOR_LIMIT, false);
      break;
    default:
      return res.status(400).json({ error: 'Invalid table option.' });
  }

  res.json(result);
});

router.post('/upload', async (req, res) => {
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

    if (!result.datInfo) {
      return res.status(400).json({ error: 'Cannot validate dat' });
    }

    const levelIndex = getIntenalLevelIndexFromName(result.datInfo.lev_fname);

    if (!levelIndex) {
      return res.status(400).json({ error: 'Not an internal level' });
    }

    if (result.datInfo.bug_factor > TAS_WR_BUG_FACTOR_LIMIT) {
      const currentWr = await getTasWrs(levelIndex);

      if (currentWr[0].Time <= result.datInfo.time) {
        return res.status(400).json({ error: 'Unlimited bug table: Not a WR' });
      }
    } else if (result.datInfo.ft_range < 1) {
      const currentWr = await getTasWrs(
        levelIndex,
        TAS_WR_BUG_FACTOR_LIMIT,
        false,
      );

      if (currentWr[0].Time <= result.datInfo.time) {
        return res.status(400).json({ error: 'Limited bug table: Not a WR' });
      }
    } else if (result.datInfo.bug_factor < TAS_WR_BUG_FACTOR_LIMIT) {
      const currentWr = await getTasWrs(levelIndex, TAS_WR_BUG_FACTOR_LIMIT);

      if (currentWr[0].Time <= result.datInfo.time) {
        return res.status(400).json({ error: 'Changed fps table: Not a WR' });
      }
    }

    await TasWr.create({
      LevelIndex: levelIndex,
      KuskiIndex: getAuth.userid,
      Time: result.datInfo.time,
      Uploaded: format(new Date(), 't'),
      FPS: result.datInfo.fps_avg,
      BugFactor: result.datInfo.bug_factor,
      ChangedFps: result.datInfo.ft_range > 1 ? true : false,
    });

    return res.sendStatus(200);
  } else {
    return res.sendStatus(401);
  }
});

export default router;
