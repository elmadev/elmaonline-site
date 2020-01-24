import express from 'express';
import ReplayComment from './replay_comment';
import ReplayRating from './replay_rating';

const router = express.Router();

router
  .get('/', (req, res) => {
    res.json({ derp: 'derp' });
  })
  .use('/replay_comment', ReplayComment)
  .use('/replay_rating', ReplayRating);

export default router;
