import express from 'express';
import { authContext } from '#utils/auth';
import { forEach } from 'lodash-es';
import neoAsync from 'neo-async';
const { eachSeries } = neoAsync;
import { firstEntry, lastEntry, inBetween } from '#utils/sort';
import { LevelPackLevel, LevelPack, Level } from '#data/models';

const router = express.Router();

const SortPackUpdate = async (data, done) => {
  await LevelPackLevel.update(
    { Sort: data.Sort },
    { where: { LevelPackLevelIndex: data.LevelPackLevelIndex } },
  );
  done();
};

const SortPack = async data => {
  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
  });
  const levels = await LevelPackLevel.findAll({
    where: { LevelPackIndex: data.LevelPackIndex },
  });
  if (pack.KuskiIndex === data.KuskiIndex || data.mod) {
    const updateBulk = [];
    let Sort = '';
    forEach(levels, l => {
      if (!Sort) {
        Sort = firstEntry();
      } else {
        Sort = lastEntry(Sort);
      }
      updateBulk.push({ LevelPackLevelIndex: l.LevelPackLevelIndex, Sort });
    });
    await eachSeries(updateBulk, SortPackUpdate);
    return true;
  }
  return false;
};

const AddLevel = async data => {
  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
  });
  const level = await Level.findOne({
    where: { LevelIndex: data.LevelIndex },
  });
  if (level.Locked) {
    return 'Level is locked.';
  }
  if (level.Hidden) {
    return 'Level is hidden.';
  }
  if (pack.KuskiIndex === data.KuskiIndex || data.mod) {
    let Sort = '';
    if (data.levels > 0) {
      Sort = lastEntry(data.last.Sort);
    } else {
      Sort = firstEntry();
    }
    await LevelPackLevel.create({
      LevelPackIndex: data.LevelPackIndex,
      LevelIndex: data.LevelIndex,
      LevelName: level.LevelName,
      Sort,
    });
    return '';
  }
  return 'This is not your level pack';
};

const SortLevel = async data => {
  const pack = await LevelPack.findOne({
    where: { LevelPackIndex: data.LevelPackIndex },
  });
  const levels = await LevelPackLevel.findAll({
    where: { LevelPackIndex: data.LevelPackIndex },
    order: ['Sort'],
  });
  if (pack.KuskiIndex === data.KuskiIndex || data.mod) {
    const { LevelIndex } = levels[data.source.index];
    const beforeIndex =
      data.destination.index === 0
        ? data.destination.index
        : data.destination.index - 1;
    const midIndex = data.destination.index;
    const afterIndex =
      data.destination.index === levels.length - 1
        ? data.destination.index
        : data.destination.index + 1;
    let Sort = '';
    if (data.source.index > data.destination.index) {
      Sort = inBetween(levels[beforeIndex].Sort, levels[midIndex].Sort, -1);
    } else {
      Sort = inBetween(levels[midIndex].Sort, levels[afterIndex].Sort, 1);
    }
    await LevelPackLevel.update(
      { Sort },
      {
        where: { LevelPackIndex: data.LevelPackIndex, LevelIndex },
      },
    );
    return true;
  }
  return false;
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
      const sort = await SortPack({
        ...req.body,
        KuskiIndex: auth.userid,
        mod: auth.mod,
      });
      if (sort) {
        res.json({ success: 1 });
      } else {
        res.json({ success: 0, error: 'This is not your level pack' });
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
    const auth = authContext(req);
    if (auth.auth) {
      const sort = await SortLevel({
        ...req.body,
        KuskiIndex: auth.userid,
        mod: auth.mod,
      });
      if (sort) {
        res.json({ success: 1 });
      } else {
        res.json({ success: 0, error: 'This is not your level pack' });
      }
    } else {
      res.sendStatus(401);
    }
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
        console.error('Error in updateLevel:', error);
        res.json({ success: 0, error: 'Internal server error: ' + error.message });
      }
    } else {
      res.sendStatus(401);
    }
  });

export default router;
