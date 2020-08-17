import { forEach } from 'lodash';

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

export const dummy = () => {
  return true;
};
