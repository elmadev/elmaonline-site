const userConfigParser = require('./userConfigParser');
const userConfigFormatter = require('./userConfigFormatter');
const { UserConfig, UserConfigLists } = require('./UserConfig');
const { getBattleVariations } = require('./battleVariations');

module.exports = {
  parser: userConfigParser,
  formatter: userConfigFormatter,
  getBattleVariations,
  isUserConfigEmpty: userConfigFormatter.isUserConfigEmpty,
  UserConfig,
  UserConfigLists,
};
