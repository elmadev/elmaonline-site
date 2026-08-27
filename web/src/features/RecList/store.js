import { action, thunk, persist } from 'easy-peasy';
import { ReplaysByLevelIndex, GetReplayTags } from 'api';

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
  tagOptions: [],
  setTagOptions: action((state, payload) => {
    state.tagOptions = payload;
  }),
  getTagOptions: thunk(async actions => {
    const get = await GetReplayTags();
    if (get.ok) {
      actions.setTagOptions(get.data);
    }
  }),
  tags: persist(
    {
      includedTags: [],
      setIncludedTags: action((state, payload) => {
        state.includedTags = payload;
      }),
      excludedTags: [],
      setExcludedTags: action((state, payload) => {
        state.excludedTags = payload;
      }),
    },
    { storage: 'localStorage' },
  ),
};
