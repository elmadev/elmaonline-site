import { DiscordAPIError } from 'discord.js';
import createBnStore from './bnStore/index.js';
import bnCommand from './bnCommand/index.js';
import { getSubscribedUserIds } from './notifyBattle.js';
import { extendMessage } from './messageUtils/index.js';
import logger from '../logger.js';

const logNotifyUserError = error => {
  logger.log({
    action: 'notify-user-send',
    message: error.message || error,
    stack: error.stack,
  });
};

const battleNotifier = ({ bnStorePath, client, fallbackChannelId }) => {
  const store = createBnStore(bnStorePath);

  const getFallbackChannel = () => client.channels.cache.get(fallbackChannelId);

  const notifyUsers = async ({ userIds, message }) => {
    await Promise.all(
      userIds.map(async userId => {
        let user;
        try {
          user = await client.users.fetch(userId);
          await user.send(message);
        } catch (error) {
          if (error instanceof DiscordAPIError) {
            return;
          } else {
            logNotifyUserError(error);
          }
        }
      }),
    );
  };

  const notifyBattle = async (battle, message) => {
    const userIds = await getSubscribedUserIds({ battle, store });
    await notifyUsers({ userIds, message });
  };

  const handleMessage = async ({ message: discordMessage, args }) => {
    const message = extendMessage(discordMessage, getFallbackChannel());
    await bnCommand.execute({ message, args, store });
  };

  return {
    commandName: bnCommand.name,
    handleMessage,
    notifyBattle,
  };
};

export default battleNotifier;
