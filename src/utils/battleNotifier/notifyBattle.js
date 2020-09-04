const matchesValue = (array, value) => {
  const matchValue = value && value.toLowerCase();
  return (
    array.length === 0 || array.some(item => item.toLowerCase() === matchValue)
  );
};

const battleMatchesConfigItem = (battle, configItem) => {
  const { designers, battleTypes } = configItem;

  const matchesDesigner = matchesValue(designers, battle.designer);
  const matchesBattleType = matchesValue(battleTypes, battle.battleType);

  return matchesDesigner && matchesBattleType;
};

const battleMatchesConfigList = (battle, configList) =>
  configList.some(configItem => battleMatchesConfigItem(battle, configItem));

const battleMatchesUserConfig = (battle, userConfig) =>
  battleMatchesConfigList(battle, userConfig.notifyList) &&
  !battleMatchesConfigList(battle, userConfig.ignoreList);

const getSubscribedUserIds = async ({ battle, store }) => {
  const userConfigsById = await store.getAll();
  const userConfigs = Object.entries(userConfigsById);

  const userNames = userConfigs.reduce((acc, [userId, userConfig]) => {
    const mentionUser =
      userConfig.isOn && battleMatchesUserConfig(battle, userConfig);
    return mentionUser ? [...acc, userId] : acc;
  }, []);

  return userNames;
};

module.exports = { getSubscribedUserIds, battleMatchesUserConfig };
