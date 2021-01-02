/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
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
};
