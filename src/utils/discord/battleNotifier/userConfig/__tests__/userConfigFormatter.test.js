const { keywords } = require('../../bnCommand/config');
const { formatter, UserConfigLists } = require('../../userConfig');
const { userConfigs } = require('../../testUtils');

const userConfigFormatter = formatter({ keywords });

describe('format user configs', () => {
  test('empty lists returns empty string', () => {
    const actual = userConfigFormatter.toString(userConfigs.emptyLists);
    const expected = '';
    expect(actual).toEqual(expected);
  });

  test('types and designers retrns battle types by designers', () => {
    const actual = userConfigFormatter.toString(userConfigs.typesAndDesigners);
    const expected = 'Normal, First Finish, Flag Tag by Bene, Sla, Spef';
    expect(actual).toEqual(expected);
  });

  test('type or designer retruns battle type by any and any by designer', () => {
    const actual = userConfigFormatter.toString(userConfigs.typeOrDesigner);
    const expected = 'First Finish by any\nAny by insguy';
    expect(actual).toEqual(expected);
  });

  test('ignore types and designers retruns ignores', () => {
    const actual = userConfigFormatter.toString(
      userConfigs.ignoredTypesAndDesigners,
    );
    const expected = 'Normal by any\nIgnore Normal by Chris, TL';
    expect(actual).toEqual(expected);
  });

  test('simple level pattern returns correctly', () => {
    const actual = userConfigFormatter.toString(
      userConfigs.levelPatterns.simple,
    );
    const expected = 'JoPi.lev by any';
    expect(actual).toEqual(expected);
  });

  test('complex level pattern returns correctly', () => {
    const actual = userConfigFormatter.toString(
      userConfigs.levelPatterns.regexp,
    );
    const expected = '[a-zA-Z]+0+1$.lev by any';
    expect(actual).toEqual(expected);
  });

  test('battle types, designers and level patterns returns correctly', () => {
    const actual = userConfigFormatter.toString(
      UserConfigLists({
        notifyList: [
          {
            battleTypes: ['Normal', 'First Finish', 'Apple'],
            designers: ['Markku', 'Sla', 'Zero'],
            levelPatterns: ['.*Pi.*', '^zer', 'lev$'],
          },
        ],
      }),
    );
    const expected =
      'Normal, First Finish, Apple, .*Pi.*.lev, ^zer.lev, lev$.lev by Markku, Sla, Zero';
    expect(actual).toEqual(expected);
  });

  test('single battle attribute by any returns correctly', () => {
    const actual = userConfigFormatter.toString(
      UserConfigLists({
        notifyList: [
          {
            battleAttributes: ['seeOthers'],
          },
        ],
      }),
    );
    const expected = '(see others) by any';
    expect(actual).toEqual(expected);
  });

  test('all attributes by any returns correctly', () => {
    const actual = userConfigFormatter.toString(
      UserConfigLists({
        notifyList: [
          {
            battleAttributes: [
              'seeOthers',
              'seeTimes',
              'allowStarter',
              'acceptBugs',
              'noVolt',
              'noTurn',
              'oneTurn',
              'noBrake',
              'noThrottle',
              'alwaysThrottle',
              'drunk',
              'oneWheel',
              'multi',
            ],
          },
        ],
      }),
    );
    const expected =
      '(see others, see times, allow starter, accept bugs, no volt, no turn, one turn, no brake, no throttle, always throttle, drunk, one wheel, multi) by any';
    expect(actual).toEqual(expected);
  });

  test('types, designers and attributes returns correctly', () => {
    const actual = userConfigFormatter.toString(
      UserConfigLists({
        notifyList: [
          {
            battleTypes: ['Normal', 'First Finish', 'Apple'],
            designers: ['Markku', 'Sla', 'Zero'],
            battleAttributes: ['seeOthers', 'allowStarter', 'multi'],
          },
        ],
      }),
    );
    const expected =
      'Normal, First Finish, Apple (see others, allow starter, multi) by Markku, Sla, Zero';
    expect(actual).toEqual(expected);
  });

  test('types, deisngers, attributes and level patterns returns correctly', () => {
    const actual = userConfigFormatter.toString(
      UserConfigLists({
        notifyList: [
          {
            battleTypes: ['Normal', 'First Finish', 'Apple'],
            designers: ['Markku', 'Sla', 'Zero'],
            battleAttributes: ['seeOthers', 'allowStarter', 'multi'],
            levelPatterns: ['.*Pi.*', '^zer', 'lev$'],
          },
        ],
      }),
    );
    const expected =
      'Normal, First Finish, Apple, .*Pi.*.lev, ^zer.lev, lev$.lev (see others, allow starter, multi) by Markku, Sla, Zero';
    expect(actual).toEqual(expected);
  });

  test('min duration returns correctly', () => {
    const actual = userConfigFormatter.toString(
      UserConfigLists({ notifyList: [{ minDuration: 20 }] }),
    );
    const expected = '>20 by any';
    expect(actual).toEqual(expected);
  });

  test('max duration returns correctly', () => {
    const actual = userConfigFormatter.toString(
      UserConfigLists({ notifyList: [{ maxDuration: 45 }] }),
    );
    const expected = '<45 by any';
    expect(actual).toEqual(expected);
  });

  test('types, deisngers, level patterns and minmax returns correctly', () => {
    const actual = userConfigFormatter.toString(
      UserConfigLists({
        notifyList: [
          {
            battleTypes: ['Normal', 'First Finish', 'Apple'],
            designers: ['Markku', 'Sla', 'Zero'],
            levelPatterns: ['.*Pi.*', '^zer', 'lev$'],
            minDuration: 20,
            maxDuration: 45,
          },
        ],
      }),
    );
    const expected =
      'Normal, First Finish, Apple, .*Pi.*.lev, ^zer.lev, lev$.lev, >20 <45 by Markku, Sla, Zero';
    expect(actual).toEqual(expected);
  });

  test('types, deisngers, attributes, level patterns and minmax returns correctly', () => {
    const actual = userConfigFormatter.toString(
      UserConfigLists({
        notifyList: [
          {
            battleTypes: ['Normal', 'First Finish', 'Apple'],
            designers: ['Markku', 'Sla', 'Zero'],
            battleAttributes: ['seeOthers', 'allowStarter', 'multi'],
            levelPatterns: ['.*Pi.*', '^zer', 'lev$'],
            minDuration: 20,
            maxDuration: 45,
          },
        ],
      }),
    );
    const expected =
      'Normal, First Finish, Apple, .*Pi.*.lev, ^zer.lev, lev$.lev (see others, allow starter, multi) >20 <45 by Markku, Sla, Zero';
    expect(actual).toEqual(expected);
  });
});
