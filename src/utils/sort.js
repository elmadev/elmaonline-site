import { forEach } from 'lodash';

const chars = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

const setCharAt = (str, index, chr) => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
};

export const lastEntry = lastValue => {
  let sort = lastValue;
  const lastChar = chars[chars.length - 1];
  for (let i = 4; i > -1; i -= 1) {
    const current = sort[i];
    if (sort[i] !== lastChar) {
      const index = chars.findIndex(x => x === current) + 1;
      sort = setCharAt(sort, i, chars[index]);
      break;
    } else {
      sort = setCharAt(sort, i, chars[0]);
    }
  }
  return sort;
};

export const firstEntry = () => {
  return lastEntry('111111111111111111111111111111111111');
};

export const inBetween = (beforeParam, afterParam, upDown) => {
  let before = beforeParam;
  const after = afterParam;
  if (before === after) {
    if (upDown === -1) {
      before = '000000000000000000000000000000000000';
    } else {
      before = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
    }
  }
  let sort = '';
  let one = false;
  forEach(before, (b, index) => {
    const beforeIndex = chars.findIndex(x => x === b);
    const afterIndex = chars.findIndex(x => x === after[index]);
    if (beforeIndex !== afterIndex) {
      if (Math.abs(beforeIndex - afterIndex) === 1) {
        sort = `${sort}${b}`;
        one = true;
      } else {
        const mid = Math.round((beforeIndex + afterIndex) / 2);
        sort = `${sort}${chars[mid]}`;
        return false;
      }
    } else if (one) {
      if (Math.abs(beforeIndex - (chars.length - 1)) === 1) {
        sort = `${sort}${b}`;
      } else {
        const mid = Math.round((beforeIndex + (chars.length - 1)) / 2);
        sort = `${sort}${chars[mid]}`;
        return false;
      }
    } else {
      sort = `${sort}${b}`;
    }
    return true;
  });
  if (sort.length < chars.length) {
    for (let i = sort.length; i < chars.length; i += 1) {
      sort = `${sort}1`;
    }
  }
  return sort;
};
