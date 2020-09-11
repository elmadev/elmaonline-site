const { writeJsonFile, readJsonFile } = require('./jsonFs');
const { createParentFolder } = require('../../fileUtils');

const createBnStore = path => {
  createParentFolder(path);

  const getAll = async () => {
    return readJsonFile(path);
  };

  const get = async userId => {
    const bnStore = await getAll();
    return bnStore[userId];
  };

  const set = async (userId, values) => {
    const bnStore = await getAll();

    const updatedAt = new Date().toISOString();
    const newConfig = {
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
