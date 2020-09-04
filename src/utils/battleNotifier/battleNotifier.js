const createBnStore = require('./bnStore');
const bnCommand = require('./bnCommand');
const { getSubscribedUserIds } = require('./notifyBattle');

const battleNotifier = ({ bnStorePath, client }) => {
  const store = createBnStore(bnStorePath);

  const notifyBattle = async (battle, message) => {
    const userIds = await getSubscribedUserIds({ battle, store });
    Promise.all(
      userIds.map(async userId => {
        const user = await client.fetchUser(userId);
        await user.send(message);
      }),
    );
  };

  const handleMessage = async ({ message, args }) => {
    await bnCommand.execute({ message, args, store });
  };

  return {
    commandName: bnCommand.name,
    handleMessage,
    notifyBattle,
  };
};

module.exports = battleNotifier;
