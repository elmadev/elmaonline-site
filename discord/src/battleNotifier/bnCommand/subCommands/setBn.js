import { emojis, keywords, messages } from '../config.js';
import { bnBattleTypes, bnBattleAttributes } from '../../constants/index.js';
import { parser, formatter, areUserConfigListsEmpty } from '../../userConfig/index.js';

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

const exampleExplanationMessage = `*With the example above you would get notified when a:*
*1. Normal, First Finish or Flag Tag battle is started by any player.*
*2. Apple battle (with see others and drunk) is started by Pab, Markku or Sla.*
*3. Any battle type in level starting with "Pob" (e.g. Pob0129) or "jbl" that is at least 20 minutes long.*
*4. But Ignore when any battle is started by Grob.*`;

const setSharedMessage = `${messages.userConfigFormat}
${messages.userConfigExample}
${exampleExplanationMessage}

${notesMessage}`;

const firstConfigMessage = `Please reply to this message to set your notifications, write one line per rule.

${setSharedMessage}`;

const editMessageTitle =
  'Please reply to edit your notifications, write on line per rule.';
const yourConfigMessage = 'Your notifications were saved as:';
const writeBnHelpMessage =
  '*Write `!bn help` to see all commands (e g. `!bn off` to pause notifications).*';

const setSuccesfulMessage = userConfigValues => {
  const configString = userConfigFormatter.toString(userConfigValues);
  return `${yourConfigMessage}\n\n\`\`\`${configString}\`\`\`\n${writeBnHelpMessage}`;
};

const editMessage = configString => `${editMessageTitle}

Your current notifications:\`\`\`${configString}\`\`\`
${setSharedMessage}`;

const getEditMessage = userConfig => {
  const configString = userConfigFormatter.toString(userConfig);
  return editMessage(configString);
};

const setConfigErrorMessage =
  'Could not use your reply to set your notifications, please try again (write `!bn` again).';

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

    await channel.send(setSuccesfulMessage(userConfigValues));
    await userMessage.react(emojis.ok);
  } else {
    await channel.send(setConfigErrorMessage);
    await userMessage.react(emojis.error);
  }
};

setBn.messages = {
  firstConfigMessage,
  notesMessage,
  yourConfigMessage,
  setConfigErrorMessage,
  writeBnHelpMessage,
  editMessage,
};

export default setBn;
