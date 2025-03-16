import { TimeFile, MultiTimeFile, Time, SiteSetting } from '#data/models';
import AWS from 'aws-sdk';
import fs from 'fs';
import util from 'util';
import { Op } from 'sequelize';
import { differenceInYears } from 'date-fns';
import { zipFiles } from '#utils/download';
import { dbquery } from '#data/sequelize';
import { uuid } from '#utils/calcs';
import config from '../config.js';
import { checksumFile, s3Params, putObject } from '#utils/upload';

const deleteFile = util.promisify(fs.unlink);

const DO_endpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com');
const DO_s3 = new AWS.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  endpoint: DO_endpoint,
});

const SW_endpoint = new AWS.Endpoint('s3.nl-ams.scw.cloud');
const SW_s3 = new AWS.S3({
  accessKeyId: config.SWaccessKeyId,
  secretAccessKey: config.SWsecretAccessKey,
  endpoint: SW_endpoint,
});

const folder = 'time';
const deleteChunkSize = 900;
const maxTimes = 10000;

const s3GetParams = Key => {
  return {
    Bucket: 'eol',
    Key,
  };
};

const s3PutParams = (Key, Body) => {
  return {
    Bucket: 'eol',
    Key,
    Body,
    ContentType: 'application/zip',
    StorageClass: 'GLACIER',
  };
};

const DO_s3GetObject = params => {
  return new Promise(resolve => {
    DO_s3.getObject(params, (err, data) => {
      resolve({ err, data });
    });
  });
};

const DO_s3DeleteObjects = params => {
  return new Promise(resolve => {
    DO_s3.deleteObjects(params, (err, data) => {
      resolve({ err, data });
    });
  });
};

const SW_s3PutObject = params => {
  return new Promise(resolve => {
    SW_s3.putObject(params, err => {
      resolve(err);
    });
  });
};

const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const processChunksInSeries = async (chunks, iterator, delayMs) => {
  const results = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(iterator));
    results.push(...chunkResults);
    await delay(delayMs);
  }
  return results;
};

const getTimes = async () => {
  const last = await SiteSetting.findOne({
    where: { SettingName: 'LastCold' },
  });
  const data = await TimeFile.findAll({
    where: { TimeFileIndex: { [Op.gt]: parseInt(last.Setting) } },
    attributes: [
      'TimeFileIndex',
      'TimeIndex',
      'BattleIndex',
      'UUID',
      'MD5',
      'Shared',
    ],
    include: [
      {
        model: Time,
        required: true,
        as: 'Time',
        attributes: ['Driven', 'Finished'],
      },
    ],
    limit: maxTimes,
    raw: true,
  });
  return data;
};

const deleteTimeFiles = async (max, min) => {
  const query = `
    DELETE timefile FROM timefile
    INNER JOIN time ON time.TimeIndex = timefile.TimeIndex
    WHERE timefile.TimeFileIndex >= ? AND timefile.TimeFileIndex <= ?
    AND timefile.Shared = 0
    AND timefile.BattleIndex = 0
    AND time.Finished IN ('E', 'D')
  `;
  await dbquery(query, [min, max]);
  return;
};

// moves unfinished auto uploaded replays to cold storage
export const coldStorage = async () => {
  // get times from database
  let times = await getTimes();
  const last = times[times.length - 1].TimeFileIndex;
  const first = times[0].TimeFileIndex;
  // only run if last time is older than 1 year
  if (
    differenceInYears(
      new Date(),
      new Date(times[times.length - 1]['Time.Driven']),
    ) < 1
  ) {
    return { first, last, error: 'Last time is not old enough' };
  }
  // get files from digital ocean s3
  times = times.map(entity => ({
    time: entity,
    path: s3GetParams(
      `${config.s3SubFolder}${folder}/${entity.UUID}-${entity.MD5}/${entity.TimeIndex}.rec`,
    ),
  }));
  const filesIterator = async entity => {
    const { err, data } = await DO_s3GetObject(entity.path);
    if (!err) {
      return { ...entity, file: data };
    }
    return entity;
  };
  // split times into chunks to avoid too many requests
  const chunks = chunkArray(times, 250);
  times = await processChunksInSeries(chunks, filesIterator, 1000);
  // zip the files
  const zip = await zipFiles(
    times
      .filter(entity => !!entity.file)
      .map(entity => ({
        file: entity.file.Body,
        filename: entity.path.Key.replace(
          `${config.s3SubFolder}${folder}/`,
          '',
        ).replace('/', '_'),
      })),
    true,
  );
  const binary = await fs.promises.readFile(zip);
  // upload files to scaleway s3
  const putError = await SW_s3PutObject(
    s3PutParams(`${config.s3SubFolder}${folder}/${first}-${last}.zip`, binary),
  );
  // clean up
  await fs.promises.unlink(zip);
  if (!putError) {
    // delete unfinished and unshared times from digital ocean s3
    const deleteParams = times
      .filter(
        entity =>
          !!entity.file &&
          entity.time.Shared === 0 &&
          ['E', 'D'].indexOf(entity.time['Time.Finished']) > -1 &&
          !entity.time.BattleIndex,
      )
      .map(entity => ({ Key: entity.path.Key }));
    const deleteParamsChunks = [];
    for (let i = 0; i < deleteParams.length; i += deleteChunkSize) {
      deleteParamsChunks.push({
        Bucket: 'eol',
        Delete: { Objects: deleteParams.slice(i, i + deleteChunkSize) },
      });
    }
    await Promise.all(
      deleteParamsChunks.map(files => DO_s3DeleteObjects(files)),
    );
    // delete unfinished and unshared times from timefile table
    await deleteTimeFiles(last, first);
    // update last cold storage TimeFileIndex for next update
    await SiteSetting.update(
      { Setting: last },
      { where: { SettingName: 'LastCold' } },
    );
  }
  return { first, last };
};

const uploadTimeFile = async (
  fileData,
  TimeIndex = 0,
  BattleIndex = 0,
  Multi = 0,
) => {
  const UUID = uuid();
  let { timeFolder } = config;
  let s3TimeFolder = 'time';
  if (parseInt(Multi, 10) === 1) {
    timeFolder = `multi-${timeFolder}`;
    s3TimeFolder = 'multitime';
  }
  let filePath = `../events/${timeFolder}/${TimeIndex}.rec`;
  let MD5 = null;
  try {
    MD5 = await checksumFile('md5', filePath);
    const params = s3Params(
      `${config.s3SubFolder}${s3TimeFolder}/${UUID}-${MD5}/${TimeIndex}.rec`,
      fileData,
    );
    await putObject(params);
    if (parseInt(Multi, 10) === 1) {
      await MultiTimeFile.upsert({
        MultiTimeIndex: TimeIndex,
        BattleIndex,
        UUID,
        MD5,
      });
    } else {
      await TimeFile.upsert({
        TimeIndex,
        BattleIndex,
        UUID,
        MD5,
      });
    }
    await deleteFile(filePath);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', TimeIndex);
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

const uploadTimeFileIterator = async (fileName, multi = 0) => {
  const TimeIndex = fileName.split('.')[0];
  const getTime = await Time.findOne({ where: { TimeIndex }, raw: true });
  if (!getTime) {
    return;
  }
  const data = await fs.promises.readFile(
    `../events/${config.timeFolder}/${fileName}`,
  );
  await uploadTimeFile(data, TimeIndex, getTime.BattleIndex, multi);
  return getTime;
};

export const recoverRecFiles = async () => {
  const maxRecover = 1000;
  const files = await fs.promises.readdir(`../events/${config.timeFolder}`);
  const recovered = await Promise.all(
    files.slice(0, maxRecover).map(file => uploadTimeFileIterator(file)),
  );
  return { files: files.length, recovered: recovered.length };
};
