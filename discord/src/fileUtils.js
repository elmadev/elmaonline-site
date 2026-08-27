import fs from 'fs';
import util from 'util';
import { dirname } from 'path';

export const readFile = util.promisify(fs.readFile);
export const writeFile = util.promisify(fs.writeFile);
export const mkdirAsync = util.promisify(fs.mkdir);

export const createFolder = async path => {
  await mkdirAsync(path, { recursive: true });
};

export const createParentFolder = async path => {
  const folderPath = dirname(path);
  await createFolder(folderPath);
};
