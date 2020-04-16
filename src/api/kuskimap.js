import express from 'express';
import { authContext } from 'utils/auth';
import { KuskiMap, Kuski } from '../data/models';

const router = express.Router();

const getMarkers = async () => {
  const data = await KuskiMap.findAll({
    include: [
      {
        model: Kuski,
        attributes: ['Kuski'],
        as: 'KuskiData',
      },
    ],
  });
  return data;
};

const addMarker = async Data => {
  let newMarker = false;
  newMarker = await KuskiMap.findOne({
    where: { KuskiIndex: Data.KuskiIndex },
  });
  if (newMarker) {
    await newMarker.update(Data);
  } else {
    await KuskiMap.create(Data);
  }
  return newMarker;
};

router
  .get('/', async (req, res) => {
    const data = await getMarkers();
    res.json(data);
  })
  .post('/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const add = await addMarker({ ...req.body, KuskiIndex: auth.userid });
      res.json(add);
    } else {
      res.sendStatus(401);
    }
  });

export default router;
