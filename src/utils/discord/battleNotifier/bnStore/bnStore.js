const { writeJsonFile, readJsonFile } = require('./jsonFs');
const { createParentFolder } = require('../../fileUtils');
const { UserConfig } = require('../userConfig');

const createBnStore = path => {
  createParentFolder(path);

  const getAll = async () => {
    return readJsonFile(path);
  };

  const get = async userId => {
    const bnStore = await getAll();
    const storedConfig = bnStore[userId];
    return UserConfig(storedConfig);
  };

  const set = async (userId, values) => {
    const bnStore = await getAll();

    const updatedAt = new Date().toISOString();
    const newConfig = {
      isOn: true,
      createdAt: updatedAt,
      ...bnStore[userId],
      updatedAt,
      ...values,
    };

    const data = { ...bnStore, [userId]: newConfig };
    await writeJsonFile(path, data);
  };

  return {
    get,
    set,
    getAll,
    path,
  };
};

module.exports = createBnStore;
