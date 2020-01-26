import express from 'express';
import { Replay, Level, Kuski } from '../data/models';

const router = express.Router();

const getReplayByReplayId = async ReplayIndex => {
  const data = await Replay.findAll({
    where: { ReplayIndex },
  });
  return data;
};

const getReplayByDrivenBy = async KuskiIndex => {
  const data = await Replay.findAll({
    where: { DrivenBy: KuskiIndex },
    include: [
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
      },
      {
        model: Kuski,
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        as: 'DrivenByData',
      },
    ],
  });
  return data;
};

const getReplayByUploadedBy = async KuskiIndex => {
  const data = await Replay.findAll({
    where: { UploadedBy: KuskiIndex },
    include: [
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
      },
      {
        model: Kuski,
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        as: 'DrivenByData',
      },
    ],
  });
  return data;
};

router
  .get('/', (req, res) => {
    res.sendStatus(404);
  })
  .get('/:ReplayIndex', async (req, res) => {
    const data = await getReplayByReplayId(req.params.ReplayIndex);
    res.json(data);
  })
  .get('/driven_by/:KuskiIndex', async (req, res) => {
    const data = await getReplayByDrivenBy(req.params.KuskiIndex);
    res.json(data);
  })
  .get('/uploaded_by/:KuskiIndex', async (req, res) => {
    const data = await getReplayByUploadedBy(req.params.KuskiIndex);
    res.json(data);
  });

export default router;
