import { action, thunk, persist } from 'easy-peasy';
import {
  Replays,
  LatestBattleReplays,
  GetReplayTags,
  ReplayDrivenBy,
  ReplayUploadedBy,
} from 'api';

export default {
  replays: null,
  setReplays: action((state, payload) => {
    state.replays = payload;
  }),
  getReplays: thunk(async (actions, payload) => {
    let get = null;
    if (payload.drivenBy) {
      get = await ReplayDrivenBy(payload.drivenBy, {
        page: payload.page,
        pageSize: payload.pageSize,
        tags: payload.tags,
        excludedTags: payload.excludedTags,
        sortBy: payload.sortBy,
        order: payload.order,
      });
    } else if (payload.uploadedBy) {
      get = await ReplayUploadedBy(payload.uploadedBy, {
        page: payload.page,
        pageSize: payload.pageSize,
        tags: payload.tags,
        excludedTags: payload.excludedTags,
        sortBy: payload.sortBy,
        order: payload.order,
      });
    } else {
      get = await Replays(payload);
    }
    if (get.ok) {
      actions.setReplays(get.data);
    }
  }),
  battles: null,
  setBattles: action((state, payload) => {
    state.battles = payload;
  }),
  getBattles: thunk(async (actions, payload) => {
    const get = await LatestBattleReplays(payload);
    if (get.ok) {
      actions.setBattles(get.data);
    }
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
  settings: persist(
    {
      grid: true,
      sortBy: 'uploaded',
    },
    { storage: 'localStorage' },
  ),
  setSettings: action((state, payload) => {
    state.settings = { ...state.settings, ...payload };
  }),
  persistPage: {},
  setPersistPage: action((state, payload) => {
    state.persistPage[payload.key] = payload.pageNo;
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
