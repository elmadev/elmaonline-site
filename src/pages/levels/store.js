/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { LevelPacks } from 'data/api';

export default {
  levelpacks: '',
  setLevelpacks: action((state, payload) => {
    state.levelpacks = payload;
  }),
  getLevelpacks: thunk(async actions => {
    const get = await LevelPacks();
    if (get.ok) {
      actions.setLevelpacks(get.data);
    }
  }),
};
