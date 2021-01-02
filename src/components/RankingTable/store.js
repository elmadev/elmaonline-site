/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { Ranking } from 'data/api';

export default {
  rankingData: [],
  setRankingData: action((state, payload) => {
    state.rankingData = payload;
  }),
  getRankingData: thunk(async (actions, payload) => {
    const get = await Ranking(payload);
    if (get.ok) {
      actions.setRankingData(get.data);
    }
  }),
};
