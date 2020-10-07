import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from 'utils/database';
import { Replay, Level, Kuski } from '../data/models';

const router = express.Router();

const getReplayByReplayId = async ReplayIndex => {
  const data = await Replay.findAll({
    where: { ReplayIndex, Unlisted: 0 },
  });
  return data;
};

const getReplayByDrivenBy = async KuskiIndex => {
  const data = await Replay.findAll({
    where: { DrivenBy: KuskiIndex, Unlisted: 0 },
    include: [
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'DrivenByData',
      },
    ],
  });
  return data;
};

const getReplayByUploadedBy = async KuskiIndex => {
  const data = await Replay.findAll({
    where: { UploadedBy: KuskiIndex, Unlisted: 0 },
    include: [
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'DrivenByData',
      },
    ],
  });
  return data;
};

const getReplaysSearchDriven = async (query, offset) => {
  const data = await Replay.findAll({
    limit: searchLimit(offset),
    offset: searchOffset(offset),
    where: { Unlisted: 0 },
    order: [['Uploaded', 'DESC']],
    include: [
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'DrivenByData',
        where: { Kuski: { [Op.like]: `${like(query)}%` } },
      },
    ],
  });
  return data;
};

const getReplaysSearchLevel = async (query, offset) => {
  const data = await Replay.findAll({
    limit: searchLimit(offset),
    offset: searchOffset(offset),
    order: [['ReplayTime', 'ASC']],
    where: { Unlisted: 0 },
    include: [
      {
        model: Level,
        attributes: ['LevelName'],
        as: 'LevelData',
        where: { LevelName: { [Op.like]: `${like(query)}%` } },
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'UploadedByData',
      },
      {
        model: Kuski,
        attributes: ['Kuski', 'Country'],
        as: 'DrivenByData',
      },
    ],
  });
  return data;
};

const getReplaysSearchFilename = async (query, offset) => {
  const replays = await Replay.findAll({
    offset: searchOffset(offset),
    where: {
      RecFileName: {
        [Op.like]: `${like(query)}%`,
      },
      Unlisted: 0,
    },
    limit: searchLimit(offset),
    order: [['RecFileName', 'ASC']],
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
  return replays;
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
  })
  .get('/search/byDriven/:query/:offset', async (req, res) => {
    const data = await getReplaysSearchDriven(
      req.params.query,
      req.params.offset,
    );
    res.json(data);
  })
  .get('/search/byLevel/:query/:offset', async (req, res) => {
    const data = await getReplaysSearchLevel(
      req.params.query,
      req.params.offset,
    );
    res.json(data);
  })
  .get('/search/byFilename/:query/:offset', async (req, res) => {
    const data = await getReplaysSearchFilename(
      req.params.query,
      req.params.offset,
    );
    res.json(data);
  });

export default router;
