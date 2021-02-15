import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import PrettyError from 'pretty-error';
import stream from 'stream';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import {
  getReplayByBattleId,
  getLevel,
  getLevelPack,
  getReplayByCupTimeId,
  getEventReplays,
  getAllShirts,
  getShirtByKuskiId,
} from 'utils/download';
import { uploadReplayS3, uploadCupReplay } from 'utils/upload';
import {
  chatline,
  besttime,
  bestmultitime,
  battlestart,
  battlequeue,
  battleend,
  battleresults,
  eventsFile,
} from 'utils/events';
import { discord } from 'utils/discord';
import { auth, authContext } from 'utils/auth';
import { kuskimap, email, legacyTimes } from 'utils/dataImports';
import { updateRanking, deleteRanking } from './ranking';
import config from './config';
import apiRoutes from './api';

const app = express();

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '10mb' }));

//
// Authentication
// -----------------------------------------------------------------------------

if (__DEV__) {
  app.enable('trust proxy');
}

app.post('/token', async (req, res) => {
  const authResponse = await auth(req.body);
  res.json({ Response: authResponse });
});

//
// Rest API
//--------------------------------------------
app.use('/api', apiRoutes);

//
// Events API
//--------------------------------------------
app.post('/events/chatline', (req, res) => {
  chatline(req, res);
});
app.post('/events/besttime', (req, res) => {
  besttime(req, res);
});
app.post('/events/bestmultitime', (req, res) => {
  bestmultitime(req, res);
});
app.post('/events/battlestart', (req, res) => {
  battlestart(req, res);
});
app.post('/events/battlequeue', (req, res) => {
  battlequeue(req, res);
});
app.post('/events/battleend', (req, res) => {
  battleend(req, res);
});
app.post('/events/battleresults', (req, res) => {
  battleresults(req, res);
});
app.post('/events/file', (req, res) => {
  eventsFile(req, res);
});

//
// Discord bot
//--------------------------------------------
discord();

//
// Downloading files
//--------------------------------------------
app.get('/dl/battlereplay/:id', async (req, res, next) => {
  try {
    const { file, filename } = await getReplayByBattleId(req.params.id);
    const readStream = new stream.PassThrough();
    readStream.end(file);
    res.set({
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Type': 'application/octet-stream',
    });
    readStream.pipe(res);
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

app.get('/dl/allshirts', async (req, res, next) => {
  try {
    const files = await getAllShirts();
    const readStream = new stream.PassThrough();
    readStream.end(files);
    res.set({
      'Content-disposition': `attachment; filename=Shirts.zip`,
      'Content-Type': 'application/octet-stream',
    });
    readStream.pipe(res);
  } catch (e) {
    next({ msg: e.message, status: 430 });
  }
});

app.get('/dl/shirt/:id', async (req, res, next) => {
  try {
    const { file, filename } = await getShirtByKuskiId(req.params.id);
    const readStream = new stream.PassThrough();
    readStream.end(file);
    res.set({
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Type': 'image/png',
    });
    readStream.pipe(res);
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

app.get('/dl/cupreplay/:id/:filename', async (req, res, next) => {
  try {
    const { file, filename } = await getReplayByCupTimeId(
      req.params.id,
      req.params.filename,
    );
    const readStream = new stream.PassThrough();
    readStream.end(file);
    res.set({
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Type': 'application/octet-stream',
    });
    readStream.pipe(res);
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

app.get('/dl/cupreplay/:id/:filename/:code', async (req, res, next) => {
  try {
    const { file, filename } = await getReplayByCupTimeId(
      req.params.id,
      req.params.filename,
      req.params.code,
    );
    const readStream = new stream.PassThrough();
    readStream.end(file);
    res.set({
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Type': 'application/octet-stream',
    });
    readStream.pipe(res);
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

app.get('/dl/level/:id', async (req, res, next) => {
  try {
    const { file, filename } = await getLevel(req.params.id);
    const readStream = new stream.PassThrough();
    readStream.end(file);
    res.set({
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Type': 'application/octet-stream',
    });
    readStream.pipe(res);
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

app.get('/dl/pack/:name', async (req, res, next) => {
  try {
    const zipData = await getLevelPack(req.params.name);
    if (zipData) {
      const readStream = new stream.PassThrough();
      readStream.end(zipData);
      res.set({
        'Content-disposition': `attachment; filename=${req.params.name}.zip`,
        'Content-Type': 'application/octet-stream',
      });
      readStream.pipe(res);
    } else {
      next({
        status: 403,
        msg: 'Level pack does not exist.',
      });
    }
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

app.get('/dl/eventrecs/:event/:filename', async (req, res, next) => {
  try {
    const zipData = await getEventReplays(
      req.params.event,
      req.params.filename,
      authContext(req),
    );
    if (zipData) {
      const readStream = new stream.PassThrough();
      readStream.end(zipData);
      res.set({
        'Content-disposition': `attachment; filename=${req.params.filename}-all-recs.zip`,
        'Content-Type': 'application/octet-stream',
      });
      readStream.pipe(res);
    } else {
      next({
        status: 403,
        msg: 'Event does not exist or is not over.',
      });
    }
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

//
// ranking
//--------------------------------------------
app.get('/run/ranking/delete', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    const data = await deleteRanking();
    res.json({ deleted: data });
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});
app.get('/run/ranking/:limit', async (req, res) => {
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

//
// Data imports
// -------------------------------------------
app.get('/run/kuskimap', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    await kuskimap();
    res.json({ status: 'done' });
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});
app.get('/run/email', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    await email();
    res.json({ status: 'done' });
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});
app.get('/run/legacytimes/:strategy', async (req, res) => {
  if (req.header('Authorization') === config.run.ranking) {
    res.json({ started: true });
    await legacyTimes(req.params.strategy);
  } else {
    res.status(401);
    res.send('Unauthorized');
  }
});

//
// Uploading files
//--------------------------------------------
app.post('/upload/:type', async (req, res) => {
  const replayFile = req.files.file;
  let folder = 'misc';
  if (req.params.type === 'replay') {
    folder = 'replays';
    const {
      file,
      uuid,
      time,
      finished,
      LevelIndex,
      error,
      MD5,
      replayInfo,
    } = await uploadReplayS3(replayFile, folder, req.body.filename);
    if (!error) {
      res.json({
        file,
        uuid,
        time,
        finished,
        LevelIndex,
        MD5,
      });
    } else {
      res.json({
        error,
        replayInfo,
        file,
      });
    }
  }
  if (req.params.type === 'cupreplay') {
    folder = 'cupreplays';
    const getAuth = authContext(req);
    if (getAuth.auth) {
      const result = await uploadCupReplay(
        replayFile,
        req.body.filename,
        getAuth.userid,
        req.body.share,
        req.body.comment,
      );
      res.json(result);
    } else {
      res.sendStatus(401);
    }
  }
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    res.send(
      "<!doctype><html><body>I just don't have time to be responsible for every little thing that goes wrong in your life</body></html>",
    );
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  res.status(err.status || 500);
  res.send(err.msg);
});

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  // module.hot.accept('./router');
}

export default app;
