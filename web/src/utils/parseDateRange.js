import { endOfMonth, addDays as dateFnsAddDays } from 'date-fns';

export const toInt = (str, min, max) => {
  const int = parseInt(str, 10);

  if (Number.isNaN(int)) {
    return null;
  }

  return int >= min && int <= max ? int : null;
};

export const lastDayOfMonth = (year, month) => {
  return endOfMonth(new Date(year, month - 1, 1)).getDate();
};

export const addDays = ([year, month, day], days) => {
  const obj = dateFnsAddDays(new Date(year, month - 1, day), days);
  return [obj.getFullYear(), obj.getMonth() + 1, obj.getDate()];
};

const toTime = ([year, month, day]) => {
  return new Date(year, month - 1, day).getTime();
};

// parses and validates the day/month/year in a given user input string.
// supported formats: yyyy, yyyy-mm, yyyy-mm-dd, yyyymm, yyyymmdd
// the main difference between converting to a generic date object, is that
// it detects when a user does not provide a month or a day, which is reflected
// in the type. It does not default to the first day of a month/year for example.
export const getTypeAndDate = str => {
  // make sure integer years get converted to strings
  str = ('' + str).replace(/-/g, '');

  const y = toInt(str.substring(0, 4), 1, 9999);
  const m = toInt(str.substring(4, 6), 1, 12);
  const d = toInt(str.substring(6, 8), 1, 31);

  // ie. '2020'
  if (str.length === 4 && /[1-9]\d\d\d/.test(str)) {
    if (y !== null) {
      return ['year', y, null, null];
    }
  } else if (str.length === 6 && /[1-9]\d\d\d\d\d/.test(str)) {
    if (y !== null && m !== null) {
      return ['month', y, m, null];
    }
  } else if (str.length === 8 && /[1-9]\d\d\d\d\d\d\d/.test(str)) {
    if (y !== null && m !== null && d !== null) {
      return ['day', y, m, Math.min(d, lastDayOfMonth(y, m))];
    }
  }

  return [null, null, null, null];
};

// [ 'month', 2020, 10, null ] => [ 2020, 10, 31 ]
const lastDayOf = ([type, year, month, day]) => {
  if (type === 'year') {
    return [year, 12, 31];
  }

  if (type === 'month') {
    return [year, month, lastDayOfMonth(year, month)];
  }

  if (type === 'day') {
    return [year, month, day];
  }
};

// [ 'year', 2020, null, null ] => [ 2020, 1, 1 ]
const firstDayOf = ([type, year, month, day]) => {
  if (type === 'year') {
    return [year, 1, 1];
  }

  if (type === 'month') {
    return [year, month, 1];
  }

  if (type === 'day') {
    return [year, month, day];
  }
};

const handleBetween = (
  [type, year, month, day],
  [type2, year2, month2, day2],
) => {
  if (type === null || type2 === null) {
    return [null, null];
  }

  let firstDay, lastDay;
  const date = [type, year, month, day];
  const date2 = [type2, year2, month2, day2];

  if (toTime(firstDayOf(date)) <= toTime(firstDayOf(date2))) {
    firstDay = firstDayOf(date);
    lastDay = lastDayOf(date2);
  } else {
    // if second date is before first date, treat it as the first date instead.
    firstDay = firstDayOf(date2);
    lastDay = lastDayOf(date);
  }

  return [firstDay, lastDay];
};

// ie. (['day', 2010, 10, 15], ['month', 2010, 11]) => [[ 2010, 10, 15 ], [ 2010, 11, 30 ]]
// see getTypeAndDate for generating inputs from strings.
export const parseDateRange = (typeAndDate0, typeAndDate1) => {
  // we expect arrays of length 4 but will treat null the same
  // as [null, null, null, null]
  const type0 = typeAndDate0 === null ? null : typeAndDate0[0];
  const type1 = typeAndDate1 === null ? null : typeAndDate1[0];

  // no start date
  if (type0 === null && type1 !== null) {
    return [null, lastDayOf(typeAndDate1)];
  }

  // no end date
  if (type0 !== null && type1 === null) {
    return [firstDayOf(typeAndDate0), null];
  }

  if (type0 !== null && type1 !== null) {
    return handleBetween(typeAndDate0, typeAndDate1);
  }

  return [null, null];
};
