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
const battleStatus = data => {
  let status;
  if (data.Aborted === 1) {
    status = 'Aborted';
  }
  if (data.Aborted === 0 && data.InQueue === 1) {
    status = 'Queued';
  }
  if (data.Aborted === 0 && data.InQueue === 0 && data.Finished === 0) {
    status = 'Ongoing';
  }
  if (data.Finished === 1) {
    status = 'Finished';
  }
  return status;
};
const battleStatusBgColor = data => {
  let bgColor;
  if (data.Aborted === 1) {
    bgColor = '#ffb3ba';
  }
  if (data.Aborted === 0 && data.InQueue === 1) {
    bgColor = '#baffc9';
  }
  if (data.Aborted === 0 && data.InQueue === 0 && data.Finished === 0) {
    bgColor = '#bae1ff';
  }
  return bgColor;
};

export {
  toServerTime,
  toLocalTime,
  sortResults,
  battleStatus,
  battleStatusBgColor,
};
