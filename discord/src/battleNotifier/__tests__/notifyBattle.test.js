const { getSubscribedUserIds } = require('../notifyBattle');
const { mockStore, userConfigs, mockBattle } = require('../testUtils');
const { UserConfig } = require('../userConfig');
const bnBattleAttributes = require('../constants/bnBattleAttributes');

describe('no result cases', () => {
  test('no users returns empty array', async () => {
    const store = mockStore({});
    const battle = mockBattle({
      battleType: 'First Finish',
      designer: 'Markku',
    });
    const actual = await getSubscribedUserIds({ battle, store });
    const expected = [];
    expect(actual).toEqual(expected);
  });

  describe('no subscribed users to battle returns empty array', () => {
    test('turned off notifications ignores battle', async () => {
      const store = mockStore({ '1': userConfigs.off });
      const battle = mockBattle({ battleType: 'Normal', designer: 'Bene' });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('ignored battle type and designer', async () => {
      const store = mockStore({ '1': userConfigs.ignoredTypesAndDesigners });
      const battle = mockBattle({ battleType: 'Normal', designer: 'Chris' });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('empty notify list', async () => {
      const store = mockStore({ '1': userConfigs.emptyLists });
      const battle = mockBattle({ battleType: 'Normal', designer: 'Markku' });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('matches battle type but no desinger', async () => {
      const store = mockStore({ '1': userConfigs.typesAndDesigners });
      const battle = mockBattle({ battleType: 'Flag Tag', designer: 'Markku' });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('matches designer but no battle type', async () => {
      const store = mockStore({ '1': userConfigs.typesAndDesigners });
      const battle = mockBattle({ battleType: 'Apple', designer: 'Bene' });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });
  });
});

describe('with result cases', () => {
  test('matches battle type and designer', async () => {
    const store = mockStore({ '1': userConfigs.typesAndDesigners });
    const battle = mockBattle({
      battleType: 'Flag Tag',
      designer: 'Bene',
    });
    const actual = await getSubscribedUserIds({ battle, store });
    const expected = ['1'];
    expect(actual).toEqual(expected);
  });

  test('matches battle type and designer ignorecase', async () => {
    const store = mockStore({ '1': userConfigs.typesAndDesigners });
    const battle = mockBattle({
      battleType: 'Flag Tag',
      designer: 'bEnE',
    });
    const actual = await getSubscribedUserIds({ battle, store });
    const expected = ['1'];
    expect(actual).toEqual(expected);
  });

  test('matches battle type by any', async () => {
    const store = mockStore({ '1': userConfigs.typeOrDesigner });
    const battle = mockBattle({
      battleType: 'First Finish',
      designer: 'Markku',
    });
    const actual = await getSubscribedUserIds({ battle, store });
    const expected = ['1'];
    expect(actual).toEqual(expected);
  });

  test('matches any battle type by designer', async () => {
    const store = mockStore({ '1': userConfigs.typeOrDesigner });
    const battle = mockBattle({
      battleType: 'Speed',
      designer: 'Insguy',
    });
    const actual = await getSubscribedUserIds({ battle, store });
    const expected = ['1'];
    expect(actual).toEqual(expected);
  });

  describe('with level name patterns', () => {
    test('matches simple level pattern', async () => {
      const store = mockStore({ '1': userConfigs.levelPatterns.simple });
      const battle = mockBattle({ level: 'JoPi42' });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('matches simple level pattern ignore case', async () => {
      const store = mockStore({ '1': userConfigs.levelPatterns.simple });
      const battle = mockBattle({ level: 'jOpI12345' });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('does not start with level pattern, does not match', async () => {
      const store = mockStore({ '1': userConfigs.levelPatterns.simple });
      const battle = mockBattle({ level: 'aJoPi10' });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('complex regexp level pattern matches battle', async () => {
      const store = mockStore({ '1': userConfigs.levelPatterns.regexp });
      const battle = mockBattle({ level: 'Pob0001' });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('designers and level patterns matches battle', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [
          {
            designers: ['Markku', 'Zero'],
            levelPatterns: ['Mark', '.*Zero'],
          },
        ],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({ level: 'Mark0001', designer: 'Markku' });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('types, designers and level patterns matches battle', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [
          {
            battleTypes: ['Normal'],
            designers: ['Markku', 'Zero'],
            levelPatterns: ['Mark', '.*Zero'],
          },
        ],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({
        level: 'PipeZero',
        battleType: 'Normal',
        designer: 'Markku',
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('types, designers and level patterns does not match pattern', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [
          {
            battleTypes: ['Normal'],
            designers: ['Markku', 'Zero'],
            levelPatterns: ['Mark', '.*Zero'],
          },
        ],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({
        level: 'ZerMark1',
        battleType: 'Normal',
        designer: 'Markku',
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('types, designers and level patterns does not match designer', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [
          {
            battleTypes: ['Normal'],
            designers: ['Markku', 'Zero'],
            levelPatterns: ['Mark', '.*Zero'],
          },
        ],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({
        level: 'ZerMark1',
        battleType: 'Normal',
        designer: 'Talli',
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('types, designers and level patterns does not match type', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [
          {
            battleTypes: ['Normal', 'Apple', 'Speed'],
            designers: ['Markku', 'Zero'],
            levelPatterns: ['Mark', '.*Zero'],
          },
        ],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({
        level: 'ZerMark1',
        battleType: 'First Finish',
        designer: 'Markku',
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });
  });

  describe('with battle attributes', () => {
    test('matches battle attribute', async () => {
      const store = mockStore({ '1': userConfigs.battleAttributes });
      const battle = mockBattle({ seeOthers: true, noTurn: true });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('matches all battle attributes', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [{ battleAttributes: bnBattleAttributes.map(a => a.name) }],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({
        seeOthers: true,
        seeTimes: true,
        allowStarter: true,
        acceptBugs: true,
        noVolt: true,
        noTurn: true,
        oneTurn: true,
        noBrake: true,
        noThrottle: true,
        alwaysThrottle: true,
        drunk: true,
        oneWheel: true,
        multi: true,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('does not match one battle attribute', async () => {
      const store = mockStore({ '1': userConfigs.battleAttributes });
      const battle = mockBattle({
        seeOthers: true,
        noTurn: false,
        noVolt: true,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('matches battle attributes and type', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [
          {
            battleTypes: ['Normal', 'Apple', 'Speed'],
            battleAttributes: ['noTurn', 'noVolt', 'drunk'],
          },
        ],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({
        battleType: 'Normal',
        noTurn: true,
        noVolt: true,
        drunk: true,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('matches battle attributes does not match type', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [
          {
            battleTypes: ['Normal', 'Apple', 'Speed'],
            battleAttributes: ['noTurn', 'noVolt', 'drunk'],
          },
        ],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({
        battleType: 'First Finish',
        noTurn: true,
        noVolt: true,
        drunk: true,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('matches battle attributes and designer', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [
          {
            designers: ['Markku', 'Zero'],
            battleAttributes: ['multi', 'seeTimes'],
          },
        ],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({
        designer: 'Markku',
        multi: true,
        seeTimes: true,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('matches battle attributes does not match designer', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [
          {
            designers: ['Markku', 'Zero'],
            battleAttributes: ['multi', 'seeTimes'],
          },
        ],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({
        designer: 'Barryp',
        multi: true,
        seeTimes: true,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('matches battle attributes, type and designer', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [
          {
            battleTypes: ['First Finish', 'Normal'],
            designers: ['Markku', 'Zero'],
            battleAttributes: ['multi', 'seeTimes'],
          },
        ],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({
        battleType: 'Normal',
        designer: 'Zero',
        multi: true,
        seeTimes: true,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });
  });

  describe('with minutes duration', () => {
    test('matches battle over minDuration', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [{ minDuration: 20 }],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({ durationMinutes: 40 });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('matches battle under maxDuration', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [{ maxDuration: 40 }],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({ durationMinutes: 20 });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('matches battle equal min and max duration', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [{ minDuration: 40, maxDuration: 40 }],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({ durationMinutes: 40 });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('does not match battle under minDuration', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [{ minDuration: 40 }],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({ durationMinutes: 39 });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('does not match battle over maxDuration', async () => {
      const userConfig = UserConfig({
        username: 'Pab',
        notifyList: [{ maxDuration: 40 }],
      });
      const store = mockStore({ '1': userConfig });
      const battle = mockBattle({ durationMinutes: 41 });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });
  });

  describe('with types, designers, level patterns, attributes and minmax', () => {
    test('matches all things', async () => {
      const store = mockStore({ '1': userConfigs.all });
      const battle = mockBattle({
        battleType: 'First Finish',
        designer: 'Zero',
        level: 'Pob1234',
        seeOthers: true,
        noTurn: true,
        durationMinutes: 30,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });

    test('matches all except battle type', async () => {
      const store = mockStore({ '1': userConfigs.all });
      const battle = mockBattle({
        battleType: 'Apple',
        designer: 'Zero',
        level: 'Pob1234',
        seeOthers: true,
        noTurn: true,
        durationMinutes: 30,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('matches all except designer', async () => {
      const store = mockStore({ '1': userConfigs.all });
      const battle = mockBattle({
        battleType: 'Normal',
        designer: 'Pab',
        level: 'Pob1234',
        seeOthers: true,
        noTurn: true,
        durationMinutes: 30,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('matches all except level pattern', async () => {
      const store = mockStore({ '1': userConfigs.all });
      const battle = mockBattle({
        battleType: 'Normal',
        designer: 'Zero',
        level: 'PiZer',
        seeOthers: true,
        noTurn: true,
        durationMinutes: 30,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('matches all except one attribute', async () => {
      const store = mockStore({ '1': userConfigs.all });
      const battle = mockBattle({
        battleType: 'Normal',
        designer: 'Zero',
        level: 'PipeZero',
        seeOthers: true,
        durationMinutes: 30,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('matches all except min duration', async () => {
      const store = mockStore({ '1': userConfigs.all });
      const battle = mockBattle({
        battleType: 'Normal',
        designer: 'Zero',
        level: 'PipeZero',
        seeOthers: true,
        durationMinutes: 19,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });

    test('matches all except max duration', async () => {
      const store = mockStore({ '1': userConfigs.all });
      const battle = mockBattle({
        battleType: 'Normal',
        designer: 'Zero',
        level: 'PipeZero',
        seeOthers: true,
        durationMinutes: 41,
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = [];
      expect(actual).toEqual(expected);
    });
  });

  describe('test legacy configs', () => {
    test('only battleTypes and designers defined works correctly', async () => {
      const legacyConfig = {
        createdAt: '2020-09-15T17:37:11.563Z',
        updatedAt: '2020-09-15T19:37:39.237Z',
        isOn: true,
        notifyList: [{ battleTypes: ['Normal'], designers: [] }],
        ignoreList: [],
        username: 'ILKKA',
      };
      const store = mockStore({ '1': legacyConfig });
      const battle = mockBattle({
        battleType: 'Normal',
        designer: 'Zero',
      });
      const actual = await getSubscribedUserIds({ battle, store });
      const expected = ['1'];
      expect(actual).toEqual(expected);
    });
  });
});
