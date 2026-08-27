import { action, thunk } from 'easy-peasy';
import { ReplayByUUID, EditReplay, CupEventByTimeIndex } from 'api';

export default {
  replay: null,
  setReplayByUUID: action((state, payload) => {
    if (!payload) {
      state.replay = null;
      return;
    }
    state.replay = payload;
  }),
  submitEdit: thunk(async (actions, payload) => {
    const post = await EditReplay(payload);
    if (post.ok) {
      actions.getReplayByUUID(payload);
    }
  }),
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  replays: [],
  setReplays: action((state, payload) => {
    state.replays = payload;
  }),
  getReplayByUUID: thunk(async (actions, payload) => {
    actions.setReplays([]);
    actions.setLoading(true);
    let uuids = payload.ReplayUuid;
    if (uuids.substring(0, 2) === 'c-') {
      uuids = `${uuids}-${payload.RecFileName}`;
    }
    if (payload.merge) {
      uuids = `${uuids};${payload.merge}`;
    }
    const replays = await ReplayByUUID(uuids, payload.Fingerprint);
    if (replays.ok) {
      if (Array.isArray(replays.data)) {
        actions.setReplays(replays.data);
        actions.setReplayByUUID(
          replays.data.filter(
            d => d.RecFileName.replace('.rec', '') === payload.RecFileName,
          )[0],
        );
      } else {
        actions.setReplayByUUID(replays.data);
      }
    }
    actions.setLoading(false);
  }),
  cupEvent: null,
  setCupEvent: action((state, payload) => {
    state.cupEvent = payload;
  }),
  getCupEvent: thunk(async (actions, payload) => {
    const recs = await CupEventByTimeIndex(payload);
    if (recs.ok) {
      actions.setCupEvent(recs.data);
    }
  }),
};
