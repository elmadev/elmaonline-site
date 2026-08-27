import { fromPairs } from 'lodash';

export const getCripples = () => {
  const arr = [
    ['noVolt', 'No Volt'],
    ['noTurn', 'No Turn'],
    ['oneTurn', 'One Turn'],
    ['noBrake', 'No Brake'],
    ['noThrottle', 'No Throttle'],
    ['alwaysThrottle', 'Always Throttle'],
    ['oneWheel', 'One Wheel'],
    ['drunk', 'Drunk'],
  ];

  // arr, object
  return [arr, fromPairs(arr)];
};

export const getBattleTypes = () => {
  const arr = [
    ['NM', 'Normal'],
    ['OL', 'One-Life'],
    ['FF', 'First Finish'],
    ['SL', 'Slowness'],
    ['SR', 'Survivor'],
    ['LC', 'Last Counts'],
    ['FC', 'Finish Count'],
    ['HT', '1 Hour Total Time'],
    ['FT', 'Flag Tag'],
    ['AP', 'Apple'],
    ['SP', 'Speed'],
  ];

  // arr, object
  return [arr, fromPairs(arr)];
};
