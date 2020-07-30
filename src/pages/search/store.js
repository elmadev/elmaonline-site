/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { LevelPackSearch } from 'data/api';

export default {
  levelPacks: [],
  setLevelPacks: action((state, payload) => {
    state.levelPacks = payload;
  }),
  getLevelPacks: thunk(async (actions, payload) => {
    const packs = await LevelPackSearch(payload);
    if (packs.ok) {
      actions.setLevelPacks(packs.data);
    }
  }),
};
