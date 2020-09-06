const fs = require('fs');

const padZeros = (value, length = 2) => {
  return value ? value.toString().padStart(length, '0') : '';
};

const formatDate = date => {
  const month = padZeros(date.getMonth() + 1);
  const day = padZeros(date.getDate());
  const year = date.getFullYear();
  return [year, month, day].join('-');
};

const formatTime = date => {
  const hours = padZeros(date.getHours());
  const minutes = padZeros(date.getMinutes());
  const seconds = padZeros(date.getSeconds());
  return [hours, minutes, seconds].join(':');
};

const log = ({ userName, userId, action, message, stack }) => {
  const dateNow = new Date();
  const date = formatDate(dateNow);
  const time = formatTime(dateNow);
  const stackMessage = stack ? `STACK: ${stack}` : '';
  fs.appendFile(
    `./bn/${date}.log`,
    `[${time}] ${action} - ${userName} (${userId}): ${message} ${stackMessage}\r\n`,
    () => {},
  );
};

module.exports = { log };
