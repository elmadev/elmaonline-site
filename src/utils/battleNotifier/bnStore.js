const fs = require('fs').promises;

const readJsonFile = async path => {
  let result = {};
  try {
    const fileHandle = await fs.readFile(path);
    result = JSON.parse(fileHandle.toString());
  } catch {
    result = {};
  }

  return result;
};

const writeJsonFile = async (fileName, data) => {
  await fs.writeFile(fileName, JSON.stringify(data));
};

const createBnStore = path => {
  const getAll = async () => {
    return readJsonFile(path);
  };

  const get = async userId => {
    const bnStore = await getAll();
    return bnStore[userId];
  };

  const set = async (userId, value) => {
    const bnStore = await getAll();
    const userConfig = { ...bnStore[userId], ...value };
    const data = { ...bnStore, [userId]: userConfig };
    await writeJsonFile(path, data);
  };

  return {
    get,
    set,
    getAll,
  };
};

module.exports = createBnStore;
