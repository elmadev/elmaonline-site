// for levelstats. time likely many hours.
export const formatTimeSpent = time => {
  const hours = Math.round((time || 0) / 360000);

  if (hours < 1) {
    return '<1h';
  }

  return hours.toLocaleString() + 'h';
};

// for levelstats, likely large number of attempts.
export const formatAttempts = num => {
  if (num && num > 0) {
    return Number(num).toLocaleString();
  }
  return 0;
};

export const formatPct = (num, div, precision = 2) => {
  let pct = 0;

  if (div > 0) {
    pct = Number.parseFloat((num * 100) / div);
  }

  return pct.toFixed(precision);
};
