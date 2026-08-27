import { action, thunk } from 'easy-peasy';
import { forEach } from 'lodash';
import { model } from 'utils/easy-peasy';
import {
  BattleLeague,
  AddBattleLeagueBattle,
  BattlesSearchByFilename,
  UpdateBattleLeagueBattle,
  DeleteBattleLeagueBattle,
} from 'api';

export default {
  league: {
    ...model(
      BattleLeague,
      AddBattleLeagueBattle,
      UpdateBattleLeagueBattle,
      DeleteBattleLeagueBattle,
    ),
  },
  battleList: [],
  setBattleList: action((state, payload) => {
    state.battleList = payload;
  }),
  findBattles: thunk(async (actions, payload) => {
    const get = await BattlesSearchByFilename({ q: payload, offset: 0 });
    if (get.ok) {
      const newList = [];
      forEach(get.data, b => {
        newList.push({
          name: `${b.LevelData.LevelName} (${b.BattleIndex}) by ${b.KuskiData.Kuski}`,
          value: b.BattleIndex,
        });
      });
      actions.setBattleList(newList);
    }
  }),
};
