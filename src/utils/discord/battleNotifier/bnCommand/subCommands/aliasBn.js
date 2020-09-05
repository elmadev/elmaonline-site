const bnBattleTypes = require('../bnBattleTypes');
const { getBattleTypeVariations } = require('../userConfig');

const aliasBn = async user => {
  const typeAliases = bnBattleTypes
    .map(bnType => getBattleTypeVariations(bnType).join(', '))
    .join('\n');
  await user.send(
    `This are all the possible aliases for battle types:\n*(can separate battle types and designer names by comma or spaces)*\n\`\`\`${typeAliases}\`\`\``,
  );
};

module.exports = aliasBn;
