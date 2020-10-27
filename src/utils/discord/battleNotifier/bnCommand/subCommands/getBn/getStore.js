const Discord = require('discord.js');

const getStore = async ({ user, store }) => {
  const embed = new Discord.MessageEmbed()
    .setTitle(`Current user notifications file`)
    .attachFiles([store.path]);
  await user.send(embed);
};

module.exports = getStore;
