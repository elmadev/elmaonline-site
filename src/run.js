import express from 'express';
import config from './config.js';
import {
  doAll as doAllLevelStats,
  doNext as doNextLevelStats,
} from '#utils/levelstats';
import { LevelStats, LevelStatsUpdate } from '#data/models';
import { updateRanking, deleteRanking } from '#utils/ranking';
import { email, legacyTimes, orderLevels } from '#utils/dataImports';
import { recapGenerate } from '#utils/recap';
import { coldStorage, recoverRecFiles } from '#utils/timefile';

const app = express.Router();

// cron
app.get('/levelstats/do-next/:limit', async (req, res) => {
  if (req.header('Authorization') === config.run.playStats) {
    const limit = +req.params.limit;
    const result = await doNextLevelStats(limit);
    res.json({
      result,
    });
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

app.get('/levelstats/sync', async (req, res) => {
  if (req.header('Authorization') === config.run.playStats) {
    await LevelStats.sync({ alter: false });
    await LevelStatsUpdate.sync({ alter: false });
    res.json('Success');
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

// destructive, and very slow
app.get('/levelstats/do-all/:batchSize/:sleepMs', async (req, res) => {
  if (req.header('Authorization') === config.run.playStats) {
    res.json({ status: 'started' });
    await doAllLevelStats(+req.params.batchSize, +req.params.sleepMs);
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

// ranking
app.get('/ranking/delete', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    const data = await deleteRanking();
    res.json({ deleted: data });
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});
app.get('/ranking/:limit', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    const limit = Math.round(
      Math.min(parseInt(req.params.limit, 10), 10000) / 10,
    );
    res.json({ status: 'started' });
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
    await updateRanking(limit);
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

// data imports
app.get('/email', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    await email();
    res.json({ status: 'done' });
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});
app.get('/legacytimes/:strategy', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    res.json({ started: true });
    await legacyTimes(req.params.strategy);
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

app.get('/orderlevels', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    try {
      const result = await orderLevels();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

// recaps
app.get('/recap/:type/:year', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    await recapGenerate(req.params.type, req.params.year);
    res.sendStatus(200);
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

app.get('/coldstorage', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    const data = await coldStorage();
    res.json(data);
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

app.get('/recoverfiles', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    const data = await recoverRecFiles();
    res.json(data);
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

export default app;
