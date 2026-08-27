/**
 * * ie. ( 3885, [ 3600, 60, 1 ] ) => [1, 4, 45]
 *
 * This tells us that 3885 seconds is 1 hour, 4 minutes, and 45 seconds.
 *
 * Passing in different breakpoints allows time to be in hundreds or thousands of
 * a second. @see parseTimeHundreds, and parseTimeThousands.
 *
 * @param time int
 * @param breakpoints array
 * @returns {[]}
 */
export const parseTime = (time, breakpoints = [3600, 60, 1]) => {
  let ret = [];
  let remaining = time;
  breakpoints.forEach(b => {
    let hours_min_sec_etc = Math.floor(remaining / b);
    remaining = remaining - hours_min_sec_etc * b;
    ret.push(hours_min_sec_etc);
  });
  return ret;
};

export const parseTimeHundreds = time => {
  return parseTime(time, [360000, 6000, 100, 1]);
};

export const parseTimeThousands = time => {
  return parseTime(time, [3600000, 60000, 1000, 1]);
};

/**
 * [0,3,26,65], false => "3:26,65"
 * [0,0,10,65], true => "10,065"
 *
 * @param parsed - array of 4 integers: hours, minutes, seconds, ms or hundreds of a second
 * @param thousands = true if parsed[3] represents mili-seconds (not hundreds of a second)
 * @returns {string}
 */
export const parsedTimeToString = (parsed, thousands = false) => {
  // ie. [ 0, 0, 5, 25] => [ "00", "00", "05", "25" ] (5.25 seconds)
  const parts = parsed.map((int, index) => {
    let len = 2;

    if (thousands && index === parsed.length - 1) {
      len = 3;
    }

    return int.toString().padStart(len, '0');
  });

  // ie. "00:00:05,25"
  const str = parts
    .slice(0, -1)
    .join(':')
    .concat(',', parts[parts.length - 1]);

  let foundNonZeroOrColon = false;

  // remove "0"'s and ":"'s from beginning of string
  // "00:02:15,13" => "2:15,13"
  // "00:00:00,00" => ",00" (we'll fix this after)
  let _str = Array.from(str)
    .filter(char => {
      if (foundNonZeroOrColon) {
        return true;
      }

      if (['0', ':'].includes(char)) {
        return false;
      } else {
        // char is an integer or a comma.
        // since we always catch the comma before the last
        // 2 integers, its worth noting that the last 2 ints
        // never get filtered out even if they are zeroes.
        foundNonZeroOrColon = true;
        return true;
      }
    })
    .join('');

  // ",75" => "0,75" or ",00" => "0,00"
  if (_str.startsWith(',')) {
    _str = '0' + _str;
  } // else if (_str.charAt(1) === ',') {
  // "1,55" => "01,55"
  // _str = '0' + _str;
  // }

  return _str;
};
