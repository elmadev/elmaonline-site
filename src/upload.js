import crypto from 'crypto';
import { Replay } from 'node-elma';
import readChunk from 'read-chunk';
import fs from 'fs';
import { Level } from './data/models';

const getLevelsFromName = async LevelName => {
  const levels = await Level.findAll({
    attributes: ['LevelName', 'LevelData', 'LevelIndex'],
    where: { LevelName },
  });
  return levels;
};

export function uploadReplay(replayFile, folder, filename) {
  return new Promise(resolve => {
    const uuid = crypto
      .randomBytes(20)
      .toString('hex')
      .substring(10, 20);
    fs.mkdir(`./public/${folder}/${uuid}`, mkDirErr => {
      if (mkDirErr) {
        resolve({ error: mkDirErr });
      }
      replayFile.mv(`./public/${folder}/${uuid}/${filename}`, mvErr => {
        if (mvErr) {
          resolve({ error: mvErr });
        }
        const replayCRC = readChunk.sync(
          `./public/${folder}/${uuid}/${filename}`,
          16,
          4,
        );
        let replayLevel = readChunk.sync(
          `./public/${folder}/${uuid}/${filename}`,
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
          Replay.load(`./public/${folder}/${uuid}/${filename}`).then(result => {
            const replayData = result.getTime();
            resolve({
              file: filename,
              uuid,
              time: replayData.time,
              finished: +replayData.finished,
              LevelIndex,
            });
          });
        });
        return true;
      });
      return true;
    });
  });
}

export function getReplayByReplayId() {
  return new Promise(resolve => {
    resolve({
      file: '',
      filename: '',
    });
  });
}
