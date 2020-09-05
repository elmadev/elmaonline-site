const userConfigParser = require('./userConfigParser');
const userConfigFormatter = require('./userConfigFormatter');

module.exports = {
  parser: userConfigParser,
  formatter: userConfigFormatter,
  getBattleTypeVariations: userConfigParser.getBattleTypeVariations,
  isUserConfigEmpty: userConfigFormatter.isUserConfigEmpty,
};
