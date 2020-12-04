import { Replay } from 'elmajs';
import readChunk from 'read-chunk';
import fs from 'fs';
import crypto from 'crypto';
import { uuid } from 'utils/calcs';
import AWS from 'aws-sdk';
import { format } from 'date-fns';

import {
  Level,
  Replay as ReplayDB,
  SiteCup,
  SiteCupTime,
  Kuski,
} from 'data/models';
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
  if (event) {
    return event.CupIndex;
  }
  return 0;
};

const CreateOrUpdateCuptime = async (
  CupIndex,
  KuskiIndex,
  Time,
  RecData,
  Code,
  ReplayInfo,
  share,
  Comment,
) => {
  const cuptime = await SiteCupTime.findOne({
    where: { CupIndex, KuskiIndex, Time },
  });
  let ShareReplay = 0;
  if (share === 'true') {
    ShareReplay = 1;
  }
  if (cuptime) {
    await cuptime.update({
      Replay: 1,
      RecData,
      Code,
      ShareReplay,
      Comment,
    });
    return 1;
  }
  const KuskiData = await Kuski.findOne({
    where: { KuskiIndex },
    attributes: ['TeamIndex'],
  });
  if (ReplayInfo.finished) {
    await SiteCupTime.create({
      Replay: 1,
      RecData,
      KuskiIndex,
      CupIndex,
      Time,
      Code,
      ShareReplay,
      Comment,
      TeamIndex: KuskiData.TeamIndex,
    });
  } else {
    await SiteCupTime.create({
      Replay: 1,
      RecData,
      KuskiIndex,
      CupIndex,
      Time: 9999000 + (1000 - ReplayInfo.apples),
      Code,
      ShareReplay,
      Comment,
      TeamIndex: KuskiData.TeamIndex,
    });
  }
  return 2;
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

const getReplayInfo = async dir => {
  const fileBuffer = fs.readFileSync(dir);
  const rec = Replay.from(fileBuffer);
  const { finished, time, reason } = rec.getTime();
  return { finished, time, reason, apples: rec.apples };
};

export function uploadReplayS3(replayFile, folder, filename) {
  return new Promise(resolve => {
    const bucketName = 'eol';
    const fileUuid = uuid();
    const key = `${config.s3SubFolder}${folder}/${fileUuid}/${filename}`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: replayFile.data,
      ACL: 'public-read',
    };
    // save in temp folder to be able to read rec data
    replayFile.mv(
      `.${config.publicFolder}/temp/${fileUuid}-${filename}`,
      mvErr => {
        if (mvErr) {
          resolve({ error: mvErr, replayInfo: null });
        } else {
          // check duplicate
          checksumFile(
            'md5',
            `.${config.publicFolder}/temp/${fileUuid}-${filename}`,
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
                  `.${config.publicFolder}/temp/${fileUuid}-${filename}`,
                ).then(LevelIndex => {
                  if (LevelIndex === 0) {
                    resolve({
                      error: 'Level not found',
                      replayInfo: null,
                      file: filename,
                    });
                    fs.unlink(
                      `.${config.publicFolder}/temp/${fileUuid}-${filename}`,
                    );
                  } else {
                    // upload to s3
                    s3.putObject(params, err => {
                      if (err) {
                        resolve({
                          error: err,
                          replayInfo: null,
                          file: filename,
                        });
                      } else {
                        // find replay time and finished state
                        getReplayInfo(
                          `.${
                            config.publicFolder
                          }/temp/${fileUuid}-${filename}`,
                        )
                          .then(replayData => {
                            // return all data
                            resolve({
                              file: filename,
                              uuid: fileUuid,
                              time: replayData.time,
                              finished: +replayData.finished,
                              LevelIndex,
                              MD5,
                            });
                            // delete file in temp folder
                            fs.unlink(
                              `.${
                                config.publicFolder
                              }/temp/${fileUuid}-${filename}`,
                            );
                          })
                          .catch(error => {
                            resolve({
                              error,
                              replayInfo: null,
                              file: filename,
                            });
                          });
                      }
                    });
                  }
                });
              }
            });
          });
        }
      },
    );
  });
}

export function uploadCupReplay(
  replayFile,
  filename,
  kuskiId,
  ShareReplay,
  Comment,
) {
  return new Promise(resolve => {
    const fileUuid = uuid(16);
    const fileDir = `.${config.publicFolder}/temp/${fileUuid}-${filename}`;
    replayFile.mv(fileDir, mvErr => {
      if (mvErr) {
        resolve({ error: mvErr });
      } else {
        getReplayInfo(fileDir);
        findLevelIndexFromReplay(fileDir).then(LevelIndex => {
          if (LevelIndex === 0) {
            resolve({ error: 'Level not found' });
            fs.unlink(fileDir, () => {});
          } else {
            getReplayInfo(fileDir).then(replayData => {
              const replayTime = Math.floor(replayData.time / 10);
              getCupEventByLevelIndex(LevelIndex).then(CupIndex => {
                if (CupIndex === 0) {
                  resolve({ error: 'Replay is not from a cup level' });
                  fs.unlink(fileDir, () => {});
                } else if (!replayData.finished && !replayData.apples) {
                  resolve({ error: 'Level not finished or apple not picked' });
                  fs.unlink(fileDir, () => {});
                } else {
                  fs.readFile(fileDir, (error, data) => {
                    if (error) {
                      resolve({ error });
                      fs.unlink(fileDir, () => {});
                    } else {
                      CreateOrUpdateCuptime(
                        CupIndex,
                        kuskiId,
                        replayTime,
                        data,
                        fileUuid,
                        replayData,
                        ShareReplay,
                        Comment,
                      ).then(() => {
                        fs.unlink(fileDir, () => {});
                        resolve({
                          CupIndex,
                          Time: replayTime,
                          Apples: replayData.apples,
                          Finished: replayData.finished,
                        });
                      });
                    }
                  });
                }
              });
            });
          }
        });
      }
    });
  });
}
