import { forEach } from 'lodash';
import { customAlphabet } from 'nanoid';

export const recordsTT = (levels, timeObj) => {
  let tt = 0;
  let levs = 0;
  let finished = 0;
  let unfinished = false;
  forEach(levels, l => {
    if (l[timeObj].length > 0) {
      tt += l[timeObj][0].Time;
      finished += 1;
      levs += 1;
    } else {
      levs += 1;
      unfinished = true;
    }
    return true;
  });
  return { tt, finished, levs, unfinished };
};

export const uuid = (length = 10) => {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', length);
  return nanoid();
};
