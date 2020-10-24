const { DiscordAPIError } = require('discord.js');
const createBnStore = require('./bnStore');
const bnCommand = require('./bnCommand');
const { getSubscribedUserIds } = require('./notifyBattle');
const { extendMessage } = require('./messageUtils');
const logger = require('../logger');

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
    const dmBlockedUserIds = [];
    await Promise.all(
      userIds.map(async userId => {
        let user;
        try {
          user = await client.users.fetch(userId);
          await user.send(message);
        } catch (error) {
          if (error instanceof DiscordAPIError) {
            dmBlockedUserIds.push(user);
          } else {
            logNotifyUserError(error);
          }
        }
      }),
    );

    if (dmBlockedUserIds.length > 0) {
      const userMentions = dmBlockedUserIds.join(' ');
      const fallbackMessage = `${message}\n${userMentions}`;
      await getFallbackChannel().send(fallbackMessage);
    }
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

module.exports = battleNotifier;
