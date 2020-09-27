const { keywords, messages } = require('../../config');
const userConfigFormatter = require('../../../userConfig').formatter({
  keywords,
});

const statusToString = isOn => (isOn ? 'ON' : 'OFF');

const yourConfigMessage = 'Your current config is ';
const toggleStatusMessage = currentStatus => {
  const oppositeStatus = statusToString(!currentStatus).toLocaleLowerCase();
  return `to turn it ${oppositeStatus} use "!bn ${oppositeStatus}"`;
};

const noNotificationsSetMessage =
  'No notifications set, please use `!bn` to set your configuration';

const getUserConfig = async ({ user, store }) => {
  let response = '';
  try {
    const userConfig = await store.get(user.id);

    const status = statusToString(userConfig.isOn);
    const toggleStatus = toggleStatusMessage(status);

    const configString = userConfigFormatter.toString(userConfig);
    if (configString) {
      response = `${yourConfigMessage} **${status}**\n(*${toggleStatus}*)\n\n${configString}`;
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
