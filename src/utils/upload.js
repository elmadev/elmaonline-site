import { Replay } from 'node-elma';
import readChunk from 'read-chunk';
import fs from 'fs';
import crypto from 'crypto';
import generate from 'nanoid/generate';
import AWS from 'aws-sdk';

import { Level, Replay as ReplayDB } from 'data/models';
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

AWS.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});
const spacesEndpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com');
const s3 = new AWS.S3({ endpoint: spacesEndpoint });

export default function uploadReplayS3(replayFile, folder, filename) {
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
              const replayCRC = readChunk.sync(
                `.${config.publicFolder}/temp/${uuid}-${filename}`,
                16,
                4,
              );
              let replayLevel = readChunk.sync(
                `.${config.publicFolder}/temp/${uuid}-${filename}`,
                20,
                12,
              );
              replayLevel = replayLevel.toString('utf-8').split('.')[0];
              getLevelsFromName(replayLevel).then(levels => {
                let LevelIndex = 0;
                levels.forEach(level => {
                  if (level.LevelData && replayCRC) {
                    if (
                      level.LevelData.toString('hex').substring(14, 22) ===
                      replayCRC.toString('hex')
                    ) {
                      LevelIndex = level.LevelIndex;
                    }
                  }
                });
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
