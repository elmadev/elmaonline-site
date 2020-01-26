import express from 'express';
import ReplayComment from './replay_comment';
import ReplayRating from './replay_rating';
import Replay from './replay';

const router = express.Router();

router
  .get('/', (req, res) => {
    res.json({ derp: 'derp' });
  })
  .use('/replay_comment', ReplayComment)
  .use('/replay_rating', ReplayRating)
  .use('/replay', Replay);

export default router;
