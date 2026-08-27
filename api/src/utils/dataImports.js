/* eslint-disable no-console */
import { forEach } from 'lodash-es';
import { format } from 'date-fns';
import neoAsync from 'neo-async';
const { eachSeries } = neoAsync;
import { create } from 'apisauce';
import {
  // KuskiMap,
  SiteSetting,
  Kuski,
  LevelPack,
  LevelPackLevel,
  Level,
  LegacyFinished,
  LegacyBesttime,
  Besttime,
  Country,
  Team,
} from '#data/models';
// import * as kuskiMapData from '../data/json/kuskimap.json' with { type: 'json' };

const api = create({
  baseURL: 'https://eol.ams3.digitaloceanspaces.com/import/',
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
});

const getJson = file => api.get(`${file}.json`);

const mopoCountries = [
  'US',
  'AU',
  'AT',
  'BE',
  'BY',
  'BR',
  'GB',
  'CA',
  'CL',
  'GR',
  'CZ',
  'DK',
  'NL',
  'EG',
  'EE',
  'FI',
  'FR',
  'DE',
  'HU',
  'IS',
  'IL',
  'LV',
  '',
  'NZ',
  'NO',
  'PL',
  'PT',
  'RO',
  'RU',
  'CH',
  'SK',
  'SI',
  'ES',
  'SE',
  'TR',
  'UA',
  'VE',
  'YU',
  'AR',
  'LT',
  'CN',
  'JP',
  'RS',
  'ME',
  'HR',
  'MK',
  '',
  'BA',
  'FO',
  'BG',
  '',
];

const ints = [
  0, 2, 4, 5, 6, 7, 8, 9, 10, 15, 59, 78, 109, 139, 219, 71, 51, 165, 57, 128,
  197, 43, 107, 98, 100, 175, 192, 38, 198, 31, 16, 18, 164, 66, 131, 156, 357,
  45, 13, 408, 412, 24, 416, 415, 95, 29, 33, 46, 21, 52, 257, 135, 133, 413,
  17,
];

/* const addMarker = async Data => {
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
}; */

/* export const kuskimap = () => {
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
}; */

const EmailsFromSettings = async () => {
  const get = await SiteSetting.findAll({
    where: { SettingName: 'Email' },
  });
  return get;
};

const insertEmailToKuski = async (Email, kuskiId) => {
  let kuski = false;
  kuski = await Kuski.scope(null).findOne({
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

const createKuski = async (k, strategy, kuskiList, teams = []) => {
  const kuskiData = await Kuski.scope(null).findOne({
    where: { Kuski: k },
  });
  if (kuskiData) {
    return kuskiData.KuskiIndex;
  }
  let kuskiInfo = [];
  if (strategy === 'skint') {
    kuskiInfo = kuskiList.filter(x => x.Kuski === k);
  }
  if (strategy === 'kopa') {
    kuskiInfo = kuskiList.rows.filter(x => x.Kuski === k);
  }
  if (strategy === 'mopo') {
    kuskiInfo = kuskiList.rows.filter(x => x.nick === k);
  }
  if (kuskiInfo.length > 0) {
    let nation = 'XX';
    if (strategy === 'skint') {
      const countryInfo = await Country.findOne({
        where: { Iso3: kuskiInfo[0].Country },
      });
      if (countryInfo) {
        nation = countryInfo.Iso;
      }
    }
    if (strategy === 'kopa') {
      if (kuskiInfo[0].Country) {
        nation = kuskiInfo[0].Country;
      }
    }
    if (strategy === 'mopo') {
      if (mopoCountries[kuskiInfo[0].country]) {
        nation = mopoCountries[kuskiInfo[0].country];
      }
      if (kuskiInfo[0].team <= 1) {
        kuskiInfo[0].Team = '';
      } else {
        const teamInfo = teams.rows.filter(x => x.id === kuskiInfo[0].team);
        kuskiInfo[0].Team = teamInfo[0].name;
      }
    }
    let TeamIndex = 0;
    if (kuskiInfo[0].Team !== 'NULL' && kuskiInfo[0].Team !== '') {
      const teamInfo = await Team.findOne({
        where: { Team: kuskiInfo[0].Team },
      });
      if (teamInfo) {
        TeamIndex = teamInfo.TeamIndex;
      }
    }
    const insert = await Kuski.create({
      Kuski: k,
      ConfirmCode: 'legacy',
      Country: nation,
      TeamIndex,
    });
    return insert.KuskiIndex;
  }
  return 0;
};

const skint = (json, kuskiList) => {
  return new Promise(resolve => {
    const times = [];
    const newKuskis = {};
    eachSeries(
      json,
      async (time, done) => {
        let kuskiId = time.KuskiIndex;
        if (kuskiId === 0) {
          if (newKuskis[time.Kuski.toLowerCase()]) {
            kuskiId = newKuskis[time.Kuski.toLowerCase()];
          } else {
            kuskiId = await createKuski(time.Kuski, 'skint', kuskiList);
            newKuskis[time.Kuski.toLowerCase()] = kuskiId;
          }
        }
        if (kuskiId !== 0) {
          times.push({
            LevelIndex: time.LevelIndex,
            KuskiIndex: kuskiId,
            Time: time.Time,
            Driven: time.Driven,
            Source: 3,
          });
        }
        done();
      },
      () => {
        resolve(times);
      },
    );
  });
};

const kopa = (kopaTimes, kopaKuskis, kopaLevels) => {
  return new Promise(resolve => {
    const times = [];
    const newKuskis = {};
    eachSeries(
      kopaTimes.rows,
      async (time, done) => {
        let kuskiId = 0;
        if (time.KuskiIndex === 0) {
          done();
        } else {
          if (newKuskis[time.KuskiIndex]) {
            kuskiId = newKuskis[time.KuskiIndex];
          } else {
            const KuskiData = kopaKuskis.rows.filter(
              k => k.KuskiIndex === time.KuskiIndex,
            );
            const KuskiSql = await Kuski.findOne({
              where: { Kuski: KuskiData[0].Kuski },
            });
            if (KuskiSql) {
              kuskiId = KuskiSql.KuskiIndex;
            } else {
              kuskiId = await createKuski(
                KuskiData[0].Kuski,
                'kopa',
                kopaKuskis,
              );
            }
            newKuskis[time.KuskiIndex] = kuskiId;
          }
          let levelId = 0;
          const levelData = kopaLevels.rows.filter(
            l => l.LevelIndex === time.LevelIndex,
          );
          if (levelData.length > 0) {
            levelId = levelData[0].EOLIndex;
          }
          if (kuskiId !== 0 && levelId !== 0) {
            times.push({
              LevelIndex: levelId,
              KuskiIndex: kuskiId,
              Time: time.Time,
              Driven: time.Driven,
              Source: 2,
            });
          }
          done();
        }
      },
      () => {
        resolve(times);
      },
    );
  });
};

const mopo = (mopoTimes, mopoKuskis, mopoTeams) => {
  return new Promise(resolve => {
    const times = [];
    const newKuskis = {};
    eachSeries(
      mopoTimes.rows,
      async (time, done) => {
        let kuskiId = 0;
        if (time.KuskiIndex === 0) {
          done();
        } else {
          if (newKuskis[time.KuskiIndex]) {
            kuskiId = newKuskis[time.KuskiIndex];
          } else {
            const KuskiData = mopoKuskis.rows.filter(
              k => k.id === time.KuskiIndex,
            );
            const KuskiSql = await Kuski.findOne({
              where: { Kuski: KuskiData[0].nick },
            });
            if (KuskiSql) {
              kuskiId = KuskiSql.KuskiIndex;
            } else {
              let { nick } = KuskiData[0];
              if (nick.length > 15) {
                nick = nick.substring(0, 15);
              }
              kuskiId = await createKuski(nick, 'mopo', mopoKuskis, mopoTeams);
            }
            newKuskis[time.KuskiIndex] = kuskiId;
          }
          const levelId = ints[time.LevelIndex];
          if (kuskiId !== 0 && levelId) {
            times.push({
              LevelIndex: levelId,
              KuskiIndex: kuskiId,
              Time: time.Time,
              Driven: time.Driven,
              Source: 1,
            });
          }
          done();
        }
      },
      () => {
        resolve(times);
      },
    );
  });
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

export const legacyTimes = async importStrategy => {
  let levelpacks = [];
  if (importStrategy === 'skint') {
    levelpacks = ['BaSk', 'BaSkG', 'BaSkP', 'SkHoyl', 'Skint', 'SkVar', 'SNTL'];
  }
  if (importStrategy === 'kopa') {
    levelpacks = [
      'TKT',
      'TKTII',
      'DCup03',
      '1337',
      'cEp',
      'FSDC1L',
      'ILDC',
      'dakar',
      'dakar2',
      'MIRROR',
      'MAX',
      'INTilt',
      'wke',
      'umiz',
      'qumiz',
      'OBLP',
      'NP',
      'Qsla',
      'Gsla',
      'Faza',
      'GS',
      'semen',
      'VSK',
      'BZAL',
      'kachi',
      'Haru',
      'Pablo',
      'Jeppe',
      'GAB',
      'Found',
      'HALF1',
      'HALF2',
      'EPLP',
      'Tube',
      'FMPi',
      'RIP',
      'vzh',
      'Hoyl',
      'RHP',
      'FMH',
      'Danpe',
      'Ilevs',
      'Bhoyl',
      'AZHP',
      'MCHM',
      'MOPCU',
      'LI',
      'MCLE',
      'MOPLGR',
      'OLP',
      'LOM',
    ];
  }
  if (importStrategy === 'mopo') {
    levelpacks = ['Int'];
  }
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
  let finished = [];
  let besttime = [];
  let apiSuccess = false;
  if (importStrategy === 'skint') {
    const skintKuskis = await getJson('skintatious_kuskis');
    const skintNonPRsData = await getJson('skintatious_nonPRs');
    const skintFinished = await skint(skintNonPRsData.data, skintKuskis.data);
    const skintPRsData = await getJson('skintatious_PRs');
    const skintBest = await skint(skintPRsData.data, skintKuskis.data);
    finished = [...skintFinished, ...skintBest];
    besttime = skintBest;
    if (skintKuskis.ok && skintNonPRsData.ok && skintPRsData.ok) {
      apiSuccess = true;
    }
  }
  if (importStrategy === 'kopa') {
    const kopaTimes = await getJson('kopasite_time');
    const kopaKuskis = await getJson('kopasite_kuski');
    const kopaLevels = await getJson('kopasite_level');
    const kopasiteTimes = await kopa(
      kopaTimes.data,
      kopaKuskis.data,
      kopaLevels.data,
    );
    finished = kopasiteTimes;
    besttime = kopasiteTimes;
    if (kopaTimes.ok && kopaKuskis.ok && kopaLevels.ok) {
      apiSuccess = true;
    }
  }
  if (importStrategy === 'mopo') {
    const mopoTimes = await getJson('moposite_records');
    const mopoKuskis = await getJson('moposite_users');
    const mopoTeams = await getJson('moposite_teams');
    const mopositeTimes = await mopo(
      mopoTimes.data,
      mopoKuskis.data,
      mopoTeams.data,
    );
    finished = mopositeTimes;
    besttime = mopositeTimes;
    if (mopoTimes.ok && mopoKuskis.ok && mopoTeams.ok) {
      apiSuccess = true;
    }
  }
  if (!apiSuccess) {
    return;
  }
  await insertBesttime(insertLegacyBesttimeEOL);
  await insertFinished(finished);
  const insertToLegacyBesttime = [];
  eachSeries(
    besttime,
    async (time, done) => {
      const existsIndex = insertLegacyBesttimeEOL.findIndex(
        b =>
          b.LevelIndex === time.LevelIndex && b.KuskiIndex === time.KuskiIndex,
      );
      if (existsIndex > -1) {
        if (insertLegacyBesttimeEOL[existsIndex].Time > time.Time) {
          const insertIndex = insertToLegacyBesttime.findIndex(
            b =>
              b.LevelIndex === time.LevelIndex &&
              b.KuskiIndex === time.KuskiIndex,
          );
          if (insertIndex > -1) {
            insertToLegacyBesttime[insertIndex] = {
              TimeIndex: 0,
              Time: time.Time,
              Driven: time.Driven,
              Source: time.Source,
              KuskiIndex: time.KuskiIndex,
              LevelIndex: time.LevelIndex,
            };
          } else {
            await LegacyBesttime.update(
              {
                TimeIndex: 0,
                Time: time.Time,
                Driven: time.Driven,
                Source: time.Source,
              },
              {
                where: {
                  LevelIndex: time.LevelIndex,
                  KuskiIndex: time.KuskiIndex,
                },
              },
            );
          }
          insertLegacyBesttimeEOL[existsIndex] = {
            TimeIndex: 0,
            Time: time.Time,
            Driven: time.Driven,
            Source: time.Source,
            KuskiIndex: time.KuskiIndex,
            LevelIndex: time.LevelIndex,
          };
          done();
        } else {
          done();
        }
      } else {
        insertToLegacyBesttime.push(time);
        insertLegacyBesttimeEOL.push(time);
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

export const orderLevels = async () => {
  try {
    console.log('Starting conversion of Sort values to Order values...');

    // First, let's see what data we're working with
    console.log('Fetching all levelpack_level records...');
    const allRecords = await LevelPackLevel.findAll({
      order: [
        ['LevelPackIndex', 'ASC'],
        ['Sort', 'ASC'],
      ],
    });

    console.log(`Found ${allRecords.length} total records`);

    // Group records by LevelPackIndex
    const groupedRecords = {};
    allRecords.forEach(record => {
      const packIndex = record.LevelPackIndex;
      if (!groupedRecords[packIndex]) {
        groupedRecords[packIndex] = [];
      }
      groupedRecords[packIndex].push(record);
    });

    console.log(
      `Found ${Object.keys(groupedRecords).length} unique LevelPackIndex groups`,
    );

    // Process each group and assign Order values
    const updates = [];
    let totalUpdates = 0;

    for (const [packIndex, records] of Object.entries(groupedRecords)) {
      // Filter out records with empty Sort values - they should keep Order = 0
      const recordsWithSort = records.filter(
        record => record.Sort && record.Sort.trim() !== '',
      );
      const recordsWithoutSort = records.filter(
        record => !record.Sort || record.Sort.trim() === '',
      );

      console.log(
        `Processing LevelPackIndex ${packIndex} with ${records.length} records (${recordsWithSort.length} with Sort, ${recordsWithoutSort.length} without Sort)`,
      );

      // Sort records by their current Sort value to maintain order
      recordsWithSort.sort((a, b) => {
        const sortA = a.Sort || '';
        const sortB = b.Sort || '';
        return sortA.localeCompare(sortB);
      });

      // Assign sequential Order values starting from 1 only to records with Sort values
      recordsWithSort.forEach((record, index) => {
        const newOrder = index + 1;
        if (record.Order !== newOrder) {
          updates.push({
            id: record.LevelPackLevelIndex,
            oldOrder: record.Order,
            newOrder: newOrder,
            sortValue: record.Sort,
            levelPackIndex: record.LevelPackIndex,
          });
          totalUpdates++;
        }
      });

      // Ensure records without Sort values have Order = 0
      recordsWithoutSort.forEach(record => {
        if (record.Order !== 0) {
          updates.push({
            id: record.LevelPackLevelIndex,
            oldOrder: record.Order,
            newOrder: 0,
            sortValue: record.Sort || '',
            levelPackIndex: record.LevelPackIndex,
          });
          totalUpdates++;
        }
      });
    }

    console.log(`\nPrepared ${totalUpdates} updates to be made`);

    if (totalUpdates === 0) {
      console.log('No updates needed - all Order values are already correct!');
      return {
        success: true,
        message: 'No updates needed - all Order values are already correct!',
        totalUpdates: 0,
      };
    }

    // Show a preview of the first few updates
    console.log('\nPreview of first 10 updates:');
    updates.slice(0, 10).forEach(update => {
      console.log(
        `  ID ${update.id}: LevelPackIndex ${update.levelPackIndex}, Order ${update.oldOrder} -> ${update.newOrder}, Sort: "${update.sortValue}"`,
      );
    });

    if (updates.length > 10) {
      console.log(`  ... and ${updates.length - 10} more updates`);
    }

    // Ask for confirmation (in a real scenario, you might want to add a prompt here)
    console.log('\nProceeding with updates...');

    // Perform the updates in batches to avoid overwhelming the database
    const batchSize = 100;
    let processedBatches = 0;

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      // Create a single query to update all records in this batch
      const updatePromises = batch.map(update =>
        LevelPackLevel.update(
          { Order: update.newOrder },
          { where: { LevelPackLevelIndex: update.id } },
        ),
      );

      await Promise.all(updatePromises);
      processedBatches++;

      console.log(
        `Processed batch ${processedBatches}/${Math.ceil(updates.length / batchSize)} (${batch.length} records)`,
      );
    }

    console.log(`\n✅ Successfully updated ${totalUpdates} records!`);

    return {
      success: true,
      message: `Successfully updated ${totalUpdates} records!`,
      totalUpdates,
      processedBatches,
    };
  } catch (error) {
    console.error('❌ Error during conversion:', error);
    return {
      success: false,
      message: `Error during conversion: ${error.message}`,
      error: error.message,
    };
  }
};
