const spacesRegexp = / +/g;
const commasRegexp = /,/g;

const getBattleTypeVariations = bnBattleType => {
  const typeName = bnBattleType.name.toLowerCase();
  const typeNameVariations = [typeName, ...bnBattleType.aliases];
  if (typeName.includes(' ')) {
    const noSpaceName = typeName.replace(spacesRegexp, '');
    typeNameVariations.push(noSpaceName);
  }

  return typeNameVariations;
};

const userConfigParser = ({ bnBattleTypes, keywords }) => {
  const parseDesignersInput = input => {
    const isAny = input.toLowerCase() === keywords.any;
    return isAny ? [] : input.split(spacesRegexp);
  };

  const parseBattleTypesInput = input => {
    const rawStringInput = input ? input.replace(commasRegexp, ' ') : '';

    return bnBattleTypes.reduce((acc, type) => {
      const typeNameVariations = getBattleTypeVariations(type);
      const hasType = typeNameVariations.some(variation =>
        rawStringInput.includes(variation),
      );
      return hasType ? [...acc, type.name] : acc;
    }, []);
  };

  const splitInputLine = inputLine => {
    const input = inputLine.replace(commasRegexp, ' ');
    const [rawTypesInput, rawDesignersInput] = input.split(keywords.separator);

    const battleTypesInput = rawTypesInput.trim().toLowerCase();
    const designersInput = rawDesignersInput.trim();
    return [battleTypesInput, designersInput];
  };

  const parseInputLine = inputLine => {
    const [battleTypesInput, designersInput] = splitInputLine(inputLine);

    const isIgnore = battleTypesInput.includes(keywords.ignore);
    const cleanTypesInput = isIgnore
      ? battleTypesInput.replace(keywords.ignore, ' ')
      : battleTypesInput;

    const battleTypes = parseBattleTypesInput(cleanTypesInput);
    const designers = parseDesignersInput(designersInput);

    return { isIgnore, battleTypes, designers };
  };

  const parseUserConfig = userInput => {
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
      isOn: true,
      notifyList,
      ignoreList,
    };
  };

  return { parse: parseUserConfig, parseInputLine };
};

module.exports = userConfigParser;
module.exports.getBattleTypeVariations = getBattleTypeVariations;
