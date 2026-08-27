import { action, thunk, computed } from 'easy-peasy';
import { BattleListPeriod, LatestBattles } from 'api';

export default {
  battles: {},
  setBattles: action((state, payload) => {
    state.battles = payload;
  }),
  getBattles: thunk(async (actions, payload) => {
    if (payload.latest) {
      const get = await LatestBattles(payload.limit + 10);
      if (get.ok && Array.isArray(get.data)) {
        const countInQueue = get.data.filter(d => d.InQueue === 1);
        actions.setBattles(
          get.data.slice(
            0,
            Math.max(payload.limit || 5, countInQueue.length + 2),
          ),
        );
      }
    } else {
      const get = await BattleListPeriod(payload);
      if (get.ok) {
        actions.setBattles(get.data);
      }
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
