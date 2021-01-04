/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { Replays } from 'data/api';

export default {
  replays: null,
  setReplays: action((state, payload) => {
    state.replays = payload;
  }),
  getReplays: thunk(async (actions, payload) => {
    const get = await Replays(payload);
    if (get.ok) {
      actions.setReplays(get.data);
    }
  }),
};
