import express from 'express';
import stream from 'stream';
import { authContext } from '#utils/auth';
import request from 'request';
import config from './config.js';
import {
  getReplayByBattleId,
  getLevel,
  getLevelPack,
  getReplayByCupTimeId,
  getEventReplays,
  getAllShirts,
  getShirtByKuskiId,
} from '#utils/download';

const app = express.Router();

app.get('/battlereplay/:id', async (req, res, next) => {
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

app.get('/allshirts', async (req, res, next) => {
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

app.get('/shirt/:id', async (req, res, next) => {
  try {
    const { file, filename, error } = await getShirtByKuskiId(req.params.id);
    if (error) {
      next({
        status: 404,
        msg: error,
      });
    } else {
      const readStream = new stream.PassThrough();
      readStream.end(file);
      res.set({
        'Content-disposition': `attachment; filename=${filename}`,
        'Content-Type': 'image/png',
      });
      readStream.pipe(res);
    }
  } catch (e) {
    next({
      status: 500,
      msg: e.message,
    });
  }
});

app.get('/cupreplay/:id/:filename/:code?', async (req, res, next) => {
  try {
    const { file, filename, MD5, UUID, TimeIndex } = await getReplayByCupTimeId(
      req.params.id,
      req.params.filename,
      req.params.code,
    );
    if (MD5 && UUID && TimeIndex) {
      res.set({
        'Content-disposition': `attachment; filename=${filename}`,
        'Content-Type': 'application/octet-stream',
      });
      request
        .get(
          `https://eol.ams3.digitaloceanspaces.com/${config.s3SubFolder}time/${UUID}-${MD5}/${TimeIndex}.rec`,
        )
        .pipe(res);
      return;
    }
    if (file) {
      const readStream = new stream.PassThrough();
      readStream.end(file);
      res.set({
        'Content-disposition': `attachment; filename=${filename}`,
        'Content-Type': 'application/octet-stream',
      });
      readStream.pipe(res);
      return;
    }
    next({ status: 404, msg: 'file not found' });
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

app.get('/level/:id', async (req, res, next) => {
  try {
    const { file, filename } = await getLevel(req.params.id);
    const readStream = new stream.PassThrough();
    readStream.end(file);
    res.set({
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Type': 'application/octet-stream',
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });
    readStream.pipe(res);
  } catch (e) {
    next({
      status: 403,
      msg: e.message,
    });
  }
});

app.get('/pack/:name', async (req, res, next) => {
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

app.get('/eventrecs/:event/:filename', async (req, res, next) => {
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

export default app;
