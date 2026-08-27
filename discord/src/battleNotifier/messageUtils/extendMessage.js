import { DMChannel, DiscordAPIError } from 'discord.js';
import readUserMessage from './readUserMessage.js';

const sendUser = async ({ user, message, fallbackChannel }) => {
  let sendError = null;
  let botMessage = null;

  try {
    botMessage = await user.send(message);
  } catch (error) {
    if (error instanceof DiscordAPIError) {
      sendError = error;
    } else {
      throw error;
    }

    if (sendError) {
      const fallbackMessage = `${user} ${message}`;
      botMessage = await fallbackChannel.send(fallbackMessage);
    }
  }

  return botMessage;
};

const extendMessageSend = (userMessage, fallbackChannel) => async message => {
  let botMessage = null;

  const isDMChannel = userMessage.channel instanceof DMChannel;
  if (isDMChannel) {
    botMessage = await userMessage.channel.send(message);
  } else {
    const user = userMessage.author;
    botMessage = await sendUser({ user, message, fallbackChannel });
  }

  const { channel } = botMessage;
  channel.readUserMessage = readUserMessage(channel);
  return botMessage;
};

const extendUserSend = (user, fallbackChannel) => async message => {
  const botMessage = await sendUser({ user, message, fallbackChannel });
  const { channel } = botMessage;
  channel.readUserMessage = readUserMessage(channel);
  return botMessage;
};

const extendUser = (user, fallbackChannel) => {
  return { ...user, send: extendUserSend(user, fallbackChannel) };
};

const extendMessage = (message, fallbackChannel) => {
  return {
    ...message,
    client: message.client,
    react: message.react,
    send: extendMessageSend(message, fallbackChannel),
    author: extendUser(message.author, fallbackChannel),
  };
};

export default extendMessage;
