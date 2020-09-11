const fs = require('fs');
const { format } = require('date-fns');
const { createFolder } = require('./fileUtils.js');

let logger = null;
logger =
  logger ||
  (() => {
    let path = '';
    const initialize = async logsPath => {
      path = logsPath;
      await createFolder(path);
    };

    const getFilePath = dateString => `${path}${dateString}.log`;

    const log = ({ userName, userId, action, message, stack }) => {
      const dateNow = new Date();
      const date = format(dateNow, 'yyyy-MM-dd');
      const time = format(dateNow, 'HH:mm:ss');
      const stackMessage = stack ? `STACK: ${stack}` : '';

      try {
        fs.appendFile(
          getFilePath(date),
          `[${time}] ${action} - ${userName} (${userId}): ${message} ${stackMessage}\r\n`,
          () => {},
        );
      } catch {
        // Log failed
      }
    };

    return { initialize, log, getFilePath };
  })();

module.exports = logger;
