const { UserConfig, UserConfigLists } = require('../UserConfig');

describe('test user config', () => {
  test('empty object returns empty config', () => {
    const actual = UserConfig({});
    const expected = {
      createdAt: '',
      updatedAt: '',
      isOn: true,
      username: '',
      notifyList: [],
      ignoreList: [],
    };
    expect(actual).toEqual(expected);
  });

  test('filled object reutsn filled config', () => {
    const values = {
      battleAttributes: ['seeOthers', 'allowStarter'],
      battleTypes: ['Normal', 'First Finish'],
      designers: ['John', 'Adi'],
      levelPatterns: ['Pob', 'JoPi'],
      maxDuration: 30,
      minDuration: 50,
    };
    const actual = UserConfig({
      createdAt: '2020-09-15T16:49:59.977Z',
      updatedAt: '2020-09-15T16:52:33.354Z',
      isOn: true,
      username: 'Pab',
      notifyList: [values],
      ignoreList: [values],
    });
    const expected = {
      createdAt: '2020-09-15T16:49:59.977Z',
      updatedAt: '2020-09-15T16:52:33.354Z',
      isOn: true,
      username: 'Pab',
      notifyList: [values],
      ignoreList: [values],
    };
    expect(actual).toEqual(expected);
  });
});

describe('test user config lists', () => {
  test('empty object returns empty lists', () => {
    const actual = UserConfigLists({});
    const expected = { notifyList: [], ignoreList: [] };
    expect(actual).toEqual(expected);
  });

  test('empty object in list returns default values', () => {
    const actual = UserConfigLists({ notifyList: [{}], ignoreList: [{}] });
    const expected = {
      notifyList: [
        {
          battleAttributes: [],
          battleTypes: [],
          designers: [],
          levelPatterns: [],
          maxDuration: 0,
          minDuration: 0,
        },
      ],
      ignoreList: [
        {
          battleAttributes: [],
          battleTypes: [],
          designers: [],
          levelPatterns: [],
          maxDuration: 0,
          minDuration: 0,
        },
      ],
    };
    expect(actual).toEqual(expected);
  });

  test('filled object in list returns filled values', () => {
    const values = {
      battleAttributes: ['seeOthers', 'allowStarter'],
      battleTypes: ['Normal', 'First Finish'],
      designers: ['John', 'Adi'],
      levelPatterns: ['Pob', 'JoPi'],
      maxDuration: 30,
      minDuration: 50,
    };
    const actual = UserConfigLists({
      notifyList: [values],
      ignoreList: [values],
    });
    const expected = {
      notifyList: [values],
      ignoreList: [values],
    };
    expect(actual).toEqual(expected);
  });

  test('filled multiple object in list returns filled values', () => {
    const values = {
      battleAttributes: ['seeOthers', 'allowStarter'],
      battleTypes: ['Normal', 'First Finish'],
      designers: ['John', 'Adi'],
      levelPatterns: ['Pob', 'JoPi'],
      maxDuration: 30,
      minDuration: 50,
    };
    const actual = UserConfigLists({
      notifyList: [values, values, values],
      ignoreList: [values, values, values, values, values],
    });
    const expected = {
      notifyList: [values, values, values],
      ignoreList: [values, values, values, values, values],
    };
    expect(actual).toEqual(expected);
  });
});
