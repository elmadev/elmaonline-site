const { keywords } = require('../../bnCommand/config');
const { bnBattleTypes, bnBattleAttributes } = require('../../constants');
const parser = require('../userConfigParser');
const { UserConfigLists } = require('../UserConfig');

const userConfigParser = parser({
  bnBattleTypes,
  bnBattleAttributes,
  keywords,
});

describe('test bad format inputs', () => {
  test('empty string returns empty config', () => {
    const actual = userConfigParser.parse('');
    expect(actual).toEqual(UserConfigLists({}));
  });

  test('input without separator (spaces included) returns empty config', () => {
    const actual = userConfigParser.parse('First Finish byMarkku');
    expect(actual).toEqual(UserConfigLists({}));
  });
});

describe('test partially bad inputs', () => {
  test('ignore empty lines or without separator', () => {
    const userInput = `First Finishby Markku
    ff by Markku
    flag tag apple Sla

    ffbyMarkku
    Ignore ff bykopaka
    Ignore normal by Markku
    Ignore ff by, Markku`;
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      ignoreList: [{ battleTypes: ['Normal'], designers: ['Markku'] }],
      notifyList: [{ battleTypes: ['First Finish'], designers: ['Markku'] }],
    });
    expect(actual).toEqual(expected);
  });

  test('repeated battle types parses battle types once', () => {
    const userInput = `NormalFirstFinish1HourTT by Markku`;
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      notifyList: [
        {
          battleTypes: ['Normal', 'First Finish', '1 Hour TT'],
          designers: ['Markku'],
        },
      ],
    });
    expect(actual).toEqual(expected);
  });

  test('random upper or lower case letters are ignored and is parsed correctly', () => {
    const userInput = `normal first FINISH 1 hOuR Tt by Markku`;
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      notifyList: [
        {
          battleTypes: ['Normal', 'First Finish', '1 Hour TT'],
          designers: ['Markku'],
        },
      ],
    });
    expect(actual).toEqual(expected);
  });
});

describe('test good inputs', () => {
  test('multiple lines are parsed correctly', () => {
    const userInput = `First Finish, Normal, Flag Tag by Markku, Sla, Kopaka
    Normal, 1 Hour TT by Bene, Pab, Zero
    Ignore Normal, Speed, Finish Count by Pab, Zero Markku`;
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      ignoreList: [
        {
          battleTypes: ['Normal', 'Speed', 'Finish Count'],
          designers: ['Pab', 'Zero', 'Markku'],
        },
      ],
      notifyList: [
        {
          battleTypes: ['Normal', 'First Finish', 'Flag Tag'],
          designers: ['Markku', 'Sla', 'Kopaka'],
        },
        {
          battleTypes: ['Normal', '1 Hour TT'],
          designers: ['Bene', 'Pab', 'Zero'],
        },
      ],
    });
    expect(actual).toEqual(expected);
  });

  test('only ignore lines results in empty notifyList', () => {
    const userInput = 'Ignore First Finish by Markku';
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      ignoreList: [{ battleTypes: ['First Finish'], designers: ['Markku'] }],
    });
    expect(actual).toEqual(expected);
  });

  test('only notify lines results in empty ignoreList', () => {
    const userInput = 'First Finish by Markku';
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      notifyList: [{ battleTypes: ['First Finish'], designers: ['Markku'] }],
    });
    expect(actual).toEqual(expected);
  });

  test('separate values by comma or spaces parses correctly', () => {
    const userInput = `First Finish Apple 1 Hour TT by Markku Pab Sla
    First Finish, Apple by Markku, Pab, Sla
    Ignore,First Finish,Apple, by ,Markku,Pab,Sla,
       First Finish       Apple, by ,     Markku,     Pab Sla`;
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      ignoreList: [
        {
          battleTypes: ['First Finish', 'Apple'],
          designers: ['Markku', 'Pab', 'Sla'],
        },
      ],
      notifyList: [
        {
          battleTypes: ['First Finish', 'Apple', '1 Hour TT'],
          designers: ['Markku', 'Pab', 'Sla'],
        },
        {
          battleTypes: ['First Finish', 'Apple'],
          designers: ['Markku', 'Pab', 'Sla'],
        },
        {
          battleTypes: ['First Finish', 'Apple'],
          designers: ['Markku', 'Pab', 'Sla'],
        },
      ],
    });
    expect(actual).toEqual(expected);
  });

  describe('test battle type aliases', () => {
    test('battle type variations without separation parses correctly', () => {
      const userInput = 'ffnormolttft by Markku';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [
          {
            battleTypes: [
              'Normal',
              'First Finish',
              'One Life',
              'Flag Tag',
              '1 Hour TT',
            ],
            designers: ['Markku'],
          },
        ],
      });
      expect(actual).toEqual(expected);
    });

    test('battle types with 2 words but no spaces parses correctly', () => {
      const userInput = 'firstfinishonelifeflagtag1hourtt by Markku';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [
          {
            battleTypes: ['First Finish', 'One Life', 'Flag Tag', '1 Hour TT'],
            designers: ['Markku'],
          },
        ],
      });
      expect(actual).toEqual(expected);
    });
  });

  describe('test any keyword', () => {
    test('any keyword or no matches for battle types, parses to empty list', () => {
      const userInput = `Any by Markku
      no matches by Markku
      Normal by any
      AnY by ANY`;
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [
          { battleTypes: [], designers: ['Markku'] },
          { battleTypes: [], designers: ['Markku'] },
          { battleTypes: ['Normal'], designers: [] },
          { battleTypes: [], designers: [] },
        ],
      });
      expect(actual).toEqual(expected);
    });
  });

  describe('test level patterns', () => {
    test('*.lev parses correctly', () => {
      const userInput = '*.lev by Markku';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [{ designers: ['Markku'], levelPatterns: ['*'] }],
      });
      expect(actual).toEqual(expected);
    });

    test('JoPi??.lev parses correctly', () => {
      const userInput = 'JoPi??.lev by Markku';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [{ designers: ['Markku'], levelPatterns: ['JoPi??'] }],
      });
      expect(actual).toEqual(expected);
    });

    test('level pattern with over 8 characters is ignored', () => {
      const userInput = 'has9chars.lev by Markku';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [{ designers: ['Markku'] }],
      });
      expect(actual).toEqual(expected);
    });

    test('mutiple level names, parses valid level names correctly', () => {
      const userInput =
        'Pob*.lev *1.lev ??*.lev has9chars.lev incorrect.lev by Markku';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [
          {
            designers: ['Markku'],
            levelPatterns: ['Pob*', '*1', '??*'],
          },
        ],
      });
      expect(actual).toEqual(expected);
    });

    test('mutiple level names, types and designers, parses valid level names correctly', () => {
      const userInput =
        'Normal Pob*.lev First *1.lev Finish ??*.lev Apple has9chars.lev by Markku1 Markku2 Markku3';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [
          {
            battleTypes: ['Normal', 'First Finish', 'Apple'],
            designers: ['Markku1', 'Markku2', 'Markku3'],
            levelPatterns: ['Pob*', '*1', '??*'],
          },
        ],
      });
      expect(actual).toEqual(expected);
    });

    test('long regexp level name pattern is parse correctly', () => {
      const userInput = '[a-zA-Z]+0+1$.lev by Markku';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [
          {
            designers: ['Markku'],
            levelPatterns: ['[a-zA-Z]+0+1$'],
          },
        ],
      });
      expect(actual).toEqual(expected);
    });
  });

  describe('test battle attributes', () => {
    test('only one attribute parses correctly', () => {
      const userInput = '(See others) by Markku';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [
          { battleAttributes: ['seeOthers'], designers: ['Markku'] },
        ],
      });
      expect(actual).toEqual(expected);
    });

    test('ignorecase attributes parses correctly', () => {
      const userInput = '(SEE othERS Allow STARTER) by Markku';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [
          {
            battleAttributes: ['seeOthers', 'allowStarter'],
            designers: ['Markku'],
          },
        ],
      });
      expect(actual).toEqual(expected);
    });

    test('all attributes case parses correctly', () => {
      const userInput =
        '(see others, see times, allow starter, accept bugs, no volt, no turn, one turn, no brake, no throttle, always throttle, drunk, one wheel, multi) by any';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
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
      });
      expect(actual).toEqual(expected);
    });

    test('attributes, types and designers parses correctly', () => {
      const userInput =
        'Normal First Finish (see others, see times, drunk, multi) by Markku Pab Zero';
      const actual = userConfigParser.parse(userInput);
      const expected = UserConfigLists({
        notifyList: [
          {
            battleTypes: ['Normal', 'First Finish'],
            battleAttributes: ['seeOthers', 'seeTimes', 'drunk', 'multi'],
            designers: ['Markku', 'Pab', 'Zero'],
          },
        ],
      });
      expect(actual).toEqual(expected);
    });
  });
});

describe('test min and max duration minutes', () => {
  test('min battle time parses correctly', () => {
    const userInput = '>30 by any';
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({ notifyList: [{ minDuration: 30 }] });
    expect(actual).toEqual(expected);
  });

  test('max battle time parses correctly', () => {
    const userInput = '<20 by any';
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({ notifyList: [{ maxDuration: 20 }] });
    expect(actual).toEqual(expected);
  });

  test('minmax battle time parses correctly', () => {
    const userInput = '>25 <45 by any';
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      notifyList: [{ minDuration: 25, maxDuration: 45 }],
    });
    expect(actual).toEqual(expected);
  });

  test('minmax, types and attributes parses correctly', () => {
    const userInput = 'Normal First Finish >25 <45 (noTurn, noVolt) by any';
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      notifyList: [
        {
          minDuration: 25,
          maxDuration: 45,
          battleTypes: ['Normal', 'First Finish'],
          battleAttributes: ['noVolt', 'noTurn'],
        },
      ],
    });
    expect(actual).toEqual(expected);
  });

  test('minmax battle time with spaces parses correctly', () => {
    const userInput = '< 30 > 20 by any';
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      notifyList: [{ minDuration: 20, maxDuration: 30 }],
    });
    expect(actual).toEqual(expected);
  });
});

describe('test inputs combining all rules', () => {
  test('types, designers, patterns, attributes and minmax parses correctly', () => {
    const userInput =
      'Normal First Finish Pob.lev ^Zero*.lev (see others, see times, drunk, multi) >20 <40 by Markku Pab Zero';
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      notifyList: [
        {
          battleTypes: ['Normal', 'First Finish'],
          battleAttributes: ['seeOthers', 'seeTimes', 'drunk', 'multi'],
          designers: ['Markku', 'Pab', 'Zero'],
          levelPatterns: ['Pob', '^Zero*'],
          minDuration: 20,
          maxDuration: 40,
        },
      ],
    });
    expect(actual).toEqual(expected);
  });

  test('all without all unnecessary spaces parses correctly', () => {
    const userInput =
      'NormalFirstFinish Pob.lev ^Zero*.lev (seeothersseetimesdrunkmulti)>20<40 by Markku Pab Zero';
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      notifyList: [
        {
          battleTypes: ['Normal', 'First Finish'],
          battleAttributes: ['seeOthers', 'seeTimes', 'drunk', 'multi'],
          designers: ['Markku', 'Pab', 'Zero'],
          levelPatterns: ['Pob', '^Zero*'],
          minDuration: 20,
          maxDuration: 40,
        },
      ],
    });
    expect(actual).toEqual(expected);
  });

  test('parse set bn message example', () => {
    const userInput = `Normal, First Finish, Flag Tag by any
    Apple (see others, drunk) by Pab, Markku, Sla
    Any Pob.lev, jbl.lev >20 by any
    Ignore any by Grob`;
    const actual = userConfigParser.parse(userInput);
    const expected = UserConfigLists({
      notifyList: [
        {
          battleTypes: ['Normal', 'First Finish', 'Flag Tag'],
        },
        {
          battleTypes: ['Apple'],
          battleAttributes: ['seeOthers', 'drunk'],
          designers: ['Pab', 'Markku', 'Sla'],
        },
        {
          levelPatterns: ['Pob', 'jbl'],
          minDuration: 20,
        },
      ],
      ignoreList: [
        {
          designers: ['Grob'],
        },
      ],
    });
    expect(actual).toEqual(expected);
  });
});
