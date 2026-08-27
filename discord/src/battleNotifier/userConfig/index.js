import userConfigParser from './userConfigParser.js';
import userConfigFormatter from './userConfigFormatter.js';
import { UserConfig, UserConfigLists } from './UserConfig.js';
import { getBattleVariations } from './battleVariations.js';

export default {
  parser: userConfigParser,
  formatter: userConfigFormatter,
  getBattleVariations,
  areUserConfigListsEmpty: userConfigFormatter.areUserConfigListsEmpty,
  isSimpleLevelPattern: userConfigParser.isSimpleLevelPattern,
  UserConfig,
  UserConfigLists,
};

export { default as parser } from './userConfigParser.js';
export { default as formatter } from './userConfigFormatter.js';
export { getBattleVariations } from './battleVariations.js';
export { areUserConfigListsEmpty } from './userConfigFormatter.js';
export { isSimpleLevelPattern } from './userConfigParser.js';
export { UserConfig, UserConfigLists } from './UserConfig.js';
