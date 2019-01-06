import { Replay } from 'node-elma';
import readChunk from 'read-chunk';
import fs from 'fs';
import generate from 'nanoid/generate';
import AWS from 'aws-sdk';
import { Level } from './data/models';
import config from './config';

const getLevelsFromName = async LevelName => {
  const levels = await Level.findAll({
    attributes: ['LevelName', 'LevelData', 'LevelIndex'],
    where: { LevelName },
  });
  return levels;
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
    const key = `${folder}/${uuid}/${filename}`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: replayFile.data,
      ACL: 'public-read',
    };
    // upload to s3
    s3.putObject(params, err => {
      if (err) {
        resolve({ error: err });
      } else {
        // save in temp folder to be able to read rec data
        replayFile.mv(
          `.${config.publicFolder}/temp/${uuid}-${filename}`,
          mvErr => {
            if (mvErr) {
              resolve({ error: mvErr });
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
                // find replay time and finished state
                Replay.load(`.${config.publicFolder}/temp/${uuid}-${filename}`)
                  .then(result => {
                    const replayData = result.getTime();
                    // return all data
                    resolve({
                      file: filename,
                      uuid,
                      time: replayData.time,
                      finished: +replayData.finished,
                      LevelIndex,
                    });
                    // delete file in temp folder
                    fs.unlink(
                      `.${config.publicFolder}/temp/${uuid}-${filename}`,
                    );
                  })
                  .catch(error => {
                    resolve({ error });
                  });
              });
            }
          },
        );
      }
    });
  });
}

// deprecated, keeping for now for reference
export function uploadReplay(replayFile, folder, filename) {
  return new Promise(resolve => {
    const uuid = generate('0123456789abcdefghijklmnopqrstuvwxyz', 10);
    fs.mkdir(`.${config.publicFolder}/${folder}/${uuid}`, mkDirErr => {
      if (mkDirErr) {
        resolve({ error: mkDirErr });
      } else {
        replayFile.mv(
          `.${config.publicFolder}/${folder}/${uuid}/${filename}`,
          mvErr => {
            if (mvErr) {
              resolve({ error: mvErr });
            } else {
              const replayCRC = readChunk.sync(
                `.${config.publicFolder}/${folder}/${uuid}/${filename}`,
                16,
                4,
              );
              let replayLevel = readChunk.sync(
                `.${config.publicFolder}/${folder}/${uuid}/${filename}`,
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
                Replay.load(
                  `.${config.publicFolder}/${folder}/${uuid}/${filename}`,
                )
                  .then(result => {
                    const replayData = result.getTime();
                    resolve({
                      file: filename,
                      uuid,
                      time: replayData.time,
                      finished: +replayData.finished,
                      LevelIndex,
                    });
                  })
                  .catch(error => {
                    resolve({ error });
                  });
              });
            }
            return true;
          },
        );
      }
      return true;
    });
  });
}
