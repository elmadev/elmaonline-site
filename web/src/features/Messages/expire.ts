// disappearing message options in seconds, 0 is never. the api has the same
// list in api/src/api/message.js
const hour = 60 * 60;
const day = 24 * hour;

export const expireOptions: [number, string][] = [
  [0, 'Never'],
  [hour, '1 hour'],
  [day, '1 day'],
  [7 * day, '7 days'],
  [30 * day, '30 days'],
  [365 * day, '365 days'],
];

// short label for the timer button, ie. 7d
export const expireShortLabel = (ExpireAfter: number) => {
  if (!ExpireAfter) {
    return '';
  }
  if (ExpireAfter < day) {
    return `${ExpireAfter / hour}h`;
  }
  return `${ExpireAfter / day}d`;
};

export const expireLabel = (ExpireAfter: number) =>
  expireOptions.find(([value]) => value === ExpireAfter)?.[1] || '';
