import fs from 'fs';
import moment from 'moment';

export function chatline(req, res) {
  fs.writeFile(
    `./events/chatline/${moment().format('X')}.json`,
    JSON.stringify(req.body),
    e => {
      if (e) {
        res.json({ success: 0, error: e });
      } else {
        res.json({ success: 1 });
      }
    },
  );
}

export function besttime(req, res) {
  fs.writeFile(
    `./events/besttime/${moment().format('X')}.json`,
    JSON.stringify(req.body),
    e => {
      if (e) {
        res.json({ success: 0, error: e });
      } else {
        res.json({ success: 1 });
      }
    },
  );
}

export function bestmultitime(req, res) {
  fs.writeFile(
    `./events/bestmultitime/${moment().format('X')}.json`,
    JSON.stringify(req.body),
    e => {
      if (e) {
        res.json({ success: 0, error: e });
      } else {
        res.json({ success: 1 });
      }
    },
  );
}

export function battlestart(req, res) {
  fs.writeFile(
    `./events/battlestart/${moment().format('X')}.json`,
    JSON.stringify(req.body),
    e => {
      if (e) {
        res.json({ success: 0, error: e });
      } else {
        res.json({ success: 1 });
      }
    },
  );
}

export function battlequeue(req, res) {
  fs.writeFile(
    `./events/battlequeue/${moment().format('X')}.json`,
    JSON.stringify(req.body),
    e => {
      if (e) {
        res.json({ success: 0, error: e });
      } else {
        res.json({ success: 1 });
      }
    },
  );
}

export function battleend(req, res) {
  fs.writeFile(
    `./events/battleend/${moment().format('X')}.json`,
    JSON.stringify(req.body),
    e => {
      if (e) {
        res.json({ success: 0, error: e });
      } else {
        res.json({ success: 1 });
      }
    },
  );
}

export function battleresults(req, res) {
  fs.writeFile(
    `./events/battleresults/${moment().format('X')}.json`,
    JSON.stringify(req.body),
    e => {
      if (e) {
        res.json({ success: 0, error: e });
      } else {
        res.json({ success: 1 });
      }
    },
  );
}
