const { readFile, writeFile } = require('../../fileUtils');

const readJsonFile = async path => {
  let result = {};
  try {
    const fileHandle = await readFile(path);
    result = JSON.parse(fileHandle.toString());
  } catch (error) {
    result = {};
  }

  return result;
};

const writeJsonFile = async (path, data) => {
  await writeFile(path, JSON.stringify(data));
};

module.exports = {
  readJsonFile,
  writeJsonFile,
};
