const fs = require('fs');
const { format } = require('date-fns');

const logsFolder = './bn';
const getFilePath = dateString => `${logsFolder}/${dateString}.log`;

const log = ({ userName, userId, action, message, stack }) => {
  const dateNow = new Date();
  const date = format(dateNow, 'yyyy-MM-dd');
  const time = format(dateNow, 'HH:mm:ss');
  const stackMessage = stack ? `STACK: ${stack}` : '';

  fs.appendFile(
    getFilePath(date),
    `[${time}] ${action} - ${userName} (${userId}): ${message} ${stackMessage}\r\n`,
    () => {},
  );
};

module.exports = { log, getFilePath };
