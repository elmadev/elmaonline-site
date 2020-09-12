const { discord, discordBattlestart } = require('./discord');
const exampleBattle = require('../../../events/battlestart/example.json');
const Logger = require('./logger');

discord();
setTimeout(async () => {
  try {
    await discordBattlestart(exampleBattle);
  } catch (error) {
    Logger.log({
      userName: 'DiscordTester',
      action: 'battle start event',
      message: error.message,
      stack: error.stack,
    });
  }
}, 1000);
