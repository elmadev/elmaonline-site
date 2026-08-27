import { readFile, writeFile } from '../../fileUtils.js';

export const readJsonFile = async path => {
  let result = {};
  try {
    const fileHandle = await readFile(path);
    result = JSON.parse(fileHandle.toString());
  } catch (error) {
    result = {};
  }

  return result;
};

export const writeJsonFile = async (path, data) => {
  await writeFile(path, JSON.stringify(data));
};
