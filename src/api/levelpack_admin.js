import express from 'express';
import { authContext } from 'utils/auth';
import { forEach } from 'lodash';
import { eachSeries } from 'neo-async';
import { firstEntry, lastEntry, inBetween } from 'utils/sort';
import { LevelPackLevel, LevelPack, Level } from '../data/models';

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
  if (pack.KuskiIndex === data.KuskiIndex || data.mod) {
    const updateBulk = [];
    let Sort = '';
    forEach(data.levels, l => {
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
  if (pack.KuskiIndex === data.KuskiIndex || data.mod) {
    const { LevelIndex } = data.levels[data.source.index];
    const beforeIndex =
      data.destination.index === 0
        ? data.destination.index
        : data.destination.index - 1;
    const midIndex = data.destination.index;
    const afterIndex =
      data.destination.index === data.levels.length - 1
        ? data.destination.index
        : data.destination.index + 1;
    let Sort = '';
    if (data.source.index > data.destination.index) {
      Sort = inBetween(
        data.levels[beforeIndex].Sort,
        data.levels[midIndex].Sort,
        -1,
      );
    } else {
      Sort = inBetween(
        data.levels[midIndex].Sort,
        data.levels[afterIndex].Sort,
        1,
      );
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
  });

export default router;
