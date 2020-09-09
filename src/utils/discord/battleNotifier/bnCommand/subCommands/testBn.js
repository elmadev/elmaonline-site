const { battleMatchesUserConfig } = require('../../notifyBattle');
const { readUserMessage, redirectToDMChannel } = require('../messageUtils');

const { emojis, keywords, responses } = require('../config');
const bnBattleTypes = require('../bnBattleTypes');
const userConfigParser = require('../userConfig').parser({
  bnBattleTypes,
  keywords,
});

const testBnMessage =
  'Please write a battle type and designer to test:\n*(First Finish by Markku)*';

const runTest = async ({ message, user, userConfig }) => {
  const channel = await redirectToDMChannel({
    message,
    redirectMessage: testBnMessage,
  });

  const userMessage = await readUserMessage({ channel, user });
  const { battleTypes, designers } = userConfigParser.parseInputLine(
    userMessage.content,
  );

  const battle = { battleType: battleTypes[0], designer: designers[0] };

  if (battle.battleType && battle.designer) {
    const matches = battleMatchesUserConfig(battle, userConfig);
    channel.send(
      `Test: ${battle.battleType || keywords.any} battle started by ${
        battle.designer
      }`,
    );
    channel.send(
      `${matches ? '🔔' : '🔕'} The battle ${
        matches ? 'matches' : 'does not match'
      } your configuration.`,
    );
    userMessage.react(emojis.ok);
  } else {
    channel.send(
      'Battle type or designer was incorrect, please use the format "Battle type by designer"',
    );
    userMessage.react(emojis.error);
  }
};

const testBn = async ({ message, store }) => {
  const user = message.author;

  const userConfig = await store.get(message.author.id);
  if (userConfig) {
    await runTest({ message, user, userConfig });
  } else {
    await user.send(responses.configNotFound);
  }
};

module.exports = testBn;
