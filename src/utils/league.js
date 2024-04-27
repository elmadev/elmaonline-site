import { BattleLeagueBattle } from '#data/models';

export const updateLeague = async battle => {
  if (battle.level && battle.battleIndex) {
    const find = await BattleLeagueBattle.findAll({
      where: { BattleIndex: 0, LevelName: battle.level },
    });
    if (find.length > 0) {
      await BattleLeagueBattle.update(
        { BattleIndex: battle.battleIndex },
        { where: { BattleIndex: 0, LevelName: battle.level } },
      );
    }
  }
};

export const dummy = () => {};
