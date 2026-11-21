import { parse } from 'date-fns';

const zeroPad = (num, size) => {
  const s = `000000000${num}`;
  return s.substr(s.length - size);
};

//const toLocalTime = (date, parse) =>
//  moment.tz(moment(date, parse).utc().toObject(), 'UTC').tz(moment.tz.guess());

const toLocalTime = (date, format) =>
  parse(date.toString(), format, new Date());

const formattedTime = seconds => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');

  return hours > 0
    ? `${hours}:${minutes}:${remainingSeconds}`
    : `${minutes}:${remainingSeconds}`;
};

export { formattedTime, toLocalTime, zeroPad };
