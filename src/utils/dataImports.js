import { forEach } from 'lodash';
import { format } from 'date-fns';
import { eachSeries } from 'neo-async';
import {
  KuskiMap,
  SiteSetting,
  Kuski,
  LevelPack,
  LevelPackLevel,
  Level,
  LegacyFinished,
  LegacyBesttime,
  Besttime,
} from '../data/models';
import * as kuskiMapData from '../data/json/kuskimap.json';
import * as skintPRsData from '../data/json/skintatious_PRs.json';
import * as skintNonPRsData from '../data/json/skintatious_nonPRs.json';

const addMarker = async Data => {
  let newMarker = false;
  newMarker = await KuskiMap.findOne({
    where: { KuskiIndex: Data.KuskiIndex },
  });
  if (newMarker) {
    await newMarker.update(Data);
  } else {
    await KuskiMap.create(Data);
  }
  return newMarker;
};

export const kuskimap = () => {
  return new Promise(resolve => {
    forEach(kuskiMapData.default, d => {
      const addedDate = d.DateAdded.split('/');
      const addedTime = d.TimeAdded.split(':');
      addMarker({
        KuskiIndex: d.KuskiId,
        Lng: d.Longitude,
        Lat: d.Latitude,
        LastUpdated: format(
          new Date(
            addedDate[2],
            addedDate[1],
            addedDate[0],
            addedTime[0],
            addedTime[1],
          ),
          't',
        ),
      }).then(() => {
        resolve();
      });
    });
  });
};

const EmailsFromSettings = async () => {
  const get = await SiteSetting.findAll({
    where: { SettingName: 'Email' },
  });
  return get;
};

const insertEmailToKuski = async (Email, kuskiId) => {
  let kuski = false;
  kuski = await Kuski.findOne({
    where: { KuskiIndex: kuskiId },
  });
  if (kuski) {
    await kuski.update({ Email });
  }
  return kuski;
};

export const email = async () => {
  const getEmails = await EmailsFromSettings();
  forEach(getEmails, e => {
    if (e.Setting && e.KuskiIndex) {
      insertEmailToKuski(e.Setting, e.KuskiIndex);
    }
  });
};

const getPacks = packs => {
  const get = LevelPack.findAll({
    where: { LevelPackName: packs },
    include: {
      model: LevelPackLevel,
      as: 'Levels',
      include: {
        model: Besttime,
        as: 'LevelBesttime',
      },
    },
  });
  return get;
};

const updateLegacyLevel = async (LevelIndex, done) => {
  await Level.update({ Legacy: 1 }, { where: { LevelIndex } });
  done();
};

const updateLegacyPack = async (LevelPackIndex, done) => {
  await LevelPack.update({ Legacy: 1 }, { where: { LevelPackIndex } });
  done();
};

const skint = json => {
  const times = [];
  forEach(json.default, s => {
    times.push({
      LevelIndex: s.LevelIndex,
      KuskiIndex: s.KuskiIndex,
      Time: s.Time,
      Driven: s.Driven,
      Source: 3,
    });
  });
  return times;
};

const insertFinished = times => {
  return new Promise(resolve => {
    LegacyFinished.bulkCreate(times).then(() => {
      resolve();
    });
  });
};

const insertBesttime = times => {
  return new Promise(resolve => {
    LegacyBesttime.bulkCreate(times).then(() => {
      resolve();
    });
  });
};

export const legacyTimes = async (levelpacks, importStrategy) => {
  const packs = await getPacks(levelpacks);
  const updateBulk = [];
  const updatePacks = [];
  const insertLegacyBesttimeEOL = [];
  forEach(packs, pack => {
    updatePacks.push(pack.LevelPackIndex);
    forEach(pack.Levels, level => {
      updateBulk.push(level.LevelIndex);
      forEach(level.LevelBesttime, time => {
        insertLegacyBesttimeEOL.push({
          LevelIndex: time.LevelIndex,
          KuskiIndex: time.KuskiIndex,
          Time: time.Time,
          Driven:
            time.Driven !== 'Invalid date'
              ? format(new Date(time.Driven * 1000), 'yyyy-MM-dd HH:mm:ss')
              : '0000-00-00 00:00:00',
          Source: 0,
          TimeIndex: time.TimeIndex,
        });
      });
    });
  });
  await insertBesttime(insertLegacyBesttimeEOL);
  let finished = [];
  let besttime = [];
  if (importStrategy === 'skint') {
    const skintFinished = await skint(skintNonPRsData);
    const skintBest = await skint(skintPRsData);
    finished = [...skintFinished, ...skintBest];
    besttime = skintBest;
  }
  await insertFinished(finished);
  const insertToLegacyBesttime = [];
  eachSeries(
    besttime,
    async (time, done) => {
      const exists = await LegacyBesttime.findOne({
        where: { LevelIndex: time.LevelIndex, KuskiIndex: time.KuskiIndex },
      });
      if (exists) {
        if (exists.Time > time.Time) {
          await exists.update({
            TimeIndex: 0,
            Time: time.Time,
            Driven: time.Driven,
            Source: time.Source,
          });
          done();
        } else {
          done();
        }
      } else {
        insertToLegacyBesttime.push(time);
        done();
      }
    },
    async () => {
      await insertBesttime(insertToLegacyBesttime);
      eachSeries(updateBulk, updateLegacyLevel, () => {
        eachSeries(updatePacks, updateLegacyPack, () => {
          return {
            insertLegacyBesttimeBulk: insertLegacyBesttimeEOL.length,
            updateBulk: updateBulk.length,
            finished: finished.length,
            besttime: besttime.length,
          };
        });
      });
    },
  );
};
