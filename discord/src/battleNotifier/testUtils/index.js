const mocks = require('./mocks');
const userConfigsExample1 = require('./userConfigsExample1');
const userConfigs = require('./userConfigs');
const assertions = require('./assertions');

module.exports = { ...mocks, userConfigs, userConfigsExample1, ...assertions };
