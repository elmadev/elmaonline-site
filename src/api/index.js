import express from 'express';
import ReplayComment from './replay_comment.js';
import ReplayRating from './replay_rating.js';
import Replay from './replay.js';
import Country from './country.js';
import Register from './register.js';
import ChatLog from './chatlog.js';
import Cups from './cups.js';
import KuskiMap from './kuskimap.js';
import AllFinished from './allfinished.js';
import LevelPack from './levelpack.js';
import Besttime from './besttime.js';
import Battle from './battle.js';
import BattleLeague from './battleleague.js';
import Player from './player.js';
import Teams from './teams.js';
import Level from './level.js';
import Ranking from './ranking.js';
import Mod from './mod.js';
import TasWr from './taswr.js';
import News from './news.js';
import Donate from './donate.js';
import Upload from './upload.js';
import Tag from './tag.js';
import Notification from './notification.js';
import LevelStats from './levelstats.js';
import Crippled from './crippled.js';
import Recap from './recap.js';

const router = express.Router();

router
  .get('/', (req, res) => {
    res.json({ derp: 'derp' });
  })
  .use('/replay_comment', ReplayComment)
  .use('/replay_rating', ReplayRating)
  .use('/replay', Replay)
  .use('/country', Country)
  .use('/register', Register)
  .use('/ranking', Ranking)
  .use('/chatlog', ChatLog)
  .use('/cups', Cups)
  .use('/kuskimap', KuskiMap)
  .use('/allfinished', AllFinished)
  .use('/levelpack', LevelPack)
  .use('/level', Level)
  .use('/mod', Mod)
  .use('/besttime', Besttime)
  .use('/battle', Battle)
  .use('/BattleLeague', BattleLeague)
  .use('/player', Player)
  .use('/news', News)
  .use('/teams', Teams)
  .use('/donate', Donate)
  .use('/upload', Upload)
  .use('/tag', Tag)
  .use('/notification', Notification)
  .use('/levelstats', LevelStats)
  .use('/crippled', Crippled)
  .use('/recap', Recap)
  .use('/taswr', TasWr);

export default router;
