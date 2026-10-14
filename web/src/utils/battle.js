const reversedBattleTypes = ['SL', 'SR', 'FT', 'SP', 'FC'];

const sortResults = battleType => (a, b) => {
  if (a.Time && b.Time) {
    const c = reversedBattleTypes.find(t => t === battleType)
      ? b.Time - a.Time
      : a.Time - b.Time;
    return c === 0 ? a.TimeIndex - b.TimeIndex : c;
  }
  if (a.Time === 0 && b.Time !== 0) return 1;
  if (b.Time === 0 && a.Time !== 0) return -1;
  const d = b.Apples - a.Apples;
  return d === 0 ? a.BattleTimeIndex - b.BattleTimeIndex : d;
};

const battleRemaining = battle => {
  const start = parseInt(battle.Started) + (battle.Countdown || 0);
  const end = start + battle.Duration * 60;
  const now = Math.floor(Date.now() / 1000);
  if (now < start) return { percent: 100, seconds: end - start };
  if (now > end) return { percent: 0, seconds: 0 };
  return {
    percent: Math.round(((end - now) / (end - start)) * 100),
    seconds: end - now,
  };
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

const battleStatusBgColor = (data, theme) => {
  let bgColor;
  if (data.Aborted === 1) {
    bgColor = theme.aborted;
  }
  if (data.Aborted === 0 && data.InQueue === 1) {
    bgColor = theme.inqueue;
  }
  if (data.Aborted === 0 && data.InQueue === 0 && data.Finished === 0) {
    bgColor = theme.ongoing;
  }
  return bgColor;
};

const getBattleType = battle => {
  if (battle.BattleType !== 'NM') {
    return battle.BattleType;
  }
  if (
    battle.NoVolt &&
    !battle.NoTurn &&
    !battle.OneTurn &&
    !battle.NoBrake &&
    !battle.NoThrottle &&
    !battle.AlwaysThrottle &&
    !battle.Drunk &&
    !battle.OneWheel &&
    !battle.Multi
  ) {
    return 'NV';
  }
  if (
    !battle.NoVolt &&
    battle.NoTurn &&
    !battle.OneTurn &&
    !battle.NoBrake &&
    !battle.NoThrottle &&
    !battle.AlwaysThrottle &&
    !battle.Drunk &&
    !battle.OneWheel &&
    !battle.Multi
  ) {
    return 'NT';
  }
  if (
    !battle.NoVolt &&
    !battle.NoTurn &&
    battle.OneTurn &&
    !battle.NoBrake &&
    !battle.NoThrottle &&
    !battle.AlwaysThrottle &&
    !battle.Drunk &&
    !battle.OneWheel &&
    !battle.Multi
  ) {
    return 'OT';
  }
  if (
    !battle.NoVolt &&
    !battle.NoTurn &&
    !battle.OneTurn &&
    battle.NoBrake &&
    !battle.NoThrottle &&
    !battle.AlwaysThrottle &&
    !battle.Drunk &&
    !battle.OneWheel &&
    !battle.Multi
  ) {
    return 'NB';
  }
  if (
    !battle.NoVolt &&
    !battle.NoTurn &&
    !battle.OneTurn &&
    !battle.NoBrake &&
    battle.NoThrottle &&
    !battle.AlwaysThrottle &&
    !battle.Drunk &&
    !battle.OneWheel &&
    !battle.Multi
  ) {
    return 'NTH';
  }
  if (
    !battle.NoVolt &&
    !battle.NoTurn &&
    !battle.OneTurn &&
    !battle.NoBrake &&
    !battle.NoThrottle &&
    battle.AlwaysThrottle &&
    !battle.Drunk &&
    !battle.OneWheel &&
    !battle.Multi
  ) {
    return 'AT';
  }
  if (
    !battle.NoVolt &&
    !battle.NoTurn &&
    !battle.OneTurn &&
    !battle.NoBrake &&
    !battle.NoThrottle &&
    !battle.AlwaysThrottle &&
    battle.Drunk &&
    !battle.OneWheel &&
    !battle.Multi
  ) {
    return 'D';
  }
  if (
    !battle.NoVolt &&
    !battle.NoTurn &&
    !battle.OneTurn &&
    !battle.NoBrake &&
    !battle.NoThrottle &&
    !battle.AlwaysThrottle &&
    !battle.Drunk &&
    battle.OneWheel &&
    !battle.Multi
  ) {
    return 'OW';
  }
  if (
    !battle.NoVolt &&
    !battle.NoTurn &&
    !battle.OneTurn &&
    !battle.NoBrake &&
    !battle.NoThrottle &&
    !battle.AlwaysThrottle &&
    !battle.Drunk &&
    !battle.OneWheel &&
    battle.Multi
  ) {
    return 'M';
  }
  return battle.BattleType;
};

export {
  sortResults,
  battleStatus,
  battleStatusBgColor,
  battleRemaining,
  getBattleType,
};
