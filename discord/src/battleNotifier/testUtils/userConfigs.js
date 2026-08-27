const userConfigsExample1 = require('./userConfigsExample1');

const userConfigs = {
  typesAndDesigners: userConfigsExample1['1'],
  typeOrDesigner: userConfigsExample1['2'],
  off: userConfigsExample1['3'],
  ignoredTypesAndDesigners: userConfigsExample1['4'],
  emptyLists: userConfigsExample1['5'],
  levelPatterns: {
    simple: userConfigsExample1['6'],
    regexp: userConfigsExample1['7'],
  },
  battleAttributes: userConfigsExample1['8'],
  all: userConfigsExample1['9'],
};

module.exports = userConfigs;
