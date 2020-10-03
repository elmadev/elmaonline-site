const { emojis, keywords, messages } = require('../config');
const { bnBattleTypes, bnBattleAttributes } = require('../../constants');
const {
  parser,
  formatter,
  areUserConfigListsEmpty,
} = require('../../userConfig');

const userConfigParser = parser({
  bnBattleTypes,
  bnBattleAttributes,
  keywords,
});
const userConfigFormatter = formatter({ keywords });

const notesMessage = `*Note:*
*Use the word* ***any*** *to indicate "Any battle types" or "Any designers".*
*Use the word* ***ignore*** *at the beginning of a line to ignore (blacklist) that specific rule.*
*Use **>**xx or **<**xx to indicate a minimum and maximum battle duration in minutes.*`;

const firstConfigMessage = `Please reply to this message to set your notifications.\n\n${
  messages.userConfigFormat
}
Example:
\`\`\`
Normal, First Finish, Flag Tag by any
Apple (see others, drunk) by Pab, Markku, Sla
Any Pob.lev, jbl.lev >20 by any
Ignore any by Grob
\`\`\`
*With the example above you would get notified when a:*
*1. Normal, First Finish or Flag Tag battle is started by any player.*
*2. Apple battle (with see others and drunk) is started by Pab, Markku or Sla.*
*3. Any battle type in level starting with "Pob" (e.g. Pob0129.lev) or "jbl" and at least 20 minutes long.*
*4. But Ignore when any battle is started by Grob.*

${notesMessage}
`;

const editMessage = 'Please reply to edit your notifications, your current is:';
const yourConfigMessage = 'Your notifications were saved as:';
const writeBnHelpMessage = `*Write !bn help to see all commands (e g. !bn off to pause notifications).*`;

const setSuccesfulMessage = userConfigValues => {
  const configString = userConfigFormatter.toString(userConfigValues);
  return `${yourConfigMessage}\n\n\`\`\`${configString}\`\`\`\n${writeBnHelpMessage}`;
};

const getEditMessage = userConfig => {
  const configString = userConfigFormatter.toString(userConfig);
  return `${editMessage}\n\n\`\`\`${configString}\`\`\`\n${
    messages.userConfigFormat
  }\n${notesMessage}`;
};

const setConfigErrorMessage =
  'Could not use your reply to configure, please try again (write !bn again).';

const sendRequestMessage = async ({ message, store }) => {
  const currentConfig = await store.get(message.author.id);
  const redirectMessage = currentConfig
    ? getEditMessage(currentConfig)
    : firstConfigMessage;
  return message.send(redirectMessage);
};

const setBn = async ({ message, store }) => {
  const { channel } = await sendRequestMessage({ message, store });

  const user = message.author;
  const userMessage = await channel.readUserMessage(user);
  const userConfigLists = userConfigParser.parse(userMessage.content);

  if (!areUserConfigListsEmpty(userConfigLists)) {
    const userConfigValues = {
      ...userConfigLists,
      username: user.username,
    };
    await store.set(user.id, userConfigValues);

    channel.send(setSuccesfulMessage(userConfigValues));
    userMessage.react(emojis.ok);
  } else {
    channel.send(setConfigErrorMessage);
    userMessage.react(emojis.error);
  }
};

module.exports = setBn;
module.exports.messages = {
  firstConfigMessage,
  notesMessage,
  editMessage,
  yourConfigMessage,
  setConfigErrorMessage,
  writeBnHelpMessage,
};
