/* eslint-disable no-param-reassign */
import { action, thunk, persist } from 'easy-peasy';
import { ReplaysByLevelIndex } from 'data/api';

export default {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  replays: [],
  setReplays: action((state, payload) => {
    state.replays = payload;
  }),
  getReplays: thunk(async (actions, payload) => {
    actions.setLoading(true);
    const recs = await ReplaysByLevelIndex(payload);
    if (recs.ok) {
      actions.setReplays(recs.data);
    }
    actions.setLoading(false);
  }),
  show: persist(
    {
      showTAS: false,
      showDNF: false,
      showBug: false,
      showNitro: false,
    },
    { storage: 'localStorage' },
  ),
  setShowTAS: action((state, payload) => {
    state.show.showTAS = payload;
  }),
  setShowDNF: action((state, payload) => {
    state.show.showDNF = payload;
  }),
  setShowBug: action((state, payload) => {
    state.show.showBug = payload;
  }),
  setShowNitro: action((state, payload) => {
    state.show.showNitro = payload;
  }),
};
