const { writeJsonFile, readJsonFile } = require('./jsonFs');
const { createParentFolder } = require('../../fileUtils');
const bnStore = require('./bnStore');

module.exports = bnStore({
  writeJsonFile,
  readJsonFile,
  createParentFolder,
  dateNow: () => new Date().toISOString(),
});
