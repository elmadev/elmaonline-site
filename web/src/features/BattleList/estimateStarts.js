// Estimates the start time (`Starts`) of queued battles based on the
// currently running/last battle and the queue order returned by the API.
// `breakSeconds` is the gap kept between battles (default 2 minutes).
export const estimateBattleStarts = (battles, breakSeconds = 120) => {
  if (!battles.length) {
    return battles;
  }
  const inQueue = battles.filter(b => b.InQueue && !b.Aborted);
  if (inQueue.length === 0) {
    return battles;
  }
  const started = battles.filter(b => !b.InQueue && !b.Aborted);
  if (started.length === 0) {
    return battles;
  }
  const battles2 = [...battles];
  const remaining = started[0].Finished
    ? breakSeconds -
      (Math.floor(Date.now() / 1000) -
        (parseInt(started[0].Started) + started[0].Duration * 60))
    : breakSeconds +
      (parseInt(started[0].Started) +
        started[0].Duration * 60 -
        Math.floor(Date.now() / 1000));
  let inQueueTime = 0;
  inQueue.reverse().forEach((b, index) => {
    const ogIndex = inQueue.length - 1 - index;
    battles2[ogIndex] = {
      ...battles2[ogIndex],
      Starts: Math.floor(Date.now() / 1000) + remaining + inQueueTime,
    };
    inQueueTime += breakSeconds + b.Duration * 60 + b.Countdown;
  });
  return battles2;
};
