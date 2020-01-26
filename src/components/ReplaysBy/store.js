/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { ReplayDrivenBy, ReplayUploadedBy } from 'data/api';

export default {
  replaysDrivenBy: [],
  replaysUploadedBy: [],
  lastDrivenByKuskiId: 0,
  lastUploadedByKuskiId: 0,
  setReplaysDrivenBy: action((state, payload) => {
    state.replaysDrivenBy = payload.replays;
    state.lastDrivenByKuskiId = payload.KuskiIndex;
  }),
  setReplaysUploadedBy: action((state, payload) => {
    state.replaysUploadedBy = payload.replays;
    state.lastUploadedByKuskiId = payload.KuskiIndex;
  }),
  getDrivenBy: thunk(async (actions, payload) => {
    const replays = await ReplayDrivenBy(payload);
    if (replays.ok) {
      actions.setReplaysDrivenBy({
        replays: replays.data,
        KuskiIndex: payload,
      });
    }
  }),
  getUploadedBy: thunk(async (actions, payload) => {
    const replays = await ReplayUploadedBy(payload);
    if (replays.ok) {
      actions.setReplaysUploadedBy({
        replays: replays.data,
        KuskiIndex: payload,
      });
    }
  }),
};
