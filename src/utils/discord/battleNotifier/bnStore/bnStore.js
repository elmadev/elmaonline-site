const { UserConfig } = require('../userConfig');

const createBnStore = ({
  writeJsonFile,
  readJsonFile,
  createParentFolder,
  dateNow,
}) => path => {
  createParentFolder(path);

  const getAll = async () => {
    return readJsonFile(path);
  };

  const get = async userId => {
    const bnStore = await getAll();
    const storedConfig = bnStore[userId];
    return storedConfig && UserConfig(storedConfig);
  };

  const set = async (userId, values) => {
    const bnStore = await getAll();

    const updatedAt = dateNow();
    const newConfig = UserConfig({
      createdAt: updatedAt,
      ...bnStore[userId],
      updatedAt,
      ...values,
    });

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
