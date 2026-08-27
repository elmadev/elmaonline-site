import { LevelPack, LevelPackStats } from '#data/models';
import { getTimes, totalTimes, kinglist } from '#api/levelpack';

/**
 * Populates levelpack_stats table for a single levelpack
 * @param {string|number} LevelPackIdentifier - LevelPackName or LevelPackIndex
 * @param {boolean} byName - If true, identifier is LevelPackName; if false, it's LevelPackIndex
 * @param {number} eolOnly - Whether to use EOL only times (0 or 1)
 */
export const populateLevelPackStats = async (
  LevelPackIdentifier,
  byName = true,
  eolOnly = 0,
) => {
  // Get the levelpack
  let levelPack;
  if (byName) {
    levelPack = await LevelPack.findOne({
      where: { LevelPackName: LevelPackIdentifier },
    });
  } else {
    levelPack = await LevelPack.findOne({
      where: { LevelPackIndex: LevelPackIdentifier },
    });
  }

  if (!levelPack) {
    throw new Error(
      `Level pack not found: ${LevelPackIdentifier} (byName: ${byName})`,
    );
  }

  const LevelPackIndex = levelPack.LevelPackIndex;
  const LevelPackName = levelPack.LevelPackName;

  // Get times data for the levelpack
  const timesData = await getTimes(LevelPackName, eolOnly);

  // Calculate total times (gives us tt and count)
  const tts = totalTimes(timesData, false, true);

  // Calculate kinglist (gives us points and records)
  const points = kinglist(timesData);

  // Create maps for quick lookup
  const ttsMap = new Map();
  tts.forEach(tt => {
    ttsMap.set(tt.KuskiIndex, tt);
  });

  const pointsMap = new Map();
  points.forEach(point => {
    pointsMap.set(point.KuskiIndex, point);
  });

  // Get all unique kuski indices
  const allKuskiIndices = new Set([
    ...Array.from(ttsMap.keys()),
    ...Array.from(pointsMap.keys()),
  ]);

  const now = Math.floor(Date.now() / 1000);

  // Process each kuski
  const statsToUpdate = [];
  for (const KuskiIndex of allKuskiIndices) {
    const ttData = ttsMap.get(KuskiIndex);
    const pointData = pointsMap.get(KuskiIndex);

    const stats = {
      LevelPackIndex,
      KuskiIndex,
      TotalTime: ttData ? ttData.tt : 0,
      LevelsFinished: ttData ? ttData.count : 0,
      Records: pointData ? pointData.records : 0,
      Points: pointData ? pointData.points : 0,
      LastUpdated: now,
    };

    statsToUpdate.push(stats);
  }

  // Use bulk upsert to update or insert records
  // First, delete existing records for this levelpack
  await LevelPackStats.destroy({
    where: { LevelPackIndex },
  });

  // Then insert all new records
  if (statsToUpdate.length > 0) {
    await LevelPackStats.bulkCreate(statsToUpdate);
  }

  return {
    LevelPackIndex,
    LevelPackName,
    recordsUpdated: statsToUpdate.length,
  };
};

/**
 * Populates levelpack_stats table for all levelpacks
 * @param {number} eolOnly - Whether to use EOL only times (0 or 1)
 */
export const populateAllLevelPackStats = async (eolOnly = 0) => {
  const allPacks = await LevelPack.findAll({
    attributes: ['LevelPackIndex', 'LevelPackName'],
    order: [['LevelPackIndex', 'ASC']],
  });

  const results = [];
  for (const pack of allPacks) {
    try {
      const result = await populateLevelPackStats(
        pack.LevelPackName,
        true,
        eolOnly,
      );
      results.push(result);
    } catch (error) {
      results.push({
        LevelPackIndex: pack.LevelPackIndex,
        LevelPackName: pack.LevelPackName,
        error: error.message,
      });
    }
  }
  return results;
};
