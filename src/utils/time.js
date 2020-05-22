import moment from 'moment-timezone';

const toServerTime = (date, parse) =>
  moment(
    moment(date, parse)
      .tz('UTC')
      .toObject(),
  );
const toLocalTime = (date, parse) =>
  moment
    .tz(
      moment(date, parse)
        .utc()
        .toObject(),
      'UTC',
    )
    .tz(moment.tz.guess());

export { toServerTime, toLocalTime };
