import express from 'express';
import { authContext } from 'utils/auth';
import { LevelPackFavourite } from '../data/models';

const router = express.Router();

const AddFav = async data => {
  const add = await LevelPackFavourite.create(data);
  return add;
};

const RemoveFav = async data => {
  const remove = await LevelPackFavourite.destroy({ where: data });
  return remove;
};

const GetFavs = async KuskiIndex => {
  const favs = await LevelPackFavourite.findAll({
    where: { KuskiIndex },
  });
  return favs;
};

router
  .get('/', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const favs = await GetFavs(auth.userid);
      res.json(favs);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const add = await AddFav({ ...req.body, KuskiIndex: auth.userid });
      res.json(add);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/remove', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const remove = await RemoveFav({ ...req.body, KuskiIndex: auth.userid });
      res.json(remove);
    } else {
      res.sendStatus(401);
    }
  });

export default router;
