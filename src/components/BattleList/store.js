/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { BattleList } from 'data/api';

export default {
  battles: {},
  setBattles: action((state, payload) => {
    state.battles = payload;
  }),
  getBattles: thunk(async (actions, payload) => {
    const get = await BattleList(payload);
    if (get.ok) {
      actions.setBattles(get.data);
    }
  }),
};
