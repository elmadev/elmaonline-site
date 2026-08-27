import logger from '../../logger.js';
import {
  setBn,
  getBn,
  toggleBn,
  helpBn,
  aliasBn,
  rulesBn,
  testBn,
} from './subCommands/index.js';
import { TimeOutError } from '../messageUtils/index.js';
import { emojis, messages } from './config.js';

const noCommandFound = async message => {
  await message.react(emojis.notFound);
  await message.channel.send(messages.seeAvailableCommands);
};

export default {
  name: 'bn',
  execute: async ({ message, args, store }) => {
    const user = message.author;
    const subCommand = args && args[0] && args[0].toLowerCase();

    try {
      if (!subCommand) {
        await setBn({ message, store });
      } else if (subCommand === 'get') {
        await getBn({ user, store, args });
      } else if (subCommand === 'on') {
        await toggleBn({ message, store, isOn: true });
      } else if (subCommand === 'off') {
        await toggleBn({ message, store, isOn: false });
      } else if (subCommand === 'help') {
        await helpBn(user);
      } else if (subCommand === 'alias') {
        await aliasBn(user);
      } else if (subCommand === 'rules') {
        await rulesBn(user);
      } else if (subCommand === 'test') {
        await testBn({ message, store });
      } else {
        await noCommandFound(message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof TimeOutError
          ? error.message
          : `${messages.somethingWentWrong}\n${messages.seeAvailableCommands}`;
      user.send(errorMessage);

      logger.log({
        userName: user.username,
        userId: user.id,
        action: subCommand || 'set',
        message: error.message || error,
        stack: error.stack,
      });
    }
  },
};
