import { parse } from 'date-fns';

const zeroPad = (num, size) => {
  const s = `000000000${num}`;
  return s.substr(s.length - size);
};

//const toLocalTime = (date, parse) =>
//  moment.tz(moment(date, parse).utc().toObject(), 'UTC').tz(moment.tz.guess());

const toLocalTime = (date, format) =>
  parse(date.toString(), format, new Date());

export { toLocalTime, zeroPad };
