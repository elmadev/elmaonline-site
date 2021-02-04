const reversedBattleTypes = ['SL', 'SR', 'FT'];

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

export { sortResults, getBattleType };
