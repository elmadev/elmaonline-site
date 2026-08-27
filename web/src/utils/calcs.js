import { forEach } from 'lodash';
import { customAlphabet } from 'nanoid';

// export const mapX = (x, points) => {
//   let p1;
//   let p2;
//
//   points.slice(0, points.length - 1).forEach((point, index) => {
//     if (x >= points[index][0] && x < points[index + 1][0]) {
//       p1 = points[index];
//       p2 = points[index + 1];
//     }
//   });
// };

// https://flexbooks.ck12.org/cbook/ck-12-precalculus-concepts-2.0/section/3.7/primary/lesson/logistic-functions-pcalc
// maps 0 to infinity to 0 to 1.
// to find a suitable b, try: https://www.wolframalpha.com/input/?i=graphing
// and plot: (2 / (1 + 0.99 ^ x ))  - 1
// in this case, 0.99 makes a reasonable curve for values between 0 and 400.
// if the max is some dynamic value, then i have no clue how to choose b really.
// @see docs/shiftedLogisticFn.jpg
export const shiftedLogisticFn = (b, x) => {
  return 2 / (1 + Math.pow(b, x)) - 1;
};

/**
 * Ie. a shifted logistic function that intersects two points
 *
 * If you want a value of 50 to map to 0.2, and a value of 400 to map to 0.8,
 * then use: shiftedLogisticWithIntersects([50, 0.2], [400, 0.8], value),
 * so if value is 400, you would expect 0.8 as the return value.
 *
 * it seems to work.. Ty chatGPT.
 */
export const shiftedLogisticWithIntersects = (
  [x1, y1],
  [x2, y2],
  value,
  decimals = 5,
) => {
  const logit1 = Math.log(y1 / (1 - y1));
  const logit2 = Math.log(y2 / (1 - y2));
  const k = (logit2 - logit1) / (x2 - x1);
  const x0 = (x1 * logit2 - x2 * logit1) / (logit2 - logit1);
  const result = 1 / (1 + Math.exp(-k * (value - x0)));
  return Number(result.toFixed(decimals));
};

// https://stackoverflow.com/questions/5259421/cumulative-distribution-function-in-javascript
// normal cumulative distribution function
// maps a value from 0 to infinity to 0 to 1
export const normalCdf = (mean, sigma, val) => {
  var z = (val - mean) / Math.sqrt(2 * sigma * sigma);
  var t = 1 / (1 + 0.3275911 * Math.abs(z));
  var a1 = 0.254829592;
  var a2 = -0.284496736;
  var a3 = 1.421413741;
  var a4 = -1.453152027;
  var a5 = 1.061405429;
  var erf =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  var sign = 1;
  if (z < 0) {
    sign = -1;
  }
  return (1 / 2) * (1 + sign * erf);
};

export const recordsTT = (levels, timeObj) => {
  let tt = 0;
  let levs = 0;
  let finished = 0;
  let unfinished = false;
  forEach(levels, l => {
    if (l.Level && l.Level.ExcludeFromTotal === 1) {
      return true;
    }

    if (l[timeObj]) {
      if (Array.isArray(l[timeObj])) {
        if (l[timeObj].length > 0) {
          tt += l[timeObj][0].Time;
          finished += 1;
          levs += 1;
        } else {
          levs += 1;
          unfinished = true;
        }
      } else {
        tt += l[timeObj].Time;
        finished += 1;
        levs += 1;
      }
    } else {
      levs += 1;
      unfinished = true;
    }
    return true;
  });
  return { tt, finished, levs, unfinished };
};

export const combinedTT = (levels, timeObjs) => {
  let tt = 0;
  let levs = 0;
  let finished = 0;
  let unfinished = false;
  forEach(levels, l => {
    if (l.Level && l.Level.ExcludeFromTotal === 1) {
      return true;
    }

    let bestTime;
    timeObjs.forEach(b => {
      if (l[b]) {
        if (bestTime === undefined) {
          bestTime = parseInt(l[b].Time);
        } else {
          bestTime =
            parseInt(l[b].Time) < bestTime ? parseInt(l[b].Time) : bestTime;
        }
      }
    });
    if (bestTime !== undefined && !isNaN(bestTime)) {
      tt += bestTime;
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

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const forceInt = (val, def = 0, min = null, max = null) => {
  // not sure what parseInt on these vals returns.
  if (val === '' || val === null || val === undefined || val === false) {
    return def;
  }

  const ret = parseInt(val, 10);

  if (Number.isNaN(ret)) {
    return def;
  }

  if (min !== null && ret < min) {
    return min;
  }

  if (max !== null && ret > max) {
    return max;
  }

  return ret;
};
