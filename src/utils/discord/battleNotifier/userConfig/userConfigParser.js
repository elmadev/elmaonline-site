const { parseBattleVariations } = require('./battleVariations');

const spacesRegexp = / +/g;
const moreThanOneSpaceRegexp = /\s\s+/g;
const commasRegexp = /,/g;
const getLevelPatternsRegexp = suffix => new RegExp(`^.*${suffix}$`, 'gi');

const onlyWordsRegExp = /^\w+$/;
const isSimpleLevelPattern = string => onlyWordsRegExp.test(string);

const substringInBetween = (input, startChar, endChar) => {
  const startIndex = input.indexOf(startChar) + 1;
  const endIndex = input.indexOf(endChar, startChar);
  return input.substring(startIndex, endIndex);
};

const getPrefixedNumber = (input, prefix) => {
  const indexOfPrefix = input.indexOf(prefix);
  if (indexOfPrefix === -1) return 0;

  const inputFromPrefix = input.substring(indexOfPrefix);
  const matches = inputFromPrefix.match(/[0-9]+/);
  return matches ? Number(matches[0]) : 0;
};

const isValidLevelPattern = input =>
  Boolean(input) &&
  (!isSimpleLevelPattern(input) || (input.length > 0 && input.length <= 8));

const userConfigParser = ({ bnBattleTypes, bnBattleAttributes, keywords }) => {
  const parseDesignersInput = input => {
    const isAny = input.toLowerCase() === keywords.any;
    return isAny ? [] : input.split(spacesRegexp);
  };

  const levelPatternsRegexp = getLevelPatternsRegexp(
    keywords.levelPatternSuffix,
  );
  const parseLevelPattern = input => {
    const match = input.match(levelPatternsRegexp);
    return match ? match[0].replace(keywords.levelPatternSuffix, '') : '';
  };

  const extractLevelPatterns = input => {
    const parts = input.split(' ');
    const levelPatterns = parts.reduce((result, part) => {
      const levelPattern = parseLevelPattern(part);
      const isValid = isValidLevelPattern(levelPattern);
      return isValid ? [...result, levelPattern] : result;
    }, []);

    const restOfInput = parts
      .filter(part => !part.match(levelPatternsRegexp))
      .join(' ');
    return [levelPatterns, restOfInput];
  };

  const extractBattleAttributes = input => {
    const attrInput = substringInBetween(input, '(', ')');
    const battleAttributes = parseBattleVariations(
      attrInput,
      bnBattleAttributes,
    );
    const restOfInput = input.replace(`(${attrInput})`, '');
    return [battleAttributes, restOfInput];
  };

  const parseDurations = input => {
    const minDuration = getPrefixedNumber(input, '>');
    const maxDuration = getPrefixedNumber(input, '<');
    return { minDuration, maxDuration };
  };

  const parseLeftSide = input => {
    const [battleAttributes, noAttrInput] = extractBattleAttributes(input);
    const { minDuration, maxDuration } = parseDurations(input);
    const [levelPatterns, noLevInput] = extractLevelPatterns(noAttrInput);
    const battleTypes = parseBattleVariations(noLevInput, bnBattleTypes);
    return {
      battleTypes,
      levelPatterns,
      battleAttributes,
      minDuration,
      maxDuration,
    };
  };

  const splitInputLine = inputLine => {
    const input = inputLine
      .replace(commasRegexp, ' ')
      .replace(moreThanOneSpaceRegexp, ' ');
    const [rawTypesInput = '', rawDesignersInput = ''] = input.split(
      keywords.separator,
    );

    const leftSide = rawTypesInput.trim();
    const designersInput = rawDesignersInput.trim();
    return [leftSide, designersInput];
  };

  const parseInputLine = inputLine => {
    const [leftSideInput, designersInput] = splitInputLine(inputLine);

    const isIgnore = leftSideInput.toLowerCase().startsWith(keywords.ignore);
    const cleanLeftSide = isIgnore
      ? leftSideInput.replace(keywords.ignore, ' ')
      : leftSideInput;

    const {
      battleTypes,
      levelPatterns,
      battleAttributes,
      minDuration,
      maxDuration,
    } = parseLeftSide(cleanLeftSide);
    const designers = parseDesignersInput(designersInput);

    return {
      isIgnore,
      battleTypes,
      designers,
      levelPatterns,
      battleAttributes,
      minDuration,
      maxDuration,
    };
  };

  const parseUserConfigLists = userInput => {
    const notifyList = [];
    const ignoreList = [];

    const splitLines = userInput.split('\n');
    splitLines.forEach(inputLine => {
      if (inputLine.includes(keywords.separator)) {
        const { isIgnore, ...configLine } = parseInputLine(inputLine);
        if (isIgnore) {
          ignoreList.push(configLine);
        } else {
          notifyList.push(configLine);
        }
      }
    });

    return {
      notifyList,
      ignoreList,
    };
  };

  return { parse: parseUserConfigLists, parseInputLine };
};

module.exports = userConfigParser;
module.exports.isSimpleLevelPattern = isSimpleLevelPattern;
