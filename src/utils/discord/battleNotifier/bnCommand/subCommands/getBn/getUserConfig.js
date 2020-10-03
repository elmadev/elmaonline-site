const { keywords, messages } = require('../../config');
const userConfigFormatter = require('../../../userConfig').formatter({
  keywords,
});

const statusToString = isOn => (isOn ? 'ON' : 'OFF');

const yourConfigMessage = 'Your current notifications are ';
const toggleStatusMessage = currentStatus => {
  const oppositeStatus = statusToString(!currentStatus).toLocaleLowerCase();
  return `to turn them ${oppositeStatus} use \`!bn ${oppositeStatus}\``;
};

const noNotificationsSetMessage =
  'No notifications set, please use `!bn` to set your notifications';

const getUserConfig = async ({ user, store }) => {
  let response = '';
  try {
    const userConfig = await store.get(user.id);

    const status = statusToString(userConfig.isOn);
    const toggleStatus = toggleStatusMessage(status);

    const configString = userConfigFormatter.toString(userConfig);
    if (configString) {
      response = `${yourConfigMessage} **${status}**\n(*${toggleStatus}*)\n\`\`\`${configString}\`\`\``;
    } else {
      response = noNotificationsSetMessage;
    }
  } catch (error) {
    response = messages.configNotFound;
  }

  await user.send(response);
};

module.exports = getUserConfig;
module.exports.messages = {
  yourConfigMessage,
};
