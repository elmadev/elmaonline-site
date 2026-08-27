const bnStore = require('../bnStore');
const { userConfigsExample1: exampleConfigs } = require('../../testUtils');
const { UserConfig } = require('../../userConfig');

let store;
let writeJsonFile;
let readJsonFile;
let createParentFolder;
let dateNow;
const testPath = 'path/to/storeFile';
const mockStore = () =>
  bnStore({ writeJsonFile, readJsonFile, createParentFolder, dateNow })(
    testPath,
  );

const createdAtTestDate = '2020-09-15T16:49:59.977Z';
const updatedAtTest = '2020-10-10T12:34:56.789z';

beforeEach(() => {
  writeJsonFile = jest.fn(() => Promise.resolve());
  createParentFolder = jest.fn(() => Promise.resolve());
});

describe('tests without a config file created yet', () => {
  beforeEach(() => {
    readJsonFile = jest.fn(() => Promise.resolve({}));
    dateNow = jest.fn(() => createdAtTestDate);
    store = mockStore();
  });

  test('get user config returns undefined', async () => {
    const actual = await store.get('1');
    expect(actual).toBeUndefined();
  });

  test('set user config success', async () => {
    const userConfig = exampleConfigs['1'];
    await store.set('1', userConfig);

    const expectedConfig = {
      '1': {
        createdAt: createdAtTestDate,
        ...userConfig,
      },
    };
    expect(writeJsonFile).toBeCalledWith(testPath, expectedConfig);
  });
});

describe('tests with a config file already created', () => {
  describe('test get user config', () => {
    beforeEach(() => {
      readJsonFile = jest.fn(() => Promise.resolve(exampleConfigs));
      store = mockStore();
    });

    test('get user config from user', async () => {
      const actual = await store.get('1');
      expect(actual).toEqual(exampleConfigs['1']);
    });

    test('get all configs', async () => {
      const result = await store.getAll();
      expect(result).toEqual(exampleConfigs);
    });
  });

  describe('set new user config', () => {
    beforeEach(() => {
      readJsonFile = jest.fn(() => Promise.resolve(exampleConfigs));
      dateNow = jest.fn(() => createdAtTestDate);
      store = mockStore();
    });

    test('with no values', async () => {
      const newConfig = {};
      await store.set('100', newConfig);

      const expectedArg = {
        ...exampleConfigs,
        '100': UserConfig({
          isOn: true,
          createdAt: createdAtTestDate,
          updatedAt: createdAtTestDate,
        }),
      };
      expect(writeJsonFile).toHaveBeenLastCalledWith(testPath, expectedArg);
    });

    test('set new config with values', async () => {
      const newConfig = {
        userName: 'Spef',
        notifyList: [
          {
            battleTypes: ['Speed', 'Finish Count'],
            designers: ['Pab', 'Sla'],
          },
        ],
      };
      await store.set('100', newConfig);

      const expectedArg = {
        ...exampleConfigs,
        '100': UserConfig({
          ...newConfig,
          isOn: true,
          createdAt: createdAtTestDate,
          updatedAt: createdAtTestDate,
        }),
      };
      expect(writeJsonFile).toHaveBeenLastCalledWith(testPath, expectedArg);
    });
  });

  describe('update existing user config', () => {
    beforeEach(() => {
      readJsonFile = jest.fn(() => Promise.resolve(exampleConfigs));
      dateNow = jest.fn(() => updatedAtTest);
      store = mockStore();
    });

    test('without createdAt sets createdAt from updatedAt', async () => {
      const testStore = {
        '1': { ...exampleConfigs['1'], createdAt: undefined },
      };
      delete testStore['1'].createdAt;

      readJsonFile = jest.fn(() => Promise.resolve(testStore));
      store = mockStore();
      await store.set('1', {});

      const expectedArg = {
        '1': UserConfig({
          ...exampleConfigs['1'],
          updatedAt: updatedAtTest,
          createdAt: updatedAtTest,
        }),
      };
      expect(writeJsonFile).toHaveBeenLastCalledWith(testPath, expectedArg);
    });

    test("with new values doesn't override other current values", async () => {
      const newValues = {
        notifyList: [{ battleTypes: 'First Finish', designers: 'Sla' }],
      };
      await store.set('1', newValues);

      const expectedArg = {
        ...exampleConfigs,
        '1': UserConfig({
          ...exampleConfigs['1'],
          ...newValues,
          updatedAt: updatedAtTest,
          createdAt: '2020-09-11T20:43:03.537Z',
        }),
      };
      expect(writeJsonFile).toHaveBeenLastCalledWith(testPath, expectedArg);
    });

    test('with updated values, overrides current values', async () => {
      const newValues = {
        username: 'Pab',
        createdAt: '2019-08-01T21:00:00.123Z',
        updatedAt: '2020-08-01T21:00:00.123Z',
        isOn: false,
        notifyList: [],
        ignoreList: [{ battleTypes: ['First Finish'], designers: [] }],
      };
      await store.set('1', newValues);

      const expectedArg = {
        ...exampleConfigs,
        '1': UserConfig({
          ...newValues,
        }),
      };
      expect(writeJsonFile).toHaveBeenLastCalledWith(testPath, expectedArg);
    });
  });
});
