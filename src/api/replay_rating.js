import express from 'express';
import { authContext } from 'utils/auth';
import { ReplayRating } from '../data/models';

const router = express.Router();

const getReplayRatingsByReplayId = async ReplayIndex => {
  const data = await ReplayRating.findAll({
    where: { ReplayIndex },
  });
  return data;
};

const addReplayRating = async Data => {
  let NewReplayRating = false;
  NewReplayRating = await ReplayRating.findOne({
    where: { KuskiIndex: Data.KuskiIndex, ReplayIndex: Data.ReplayIndex },
  });
  if (NewReplayRating) {
    await NewReplayRating.update(Data);
  } else {
    await ReplayRating.create(Data);
  }
  return NewReplayRating;
};

router
  .get('/', (req, res) => {
    res.sendStatus(404);
  })
  .get('/:ReplayIndex', async (req, res) => {
    const data = await getReplayRatingsByReplayId(req.params.ReplayIndex);
    res.json(data);
  })
  .post('/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await addReplayRating({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  });

export default router;
