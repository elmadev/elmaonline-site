import express from 'express';
import { authContext } from 'utils/auth';
import { omit } from 'lodash';
import { ReplayRating } from '../data/models';

const router = express.Router();

const getReplayRatingsByReplayId = async ReplayIndex => {
  const query = {
    where: { ReplayIndex },
  };
  if (ReplayIndex.includes('b-')) {
    query.where = { BattleIndex: ReplayIndex.split('-')[1] };
  } else if (ReplayIndex.includes('_')) {
    query.where = { UUID: ReplayIndex };
  }
  const data = await ReplayRating.findAll(query);
  return data;
};

const addReplayRating = async Data => {
  const find = { ...Data };
  let NewReplayRating = false;
  if (typeof Data.ReplayIndex === 'string') {
    if (Data.ReplayIndex.includes('b-')) {
      find.ReplayIndex = 0;
      find.BattleIndex = Data.ReplayIndex.split('-')[1];
    } else if (Data.ReplayIndex.includes('_')) {
      find.ReplayIndex = 0;
      find.UUID = Data.ReplayIndex;
    }
  }
  NewReplayRating = await ReplayRating.findOne({
    where: {
      KuskiIndex: find.KuskiIndex,
      ...omit(find, ['Vote']),
    },
  });
  if (NewReplayRating) {
    await NewReplayRating.update(find);
  } else {
    await ReplayRating.create(find);
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
