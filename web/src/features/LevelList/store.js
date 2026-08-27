import { action, thunk, persist } from 'easy-peasy';
import { Levels, GetLevelTags, GetLevelKuskis } from 'api';

export default {
  levels: null,
  loadingLevels: false,
  setLoadingLevels: action((state, payload) => {
    state.loadingLevels = payload;
  }),
  setLevels: action((state, payload) => {
    state.levels = payload;
  }),
  getLevels: thunk(async (actions, payload) => {
    actions.setLoadingLevels(true);
    const get = await Levels(payload);
    if (get.ok) {
      actions.setLevels(get.data);
    }
    actions.setLoadingLevels(false);
  }),

  tagOptions: [],
  setTagOptions: action((state, payload) => {
    state.tagOptions = payload;
  }),
  getTagOptions: thunk(async actions => {
    const get = await GetLevelTags();
    if (get.ok) {
      actions.setTagOptions(get.data);
    }
  }),

  kuskiOptions: [],
  setKuskiOptions: action((state, payload) => {
    state.kuskiOptions = payload.sort((a, b) =>
      a.Kuski.toLowerCase().localeCompare(b.Kuski.toLowerCase()),
    );
  }),
  getKuskiOptions: thunk(async actions => {
    const get = await GetLevelKuskis();
    if (get.ok) {
      actions.setKuskiOptions(get.data);
    }
  }),
  settings: persist(
    {
      grid: true,
    },
    { storage: 'localStorage' },
  ),
  setSettings: action((state, payload) => {
    state.settings = { ...state.settings, ...payload };
  }),
};
