import express from 'express';
import { uploadReplayS3, uploadCupReplay, uploadFileS3 } from '#utils/upload';
import { authContext } from '#utils/auth';

const app = express.Router();

app.post('/replay', async (req, res) => {
  const { file, uuid, time, finished, LevelIndex, error, MD5, replayInfo } =
    await uploadReplayS3(req.files.file, 'replays', req.body.filename);
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
});

app.post('/cupreplay', async (req, res) => {
  const getAuth = authContext(req);
  if (getAuth.auth) {
    const result = await uploadCupReplay(
      req.files.file,
      req.body.filename,
      getAuth.userid,
      req.body.share,
      req.body.comment,
    );
    res.json(result);
  } else {
    res.sendStatus(401);
  }
});

app.post('/file', async (req, res) => {
  const getAuth = authContext(req);
  const result = await uploadFileS3(
    req.files.file,
    'files',
    req.body.filename,
    getAuth.userid,
  );
  res.json(result);
});

export default app;
