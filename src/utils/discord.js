import { create } from 'apisauce';
import config from '../config';

const api = create({
  baseURL: config.discord.botApi,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    Authorization: config.discord.botApiAuth,
  },
});

const hasBotApi = config.discord.botApi && config.discord.botApiAuth;

const sendMessageApi = data => {
  if (hasBotApi) {
    return api.post('sendmessage', data);
  }
  return { ok: false };
};

const sendNotification = data => {
  if (hasBotApi) {
    return api.post('sendnotification', data);
  }
  return { ok: false };
};

const gameEvent = data => {
  if (hasBotApi) {
    return api.post('gameevent', data);
  }
  return { ok: false };
};

export const sendMessage = async (channel, message) => {
  const post = await sendMessageApi({ channel, message });
  return post.ok;
};

export const discordNotification = async (discordId, type, meta) => {
  const post = await sendNotification({ discordId, type, meta });
  return post.ok;
};

export const discordChatline = async body => {
  const post = await gameEvent({ ...body });
  return post.ok;
};

export const discordBesttime = async body => {
  const post = await gameEvent({ ...body });
  return post.ok;
};

export const discordBestmultitime = async body => {
  const post = await gameEvent({ ...body });
  return post.ok;
};

export const discordBattlestart = async body => {
  const post = await gameEvent({ ...body });
  return post.ok;
};

export const discordBattlequeue = async body => {
  const post = await gameEvent({ ...body });
  return post.ok;
};

export const discordBattleresults = async body => {
  const post = await gameEvent({ ...body });
  return post.ok;
};

export const discordBattleEnd = async body => {
  const post = await gameEvent({ ...body });
  return post.ok;
};
