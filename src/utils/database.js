import fs from 'fs';
import moment from 'moment';

export function log(func, query, benchmark) {
  fs.appendFile(
    `./events/${moment().format('YYYY-MM-DD')}.log`,
    `${func}: ${benchmark} ${query}\r\n`,
    () => {},
  );
  if (benchmark > 1000) {
    fs.appendFile(
      `./events/${moment().format('YYYY-MM-DD')}-slow.log`,
      `${func}: ${benchmark} ${query}\r\n`,
      () => {},
    );
  }
}

export function dummy() {
  return true;
}
