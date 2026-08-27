import { action, thunk } from 'easy-peasy';
import { Ranking } from 'api';

export default {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  rankingData: [],
  setRankingData: action((state, payload) => {
    state.rankingData = payload;
  }),
  getRankingData: thunk(async (actions, payload) => {
    actions.setLoading(true);
    const get = await Ranking(payload);
    if (get.ok) {
      actions.setRankingData(get.data);
    }
    actions.setLoading(false);
  }),
};
