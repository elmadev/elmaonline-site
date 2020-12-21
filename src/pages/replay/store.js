/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { ReplayByUUID } from 'data/api';

export default {
  replay: null,
  setReplayByUUID: action((state, payload) => {
    state.replay = payload;
  }),

  getReplayByUUID: thunk(async (actions, payload) => {
    const replays = await ReplayByUUID(payload);
    if (replays.ok) {
      actions.setReplayByUUID(replays.data);
    }
  }),
};
