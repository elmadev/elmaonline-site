import { messages } from '../config.js';

const toggleBn = async ({ message, store, isOn }) => {
  const user = message.author;
  const userConfig = await store.get(user.id);
  if (userConfig) {
    await store.set(user.id, { isOn });
    await message.author.send(
      `Your notifications are now ${isOn ? 'ON' : 'OFF'}`,
    );
  } else {
    user.send(messages.configNotFound);
  }
};

export default toggleBn;
