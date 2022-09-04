import express from 'express';
import { Op } from 'sequelize';
import { authContext } from '#utils/auth';
import { like } from '#utils/database';
import {
  Kuski,
  LevelPackCollection,
  LevelPackCollectionPack,
  LevelPack,
} from '../data/models';

const router = express.Router();

const GetCollections = async () => {
  const colls = await LevelPackCollection.findAll();
  return colls;
};

const AddColl = async data => {
  const add = await LevelPackCollection.create(data);
  return add;
};

const GetCollection = async CollectionName => {
  const coll = await LevelPackCollection.findOne({
    where: { CollectionName },
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
  });
  return coll;
};

const GetCollectionPacks = async LevelPackCollectionIndex => {
  const packs = await LevelPackCollectionPack.findAll({
    where: { LevelPackCollectionIndex },
    include: [
      {
        model: LevelPack,
        as: 'PackData',
      },
    ],
  });
  return packs;
};

const SearchPacks = async query => {
  const packs = await LevelPack.findAll({
    where: {
      [Op.or]: {
        LevelPackName: { [Op.like]: `${like(query)}%` },
        LevelPackLongName: { [Op.like]: `${like(query)}%` },
      },
    },
    limit: 25,
  });
  return packs;
};

const AddPack = async data => {
  const coll = await LevelPackCollection.findOne({
    where: { LevelPackCollectionIndex: data.LevelPackCollectionIndex },
  });
  if (coll.KuskiIndex === data.KuskiIndex || data.mod) {
    await LevelPackCollectionPack.create({
      LevelPackCollectionIndex: data.LevelPackCollectionIndex,
      LevelPackIndex: data.LevelPackIndex,
    });
    return '';
  }
  return 'This is not your collection';
};

const DeletePack = async data => {
  const coll = await LevelPackCollection.findOne({
    where: { LevelPackCollectionIndex: data.LevelPackCollectionIndex },
  });
  if (coll.KuskiIndex === data.KuskiIndex || data.mod) {
    await LevelPackCollectionPack.destroy({
      where: {
        LevelPackCollectionIndex: data.LevelPackCollectionIndex,
        LevelPackIndex: data.LevelPackIndex,
      },
    });
    return '';
  }
  return 'This is not your collection';
};

router
  .get('/', async (req, res) => {
    const colls = await GetCollections();
    res.json(colls);
  })
  .post('/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const add = await AddColl({ ...req.body, KuskiIndex: auth.userid });
      res.json(add);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/search/:query', async (req, res) => {
    const packs = await SearchPacks(req.params.query);
    res.json(packs);
  })
  .post('/addpack', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const add = await AddPack({
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
  .post('/deletepack', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const del = await DeletePack({
        ...req.body,
        KuskiIndex: auth.userid,
        mod: auth.mod,
      });
      if (del) {
        res.json({ success: 0, error: del });
      } else {
        res.json({ success: 1 });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .get('/:name', async (req, res) => {
    const Collection = await GetCollection(req.params.name);
    const Packs = await GetCollectionPacks(
      Collection.dataValues.LevelPackCollectionIndex,
    );
    res.json({ Collection, Packs });
  });

export default router;
