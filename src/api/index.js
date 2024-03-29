import express from 'express';
import ReplayComment from './replay_comment';
import ReplayRating from './replay_rating';
import Replay from './replay';
import Country from './country';
import Register from './register';
import ChatLog from './chatlog';
import Cups from './cups';
import KuskiMap from './kuskimap';
import AllFinished from './allfinished';
import LevelPack from './levelpack';
import Besttime from './besttime';
import Battle from './battle';
import BattleLeague from './battleleague';
import Player from './player';
import Teams from './teams';
import Level from './level';
import Ranking from './ranking';
import Mod from './mod';
import News from './news';
import Donate from './donate';
import Upload from './upload';
import Tag from './tag';
import Notification from './notification';
import LevelStats from './levelstats';
import Crippled from './crippled';
import Recap from './recap';

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
  .use('/recap', Recap);

export default router;
