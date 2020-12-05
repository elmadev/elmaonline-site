import fs from 'fs';
import moment from 'moment';

export function log(func, query, benchmark) {
  let folder = './events/dblog/';
  if (process.env.NODE_ENV === 'production') {
    folder = '../events/dblog/';
  }
  fs.mkdir(folder, { recursive: true }, err => {
    if (!err) {
      if (process.env.NODE_ENV === 'development') {
        fs.appendFile(
          `${folder}${moment().format('YYYY-MM-DD')}.log`,
          `${func}: ${benchmark} ${query}\r\n`,
          () => {},
        );
      }
      if (benchmark > 1000) {
        fs.appendFile(
          `${folder}${moment().format('YYYY-MM-DD')}-slow.log`,
          `${func}: ${benchmark} ${query}\r\n`,
          () => {},
        );
      }
    }
  });
}

export function like(text) {
  return text.replace(/%/g, '\\%').replace(/\*/g, '%');
}

export function searchLimit(limit) {
  const limitInt = parseInt(limit, 10);
  if (limitInt < 0) {
    return 10000;
  }
  if (limitInt > 10000) {
    return 10000;
  }
  if (limitInt === 0) {
    return 25;
  }
  return limitInt;
}

export function searchOffset(offset) {
  const offsetInt = parseInt(offset, 10);
  if (offsetInt < 0) {
    return Math.abs(offsetInt);
  }
  return offsetInt;
}
