const {
  setBn,
  getBn,
  toggleBn,
  helpBn,
  aliasBn,
  testBn,
} = require('./subCommands');
const { TimeOutError } = require('./messageUtils');
const { emojis } = require('./config');

const noCommandFound = async message => {
  await message.react(emojis.notFound);
  await message.channel.send('Use `!bn help` to see the available commands');
};

module.exports = {
  name: 'bn',
  execute: async ({ message, args, store }) => {
    const user = message.author;
    const subCommand = args && args[0] && args[0].toLowerCase();

    try {
      if (!subCommand) {
        await setBn({ message, store });
      } else if (subCommand === 'get') {
        await getBn({ user, store });
      } else if (subCommand === 'on') {
        await toggleBn({ message, store, isOn: true });
      } else if (subCommand === 'off') {
        await toggleBn({ message, store, isOn: false });
      } else if (subCommand === 'help') {
        await helpBn(user);
      } else if (subCommand === 'alias') {
        await aliasBn(user);
      } else if (subCommand === 'test') {
        await testBn({ message, store });
      } else {
        await noCommandFound(message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof TimeOutError
          ? error.message
          : 'Something went wrong, please try again.';
      user.send(errorMessage);
    }
  },
};
