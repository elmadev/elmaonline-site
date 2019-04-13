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
const sortResults = battleType => (a, b) => {
  if (a.Time && b.Time) {
    const c =
      battleType === 'SL' || battleType === 'SR'
        ? b.Time - a.Time
        : a.Time - b.Time;
    return c === 0 ? a.TimeIndex - b.TimeIndex : c;
  }
  if (a.Time === 0 && b.Time !== 0) return 1;
  if (b.Time === 0 && a.Time !== 0) return -1;
  const d = b.Apples - a.Apples;
  return d === 0 ? a.BattleTimeIndex - b.BattleTimeIndex : d;
};

export { toServerTime, toLocalTime, sortResults };
