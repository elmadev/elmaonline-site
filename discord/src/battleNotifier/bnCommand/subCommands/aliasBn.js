import { bnBattleTypes, bnBattleAttributes } from '../../constants/index.js';
import { getBattleVariations } from '../../userConfig/index.js';

const codeBlock = code => `\`\`\`${code}\`\`\``;

const aliasBn = async user => {
  const typeAliases = bnBattleTypes
    .map(bnType => getBattleVariations(bnType).join(', '))
    .join('\n');

  const attrAliases = bnBattleAttributes
    .map(bnType => getBattleVariations(bnType).join(', '))
    .join('\n');

  await user.send(
    `This are all the possible aliases for battle types and battle attributes:\n*(while setting your notifications, you can always separate values by comma or spaces)*\n\nBattle Types:${codeBlock(
      typeAliases,
    )}\nBattle Attributes:${codeBlock(attrAliases)}`,
  );
};

export default aliasBn;
