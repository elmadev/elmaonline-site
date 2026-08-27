import { writeJsonFile, readJsonFile } from './jsonFs.js';
import { createParentFolder } from '../../fileUtils.js';
import bnStore from './bnStore.js';

export default bnStore({
  writeJsonFile,
  readJsonFile,
  createParentFolder,
  dateNow: () => new Date().toISOString(),
});
