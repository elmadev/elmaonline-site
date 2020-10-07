const { battleMatchesUserConfig } = require('../../notifyBattle');

const { emojis, keywords, messages } = require('../config');
const { bnBattleTypes, bnBattleAttributes } = require('../../constants');
const userConfigParser = require('../../userConfig').parser({
  bnBattleTypes,
  bnBattleAttributes,
  keywords,
});

const testBnMessage =
  'Please write a battle type and designer to test:\n*(First Finish by Markku)*';
const incorrectTestMessage =
  'Battle type or designer was incorrect, please use the format "Battle type by designer"\n\n*Write one battle type and designer. Optionally a level name pattern ending in `.lev`.*\n*Battle attributes and duration not yet supported for testing*.';

const testResultMessage = matches =>
  `${matches ? '🔔' : '🔕'} The battle ${
    matches ? 'matches' : 'does not match'
  } your notifications.`;

const testBattleMessage = ({ battleType, designer, level }) => {
  const levelAndType =
    battleType && level ? `${level} ${battleType}` : level || battleType;
  return `Test: ${levelAndType} battle started by ${designer}`;
};

const runTest = async ({ message, user, userConfig }) => {
  const { channel } = await message.send(testBnMessage);

  const userMessage = await channel.readUserMessage(user);
  const {
    battleTypes,
    designers,
    levelPatterns,
  } = userConfigParser.parseInputLine(userMessage.content);

  const battle = {
    battleType: battleTypes[0],
    designer: designers[0],
    level: levelPatterns[0],
  };

  const canTestBattle = (battle.battleType || battle.level) && battle.designer;
  if (canTestBattle) {
    const matches = battleMatchesUserConfig(battle, userConfig);
    await channel.send(testBattleMessage(battle));
    await channel.send(testResultMessage(matches));
    await userMessage.react(emojis.ok);
  } else {
    await channel.send(incorrectTestMessage);
    await userMessage.react(emojis.error);
  }
};

const testBn = async ({ message, store }) => {
  const user = message.author;

  const userConfig = await store.get(message.author.id);
  if (userConfig) {
    await runTest({ message, user, userConfig });
  } else {
    await user.send(messages.configNotFound);
  }
};

module.exports = testBn;
module.exports.messages = {
  testBnMessage,
  incorrectTestMessage,
  testResultMessage,
};
