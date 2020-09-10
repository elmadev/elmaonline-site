const { bnAdminIds } = require('../../config');
const getUserConfig = require('./getUserConfig');
const getAllUserConfigs = require('./getAllUserConfigs');
const getLog = require('./getLog');

const getBn = async ({ user, store, args }) => {
  const isBnAdmin = bnAdminIds.includes(user.id);
  const option = args[1];

  if (isBnAdmin && option === 'log') {
    await getLog({ user, date: args[2] });
  } else if (isBnAdmin && option === 'store') {
    await getAllUserConfigs({ user, store });
  } else {
    await getUserConfig({ user, store });
  }
};

module.exports = getBn;
