import express from 'express';
import ReplayComment from './replay_comment';

const router = express.Router();

router
  .get('/', (req, res) => {
    res.json({ derp: 'derp' });
  })
  .use('/replay_comment', ReplayComment);

export default router;
