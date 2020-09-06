const { responses } = require('../config');

const toggleBn = async ({ message, store, isOn }) => {
  const user = message.author;
  const userConfig = await store.get(user.id);
  if (userConfig) {
    await store.set(user.id, { isOn });
    await message.author.send(
      `Your configuration is now ${isOn ? 'ON' : 'OFF'}`,
    );
  } else {
    user.send(responses.configNotFound);
  }
};

module.exports = toggleBn;
