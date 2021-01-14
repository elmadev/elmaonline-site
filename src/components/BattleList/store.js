/* eslint-disable no-param-reassign */
import { action, thunk, computed } from 'easy-peasy';
import { BattleListPeriod } from 'data/api';

export default {
  battles: {},
  setBattles: action((state, payload) => {
    state.battles = payload;
  }),
  getBattles: thunk(async (actions, payload) => {
    const get = await BattleListPeriod(payload);
    if (get.ok) {
      actions.setBattles(get.data);
    }
  }),
  currentBattle: computed(state => {
    if (Array.isArray(state.battles)) {
      return state.battles.filter(
        i => i.InQueue === 0 && i.Finished === 0 && i.Aborted === 0,
      )[0];
    }
    return null;
  }),
};
