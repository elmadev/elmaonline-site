/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { CupReplay, CupEvent } from 'data/api';

export default {
  replay: {},
  replayLoaded: false,
  otherReplays: [],
  setReplay: action((state, payload) => {
    state.replay = payload;
    state.replayLoaded = true;
  }),
  setOtherReplays: action((state, payload) => {
    state.otherReplays = payload;
  }),
  getReplay: thunk(async (actions, payload) => {
    const rec = await CupReplay(payload);
    if (rec.ok) {
      actions.setReplay(rec.data);
    }
  }),
  getOtherReplays: thunk(async (actions, payload) => {
    const recs = await CupEvent(payload);
    if (recs.ok) {
      actions.setOtherReplays(recs.data);
    }
  }),
};
