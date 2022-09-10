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

const sendMessageApi = data => api.post('sendmessage', data);
const sendNotification = data => api.post('sendnotification', data);
const gameEvent = data => api.post('gameevent', data);

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
