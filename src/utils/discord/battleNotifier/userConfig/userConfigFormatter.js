const commaSeparator = ', ';
const cammelCaseRegexp = /([a-z])([A-Z])/g;

const separateCammelCase = value => value.replace(cammelCaseRegexp, '$1 $2');

const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatValues = (values, separator, format = value => value) => {
  const cleanedValeus = values.filter(value => Boolean(value));
  return cleanedValeus.map(value => format(value)).join(separator);
};

const areUserConfigListsEmpty = userConfig => {
  return (
    userConfig.notifyList.length === 0 && userConfig.ignoreList.length === 0
  );
};

const formatDuration = item => {
  let result = '';
  if (item.minDuration > 0) {
    result = `>${item.minDuration}`;
  }

  if (item.maxDuration > 0) {
    const maxDuration = `<${item.maxDuration}`;
    result = result ? `${result} ${maxDuration}` : maxDuration;
  }

  return result;
};

const userConfigFormatter = ({ keywords }) => {
  const getLeftSideString = (item, isIgnore) => {
    let result = '';

    if (item.battleTypes.length > 0) {
      result += formatValues(item.battleTypes, commaSeparator);
    }

    if (item.levelPatterns.length > 0) {
      const levelPatterns = formatValues(
        item.levelPatterns,
        commaSeparator,
        value => `${value}${keywords.levelPatternSuffix}`,
      );
      result = result
        ? formatValues([result, levelPatterns], commaSeparator)
        : levelPatterns;
    }

    const hasBattleAttributes = item.battleAttributes.length > 0;
    if (hasBattleAttributes) {
      const battleAttributes = formatValues(
        item.battleAttributes,
        commaSeparator,
        value => separateCammelCase(value).toLowerCase(),
      );
      const formattedAttrs = `(${battleAttributes})`;
      result = result ? `${result} ${formattedAttrs}` : formattedAttrs;
    }

    const hasDuration = item.minDuration > 0 || item.maxDuration > 0;
    if (hasDuration) {
      const duration = formatDuration(item);
      const separator = hasBattleAttributes ? ' ' : commaSeparator;
      result = result ? `${result}${separator}${duration}` : duration;
    }

    const leftSideAny = isIgnore ? keywords.any : capitalize(keywords.any);
    return result || leftSideAny;
  };

  const listItemToString = (item, isIgnore) => {
    const ignore = isIgnore ? `${capitalize(keywords.ignore)} ` : '';
    const designers = formatValues(item.designers, commaSeparator);

    const leftSide = getLeftSideString(item, isIgnore);
    const rightSide = designers || keywords.any;

    return `${ignore}${leftSide}${keywords.separator}${rightSide}`;
  };

  const configListToString = (list, isIgnore = false) => {
    const stringValues = list.map(item => listItemToString(item, isIgnore));
    return stringValues.join('\n');
  };

  const userConfigToString = userConfig => {
    let result = '';

    const isEmpty = areUserConfigListsEmpty(userConfig);
    if (!isEmpty) {
      const notify = configListToString(userConfig.notifyList);
      const ignore = configListToString(userConfig.ignoreList, true);
      result = `${notify}${notify && ignore ? '\n' : ''}${ignore}`;
    }

    return result;
  };

  return { toString: userConfigToString };
};

module.exports = userConfigFormatter;
module.exports.areUserConfigListsEmpty = areUserConfigListsEmpty;
