const { readUserMessage, redirectToDMChannel } = require('../messageUtils');

const { emojis, keywords } = require('../config');
const bnBattleTypes = require('../bnBattleTypes');
const {
  parser,
  formatter,
  isUserConfigEmpty,
} = require('../userConfig/index.js');

const userConfigParser = parser({ bnBattleTypes, keywords });
const userConfigFormatter = formatter({ keywords });

const notesMessage = `*Note:*
*Use the word* ***any*** *to indicate "Any battle types" or "Any designers".*
*Use the word* ***ignore*** *at the beinning of a line to ignore (blacklist) that specific rule.*`;

const firstConfigMessage = `Please reply to this message to set your configuration. Write one line per "rule" like this:

Normal, Flag Tag *by* Pab, Markku, Sla
First Finish *by* any
Ignore any *by* Grob

*This example reads like:*
*1. Let me know when a Normal or Flag Tag battle is started by Pab, Markku or Sla.*
*2. Let me know when a First Finish battle is started by anyone.*
*3. Ignore when Grob starts a battle (even First Finish).*

${notesMessage}
`;

const getEditMessage = userConfig => {
  const configString = userConfigFormatter.toString(userConfig);
  return `Please reply to edit your configuration, your current is:\n\n${configString}\n\n${notesMessage}`;
};

const setConfigErrorMessage =
  'Could not use your reply to configure, please try again.';

const sendRequestMessage = async ({ message, store }) => {
  const currentConfig = await store.get(message.author.id);
  const redirectMessage = currentConfig
    ? getEditMessage(currentConfig)
    : firstConfigMessage;
  return redirectToDMChannel({
    message,
    redirectMessage,
  });
};

const setBn = async ({ message, store }) => {
  const channel = await sendRequestMessage({ message, store });

  const user = message.author;
  const userMessage = await readUserMessage({ channel, user });
  const userConfig = userConfigParser.parse(userMessage.content);

  if (!isUserConfigEmpty(userConfig)) {
    await store.set(user.id, userConfig);

    const configString = userConfigFormatter.toString(userConfig);
    channel.send(`Your configuration was saved as:\n\n${configString}`);
    userMessage.react(emojis.ok);
  } else {
    channel.send(setConfigErrorMessage);
    userMessage.react(emojis.error);
  }
};

module.exports = setBn;
