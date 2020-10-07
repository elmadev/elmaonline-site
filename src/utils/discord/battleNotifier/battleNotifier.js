const createBnStore = require('./bnStore');
const bnCommand = require('./bnCommand');
const { getSubscribedUserIds } = require('./notifyBattle');
const { extendMessage } = require('./messageUtils');

const battleNotifier = ({ bnStorePath, client, fallbackChannelId }) => {
  const store = createBnStore(bnStorePath);

  const getFallbackChannel = () => client.channels.cache.get(fallbackChannelId);

  const notifyUsers = async ({ userIds, message }) => {
    const dmBlockedUserIds = [];
    await Promise.all(
      userIds.map(async userId => {
        const user = await client.users.fetch(userId);
        await user.send(message).catch(() => {
          dmBlockedUserIds.push(user);
        });
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
