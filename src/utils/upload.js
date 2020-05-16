import { Replay } from 'node-elma';
import readChunk from 'read-chunk';
import fs from 'fs';
import crypto from 'crypto';
import generate from 'nanoid/generate';
import AWS from 'aws-sdk';
import { format } from 'date-fns';

import { Level, Replay as ReplayDB, SiteCup, SiteCupTime } from 'data/models';
import config from '../config';

const getLevelsFromName = async LevelName => {
  const levels = await Level.findAll({
    attributes: ['LevelName', 'LevelData', 'LevelIndex'],
    where: { LevelName },
  });
  return levels;
};

const checksumFile = (hashName, path) =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash(hashName);
    const stream = fs.createReadStream(path);
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });

const getReplaysByMd5 = async MD5 => {
  const replays = await ReplayDB.findAll({
    attributes: ['MD5', 'ReplayIndex', 'Unlisted'],
    where: { MD5 },
  });
  return replays;
};

const getCupEventByLevelIndex = async LevelIndex => {
  const cups = await SiteCup.findAll({
    where: { LevelIndex },
  });
  let last = 0;
  let event;
  cups.forEach(cup => {
    if (cup.StartTime < format(new Date(), 't') && cup.StartTime > last) {
      last = cup.StartTime;
      event = cup;
    }
  });
  return event.CupIndex;
};

const CreateOrUpdateCuptime = async (
  CupIndex,
  KuskiIndex,
  Time,
  RecData,
  Code,
) => {
  const cuptime = await SiteCupTime.findOne({
    where: { CupIndex, KuskiIndex, Time },
  });
  if (cuptime) {
    await cuptime.update({ Replay: 1, RecData, Code });
    return true;
  }
  await SiteCupTime.create({
    Replay: 1,
    RecData,
    KuskiIndex,
    CupIndex,
    Time,
    Code,
  });
  return true;
};

const findLevelIndexFromReplay = async file => {
  const replayCRC = readChunk.sync(file, 16, 4);
  let replayLevel = readChunk.sync(file, 20, 12);
  replayLevel = replayLevel.toString('utf-8').split('.')[0];
  const levels = await getLevelsFromName(replayLevel);
  let Levelindex = 0;
  levels.forEach(level => {
    if (level.LevelData && replayCRC) {
      if (
        level.LevelData.toString('hex').substring(14, 22) ===
        replayCRC.toString('hex')
      ) {
        Levelindex = level.LevelIndex;
      }
    }
  });
  return Levelindex;
};

AWS.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});
const spacesEndpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com');
const s3 = new AWS.S3({ endpoint: spacesEndpoint });

export function uploadReplayS3(replayFile, folder, filename) {
  return new Promise(resolve => {
    const bucketName = 'eol';
    const uuid = generate('0123456789abcdefghijklmnopqrstuvwxyz', 10);
    const key = `${config.s3SubFolder}${folder}/${uuid}/${filename}`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: replayFile.data,
      ACL: 'public-read',
    };
    // save in temp folder to be able to read rec data
    replayFile.mv(`.${config.publicFolder}/temp/${uuid}-${filename}`, mvErr => {
      if (mvErr) {
        resolve({ error: mvErr, replayInfo: null });
      } else {
        // check duplicate
        checksumFile(
          'md5',
          `.${config.publicFolder}/temp/${uuid}-${filename}`,
        ).then(MD5 => {
          getReplaysByMd5(MD5).then(replaysMD5 => {
            if (replaysMD5.length > 0) {
              resolve({
                error: 'Duplicate',
                replayInfo: replaysMD5,
                file: filename,
              });
            } else {
              // find LevelIndex
              findLevelIndexFromReplay(
                `.${config.publicFolder}/temp/${uuid}-${filename}`,
              ).then(LevelIndex => {
                if (LevelIndex === 0) {
                  resolve({
                    error: 'Level not found',
                    replayInfo: null,
                    file: filename,
                  });
                  fs.unlink(`.${config.publicFolder}/temp/${uuid}-${filename}`);
                } else {
                  // upload to s3
                  s3.putObject(params, err => {
                    if (err) {
                      resolve({ error: err, replayInfo: null, file: filename });
                    } else {
                      // find replay time and finished state
                      Replay.load(
                        `.${config.publicFolder}/temp/${uuid}-${filename}`,
                      )
                        .then(result => {
                          const replayData = result.getTime();
                          // return all data
                          resolve({
                            file: filename,
                            uuid,
                            time: replayData.time,
                            finished: +replayData.finished,
                            LevelIndex,
                            MD5,
                          });
                          // delete file in temp folder
                          fs.unlink(
                            `.${config.publicFolder}/temp/${uuid}-${filename}`,
                          );
                        })
                        .catch(error => {
                          resolve({ error, replayInfo: null, file: filename });
                        });
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
  });
}

export function uploadCupReplay(replayFile, filename, kuskiId) {
  return new Promise(resolve => {
    const uuid = generate('0123456789abcdefghijklmnopqrstuvwxyz', 16);
    const fileDir = `.${config.publicFolder}/temp/${uuid}-${filename}`;
    replayFile.mv(fileDir, mvErr => {
      if (mvErr) {
        resolve({ error: mvErr });
      } else {
        findLevelIndexFromReplay(fileDir).then(LevelIndex => {
          if (LevelIndex === 0) {
            resolve({ error: 'Replay is not from a cup level' });
            fs.unlink(fileDir);
          } else {
            Replay.load(fileDir).then(result => {
              const replayData = result.getTime();
              const replayTime = Math.floor(replayData.time / 10);
              getCupEventByLevelIndex(LevelIndex).then(CupIndex => {
                fs.readFile(fileDir, (error, data) => {
                  if (error) {
                    resolve({ error });
                    fs.unlink(fileDir);
                  } else {
                    CreateOrUpdateCuptime(
                      CupIndex,
                      kuskiId,
                      replayTime,
                      data,
                      uuid,
                    ).then(() => {
                      resolve({ CupIndex, Time: replayTime });
                      fs.unlink(fileDir);
                    });
                  }
                });
              });
            });
          }
        });
      }
    });
  });
}
