/* import {
  discordChatline,
  discordBesttime,
  discordBestmultitime,
  discordBattlestart,
  discordBattlequeue,
  discordBattleresults,
  discordBattleEnd,
} from '#utils/discord'; */
import {
  createTimeBeatenNotification,
  createBestTimeNotification,
} from '#utils/notifications';
import { uploadTimeFile } from '#utils/upload';
import { updateRanking } from '#utils/ranking';
import { updateLeague } from './league';
import config from '../config';

const checkAuth = (req, res, callback) => {
  if (req.header('Authorization') === config.discord.apiAuth) {
    callback();
  } else {
    res.sendStatus(401);
  }
};

export function chatline(req, res) {
  checkAuth(req, res, () => {
    res.json({ success: 1 });
    // discordChatline(req.body);
  });
}

export function besttime(req, res) {
  checkAuth(req, res, () => {
    createBestTimeNotification(req.body);
    createTimeBeatenNotification(req.body);
    res.json({ success: 1 });
    // discordBesttime(req.body);
  });
}

export function bestmultitime(req, res) {
  checkAuth(req, res, () => {
    res.json({ success: 1 });
    // discordBestmultitime(req.body);
  });
}

export function battlestart(req, res) {
  checkAuth(req, res, () => {
    res.json({ success: 1 });
    // discordBattlestart(req.body);
  });
}

export function battlequeue(req, res) {
  checkAuth(req, res, () => {
    res.json({ success: 1 });
    // discordBattlequeue(req.body);
  });
}

export function battleend(req, res) {
  checkAuth(req, res, () => {
    res.json({ success: 1 });
    // discordBattleEnd(req.body);
  });
}

export function battleresults(req, res) {
  checkAuth(req, res, () => {
    res.json({ success: 1 });
    // discordBattleresults(req.body);
    updateRanking(10);
    updateLeague(req.body);
  });
}

export function eventsFile(req, res) {
  checkAuth(req, res, () => {
    res.json({ success: 1 });
    uploadTimeFile(
      req.body,
      req.header('TimeIndex'),
      req.header('BattleIndex'),
      req.header('Multi'),
    );
  });
}
