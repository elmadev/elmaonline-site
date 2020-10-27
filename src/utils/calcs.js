import { forEach } from 'lodash';
import { customAlphabet } from 'nanoid';

export const recordsTT = (levels, timeObj) => {
  let tt = 0;
  forEach(levels, l => {
    if (l[timeObj].length > 0) {
      tt += l[timeObj][0].Time;
    } else {
      tt = 0;
      return false;
    }
    return true;
  });
  return tt;
};

export const uuid = (length = 10) => {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', length);
  return nanoid();
};
