import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import discord, {
  sendMessage,
  discordNotification,
  discordChatline,
  discordBesttime,
  discordBestmultitime,
  discordBattlestart,
  discordBattlequeue,
  discordBattleresults,
  discordBattleEnd,
} from './src/discord.js';
import config from './src/config.js';

// start express and middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// start discord bot
discord();

const checkAuth = (req, res, next) => {
  if (req.header('Authorization') === config.auth) {
    return next();
  }
  return res.sendStatus(401);
};

// endpoints
app.post('/sendmessage', checkAuth, (req, res) => {
  const channelId = config.discord?.channels?.[req.body.channel];
  if (channelId) {
    sendMessage(channelId, req.body.message);
    res.sendStatus(201);
    return;
  }
  res.sendStatus(400);
});

app.post('/sendnotification', checkAuth, async (req, res) => {
  if (req.body.discordId && req.body.type && req.body.meta) {
    await discordNotification(req.body.discordId, req.body.type, req.body.meta);
    res.sendStatus(201);
    return;
  }
  res.sendStatus(400);
});

app.post('/gameevent', checkAuth, (req, res) => {
  const types = {
    API_chatline: discordChatline,
    API_besttime: discordBesttime,
    API_bestmultitime: discordBestmultitime,
    API_battlestart: discordBattlestart,
    API_battleresults: discordBattleresults,
    API_battlequeue: discordBattlequeue,
    API_battleend: discordBattleEnd,
  };
  if (types[req.body.event]) {
    types[req.body.event](req.body);
    res.sendStatus(201);
    return;
  }
  res.sendStatus(400);
});

app.get('*', (req, res) => {
  res.send('Oh, I exist? I thought I felt different today.');
});

app.listen(config.port, () =>
  // eslint-disable-next-line no-console
  console.log(`Example app is listening on port ${config.port}.`),
);
