const Discord = require('discord.js');

const redirectToDMChannel = async ({ message, redirectMessage }) => {
  let dm = null;
  if (message.channel instanceof Discord.DMChannel) {
    dm = await message.channel.send(redirectMessage);
  } else {
    dm = await message.author.send(redirectMessage);
  }

  return dm.channel;
};

module.exports = redirectToDMChannel;
