const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const listItemToString = item => {
  return Object.values(item).join(', ');
};

const isUserConfigEmpty = userConfig => {
  return (
    userConfig.notifyList.length === 0 && userConfig.ignoreList.length === 0
  );
};

const userConfigFormatter = ({ keywords }) => {
  const configListToString = (list, isIgnore = false) => {
    const stringValues = list.map(item => {
      const ignore = isIgnore ? `${capitalize(keywords.ignore)} ` : '';
      const anyBattleType = isIgnore ? keywords.any : capitalize(keywords.any);
      const battleTypes = listItemToString(item.battleTypes) || anyBattleType;
      const designers = listItemToString(item.designers) || keywords.any;

      return `${ignore}${battleTypes}${keywords.separator}${designers}`;
    });
    return stringValues.join('\n');
  };

  const userConfigToString = userConfig => {
    let result = '';

    const isEmpty = isUserConfigEmpty(userConfig);
    if (!isEmpty) {
      const notify = configListToString(userConfig.notifyList);
      const ignore = configListToString(userConfig.ignoreList, true);
      result = `${notify}${notify && ignore ? '\n' : ''}${ignore}`;
    } else {
      result =
        'No notifications set, please use `!bn` to set your configuration';
    }

    return result;
  };

  return { toString: userConfigToString };
};

module.exports = userConfigFormatter;
module.exports.isUserConfigEmpty = isUserConfigEmpty;
