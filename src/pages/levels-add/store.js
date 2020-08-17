/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { AddLevelPack } from 'data/api';

export default {
  addSuccess: '',
  setAddSuccess: action((state, payload) => {
    state.addSuccess = payload;
  }),
  addLevelPack: thunk(async (actions, payload) => {
    const add = await AddLevelPack(payload);
    if (add.ok) {
      actions.setAddSuccess(payload.LevelPackName);
    }
  }),
};
