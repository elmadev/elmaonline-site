const firstResult = jestFn => jestFn.mock.results[0].value;

const expectAsyncResult = async (jestFn, expected) => {
  const actual = firstResult(jestFn);
  await expect(actual).resolves.toEqual(expected);
};

const expectAsyncResultProperty = async (jestFn, property, expected) => {
  const actual = firstResult(jestFn);
  await expect(actual).resolves.toHaveProperty(property, expected);
};

module.exports = {
  expectAsyncResult,
  expectAsyncResultProperty,
};
