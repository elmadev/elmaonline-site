import moment from 'moment-timezone';

const toServerTime = (date, parse) =>
  moment(
    moment(date, parse)
      .tz('America/Los_Angeles')
      .toObject(),
  );
const toLocalTime = (date, parse) =>
  moment
    .tz(
      moment(date, parse)
        .utc()
        .toObject(),
      'America/Los_Angeles',
    )
    .tz(moment.tz.guess());

export { toServerTime, toLocalTime };
