import { customAlphabet } from 'nanoid';

export const zeroPad = (num, size) => {
  const s = `000000000${num}`;
  return s.substr(s.length - size);
};

export const uuid = (length = 10) => {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', length);
  return nanoid();
};
