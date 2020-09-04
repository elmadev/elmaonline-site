const { emojis, responses } = require('../config');

const toggleBn = async ({ message, store, isOn }) => {
  const user = message.author;
  const userConfig = await store.get(user.id);
  if (userConfig) {
    await store.set(user.id, { isOn });
    message.react(emojis.ok);
  } else {
    message.react(emojis.error);
    user.send(responses.configNotFound);
  }
};

module.exports = toggleBn;
