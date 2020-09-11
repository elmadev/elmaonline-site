const fs = require('fs');
const util = require('util');
const { dirname } = require('path');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdirAsync = util.promisify(fs.mkdir);

const createFolder = async path => {
  await mkdirAsync(path, { recursive: true });
};

const createParentFolder = async path => {
  const folderPath = dirname(path);
  await createFolder(folderPath);
};

module.exports = { readFile, writeFile, createFolder, createParentFolder };
