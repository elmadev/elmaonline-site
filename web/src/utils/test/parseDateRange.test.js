import {
  parseDateRange,
  getTypeAndDate,
  lastDayOfMonth,
} from '../parseDateRange';

test('utils/parseDateRange', () => {
  const parse = (str1, str2) => {
    return parseDateRange(getTypeAndDate(str1), getTypeAndDate(str2));
  };

  expect(getTypeAndDate('1999')).toStrictEqual(['year', 1999, null, null]);
  expect(getTypeAndDate('2010-01')).toStrictEqual(['month', 2010, 1, null]);
  expect(getTypeAndDate('2010-10-15')).toStrictEqual(['day', 2010, 10, 15]);

  // should return 30 as day (sept 31 not a thing)
  expect(getTypeAndDate('1970-09-31')).toStrictEqual(['day', 1970, 9, 30]);

  // invalid formats
  expect(getTypeAndDate('2010-9')[0]).toStrictEqual(null);
  expect(getTypeAndDate('1999-13')[0]).toStrictEqual(null);
  expect(getTypeAndDate('2010-9-15')[0]).toStrictEqual(null);

  expect(lastDayOfMonth(2020, 9)).toStrictEqual(30);
  expect(lastDayOfMonth(2020, 10)).toStrictEqual(31);
  // leap years
  expect(lastDayOfMonth(2020, 2)).toStrictEqual(29);
  expect(lastDayOfMonth(2021, 2)).toStrictEqual(28);

  expect(parse('', '2020-10-01')).toStrictEqual([null, [2020, 10, 1]]);
  expect(parse('', '2020-10')).toStrictEqual([null, [2020, 10, 31]]);
  expect(parse('', '2020')).toStrictEqual([null, [2020, 12, 31]]);

  expect(parse('2020', '')).toStrictEqual([[2020, 1, 1], null]);
  expect(parse('2020-09', '')).toStrictEqual([[2020, 9, 1], null]);
  expect(parse('2020-12-15', '')).toStrictEqual([[2020, 12, 15], null]);

  expect(parse('2020', '2021-01')).toStrictEqual([
    [2020, 1, 1],
    [2021, 1, 31],
  ]);
  // should reverse the date range if provided in descending order
  expect(parse('2020-10-10', '2020-10-01')).toStrictEqual([
    [2020, 10, 1],
    [2020, 10, 10],
  ]);
  // should reverse the date range if provided in descending order
  expect(parse('2020-10', '2021-10')).toStrictEqual([
    [2020, 10, 1],
    [2021, 10, 31],
  ]);
  expect(parse('2010', '2010')).toStrictEqual([
    [2010, 1, 1],
    [2010, 12, 31],
  ]);
  expect(parse('2010-10', '2010-10')).toStrictEqual([
    [2010, 10, 1],
    [2010, 10, 31],
  ]);
  expect(parse('2010-10-10', '2010-10-10')).toStrictEqual([
    [2010, 10, 10],
    [2010, 10, 10],
  ]);

  expect(parse('', '')).toStrictEqual([null, null]);
  expect(parse('', 'something invalid')).toStrictEqual([null, null]);
  expect(parse('', '2010-09-1')).toStrictEqual([null, null]);
});
