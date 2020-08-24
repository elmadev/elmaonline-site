const { keywords, responses } = require('../config');
const userConfigFormatter = require('../userConfig').formatter({ keywords });

const statusToString = isOn => (isOn ? 'ON' : 'OFF');

const getBn = async ({ user, store }) => {
  let response = '';
  try {
    const userConfig = await store.get(user.id);

    const status = statusToString(userConfig.isOn);
    const oppositeStatus = statusToString(!userConfig.isOn).toLocaleLowerCase();
    const toggleStatus = `to turn it ${oppositeStatus} use "!bn ${oppositeStatus}"`;

    const configString = userConfigFormatter.toString(userConfig);
    response = `${user} your current config is **${status}**\n(*${toggleStatus}*)\n\n${configString}`;
  } catch (error) {
    response = responses.configNotFound;
  }

  await user.send(response);
};

module.exports = getBn;
