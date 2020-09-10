const fs = require('fs');
const util = require('util');

fs.readFileAsync = util.promisify(fs.readFile);
fs.writeFileAsync = util.promisify(fs.writeFile);

const readJsonFile = async path => {
  let result = {};
  try {
    const fileHandle = await fs.readFileAsync(path);
    result = JSON.parse(fileHandle.toString());
  } catch (error) {
    result = {};
  }

  return result;
};

const writeJsonFile = async (fileName, data) => {
  await fs.writeFileAsync(fileName, JSON.stringify(data));
};

module.exports = {
  readJsonFile,
  writeJsonFile,
};
