import fs from 'fs';
import moment from 'moment';
import { Op } from 'sequelize';
import config from '../config.js';

export function log(func, query, benchmark) {
  if (config.consoleQueries) {
    const max = 3000;

    if (query.length > max) {
      // eslint-disable-next-line no-console
      console.log(
        `Query: ${func}`,
        `${benchmark}ms`,
        `(Truncated to ${max})`,
        query.substring(0, max),
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(`Query: ${func}`, `${benchmark}ms`, query);
    }
  }

  const folder = '../events/dblog/';
  fs.mkdir(folder, { recursive: true }, err => {
    if (!err) {
      if (process.env.NODE_ENV === 'development') {
        fs.appendFile(
          `${folder}${moment().format('YYYY-MM-DD')}.log`,
          `${func}: ${benchmark} [${moment().format('HH:mm:ss')}] ${query}\r\n`,
          () => {},
        );
      }
      if (benchmark > 1000) {
        fs.appendFile(
          `${folder}${moment().format('YYYY-MM-DD')}-slow.log`,
          `${func}: ${benchmark} [${moment().format('HH:mm:ss')}] ${query}\r\n`,
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

export const formatLevelSearch = level => {
  if (level) {
    if (
      level.substring(0, 8).toLowerCase() === 'internal' ||
      (level.substring(0, 3).toLowerCase() === 'int' && level.length <= 6)
    ) {
      return `QWQUU0${level.substring(level.length - 2, level.length)}`;
    }
  }
  return level;
};

export const fromTo = (from, to, column, format = 'ts') => {
  const where = {};
  let fromTs;
  let toTs;
  if (from) {
    if (format === 'datetime') {
      fromTs = `${from} 00:00:00`;
    }
    if (format === 'ts') {
      const froms = from.split('-');
      fromTs = new Date(froms[0], froms[1] - 1, froms[2]).getTime() / 1000;
    }
  }
  if (to) {
    if (format === 'datetime') {
      toTs = `${to} 23:59:59`;
    }
    if (format === 'ts') {
      const tos = to.split('-');
      toTs = new Date(tos[0], tos[1] - 1, tos[2], 23, 59, 59).getTime() / 1000;
    }
  }
  if (from && to) {
    where[column] = {
      [Op.between]: [fromTs, toTs],
    };
  } else if (from) {
    where[column] = {
      [Op.gte]: fromTs,
    };
  } else if (to) {
    where[column] = {
      [Op.lte]: toTs,
    };
  }
  return where;
};

export const fromToTime = (from, to, column) => {
  const where = {};
  if (from && to) {
    where[column] = {
      [Op.between]: [from, to],
    };
  } else if (from) {
    where[column] = {
      [Op.gte]: from,
    };
  } else if (to) {
    where[column] = {
      [Op.lte]: to,
    };
  }
  return where;
};
