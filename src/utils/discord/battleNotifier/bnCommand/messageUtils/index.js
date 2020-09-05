const readUserMessage = require('./readUserMessage');
const redirectToDMChannel = require('./redirectToDMChannel');

module.exports = {
  readUserMessage,
  redirectToDMChannel,
  TimeOutError: readUserMessage.TimeOutError,
};
