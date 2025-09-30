import express from 'express';
import { authContext } from '#utils/auth';
import { LevelPackLevel, LevelPack, Level } from '#data/models';

const router = express.Router();

const SortPack = async data => {
  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
  });

  if (!pack) {
    return 'Level pack not found';
  }

  if (pack.KuskiIndex !== data.KuskiIndex && !data.mod) {
    return 'This is not your level pack';
  }

  // validate that we have an array of LevelIndex values
  if (!Array.isArray(data.levelOrder) || data.levelOrder.length === 0) {
    return 'Invalid request: levelOrder must be a non-empty array of LevelIndex values';
  }

  // get all current levels in this pack
  const levels = await LevelPackLevel.findAll({
    where: { LevelPackIndex: data.LevelPackIndex },
  });

  // validate that all provided LevelIndex values exist in this pack
  const existingLevelIndexes = levels.map(l => l.LevelIndex);
  const invalidLevels = data.levelOrder.filter(
    levelIndex => !existingLevelIndexes.includes(levelIndex),
  );
  if (invalidLevels.length > 0) {
    return `Invalid LevelIndex values: ${invalidLevels.join(', ')}. These levels are not in this level pack`;
  }

  // create a map of LevelIndex to new Order
  const levelOrderMap = {};
  data.levelOrder.forEach((levelIndex, index) => {
    levelOrderMap[levelIndex] = index + 1; // Order starts from 1
  });

  // update all levels with their new Order values
  const updatePromises = levels.map(level => {
    const newOrder = levelOrderMap[level.LevelIndex] || 0; // 0 for levels not in the order array
    return LevelPackLevel.update(
      { Order: newOrder },
      { where: { LevelPackLevelIndex: level.LevelPackLevelIndex } },
    );
  });

  await Promise.all(updatePromises);
  return true;
};

const AddLevel = async data => {
  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
  });
  const level = await Level.findOne({
    where: { LevelIndex: data.LevelIndex },
  });

  if (!pack) {
    return 'Level pack not found.';
  }

  if (!level) {
    return 'Level not found.';
  }

  if (level.Locked) {
    return 'Level is locked.';
  }
  if (level.Hidden) {
    return 'Level is hidden.';
  }

  if (pack.KuskiIndex !== data.KuskiIndex && !data.mod) {
    return 'This is not your level pack';
  }

  // check if level is already in this pack
  const existingLevel = await LevelPackLevel.findOne({
    where: {
      LevelPackIndex: data.LevelPackIndex,
      LevelIndex: data.LevelIndex,
    },
  });

  if (existingLevel) {
    return 'Level is already in this pack.';
  }

  // get the highest Order value in this pack and add 1
  const maxOrderResult = await LevelPackLevel.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
    order: [['Order', 'DESC']],
    attributes: ['Order'],
  });

  const newOrder = maxOrderResult ? maxOrderResult.Order + 1 : 1;

  await LevelPackLevel.create({
    LevelPackIndex: data.LevelPackIndex,
    LevelIndex: data.LevelIndex,
    LevelName: level.LevelName,
    Order: newOrder,
    Sort: '',
  });
  return '';
};

const DeleteLevel = async data => {
  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
  });
  if (pack.KuskiIndex === data.KuskiIndex || data.mod) {
    await LevelPackLevel.destroy({
      where: {
        LevelIndex: data.LevelIndex,
        LevelPackIndex: data.LevelPackIndex,
      },
    });
    return true;
  }
  return false;
};

const UpdateLevel = async data => {
  if (!data.LevelPackLevelIndex) {
    return 'Missing required parameter: LevelPackLevelIndex';
  }

  const levelPackLevel = await LevelPackLevel.findOne({
    where: { LevelPackLevelIndex: data.LevelPackLevelIndex },
  });

  if (!levelPackLevel) {
    return 'Level pack level not found';
  }

  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: levelPackLevel.LevelPackIndex },
  });

  if (!pack) {
    return 'Level pack not found';
  }

  if (pack.KuskiIndex === data.KuskiIndex || data.mod) {
    const updateData = {};
    if (data.ExcludeFromTotal !== undefined) {
      updateData.ExcludeFromTotal = data.ExcludeFromTotal;
    }

    if (Object.keys(updateData).length === 0) {
      return 'No valid fields to update';
    }

    await LevelPackLevel.update(updateData, {
      where: { LevelPackLevelIndex: data.LevelPackLevelIndex },
    });
    return true;
  }
  return 'This is not your level pack';
};

router
  .post('/sort', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      try {
        const sort = await SortPack({
          ...req.body,
          KuskiIndex: auth.userid,
          mod: auth.mod,
        });
        if (sort === true) {
          res.json({ success: 1 });
        } else {
          res.json({
            success: 0,
            error: sort,
          });
        }
      } catch (error) {
        res.json({
          success: 0,
          error: 'Internal server error: ' + error.message,
        });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/deleteLevel', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const del = await DeleteLevel({
        ...req.body,
        KuskiIndex: auth.userid,
        mod: auth.mod,
      });
      if (del) {
        res.json({ success: 1 });
      } else {
        res.json({ success: 0, error: 'This is not your level pack' });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/addLevel', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const add = await AddLevel({
        ...req.body,
        KuskiIndex: auth.userid,
        mod: auth.mod,
      });
      if (add) {
        res.json({ success: 0, error: add });
      } else {
        res.json({ success: 1 });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/sortLevel', async (req, res) => {
    // DEPRECATED: Use POST /sort with levelOrder array instead
    res.status(410).json({
      success: 0,
      error:
        'This endpoint is deprecated. Use POST /sort with a levelOrder array instead.',
      deprecated: true,
    });
  })
  .post('/updateLevel', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      try {
        const update = await UpdateLevel({
          ...req.body,
          KuskiIndex: auth.userid,
          mod: auth.mod,
        });

        if (update === true) {
          res.json({ success: 1 });
        } else {
          res.json({ success: 0, error: update });
        }
      } catch (error) {
        res.json({
          success: 0,
          error: 'Internal server error: ' + error.message,
        });
      }
    } else {
      res.sendStatus(401);
    }
  });

export default router;
