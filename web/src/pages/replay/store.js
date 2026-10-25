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
  getReplayByUUID: thunk(async (actions, payload) => {
    actions.setLoading(true);
    let uuid = payload.ReplayUuid;
    if (uuid.substring(0, 2) === 'c-') {
      uuid = `${uuid}-${payload.RecFileName}`;
    }
    const replay = await ReplayByUUID(uuid, payload.Fingerprint);
    if (replay.ok) {
      actions.setReplayByUUID(replay.data);
    }
    actions.setLoading(false);
  }),
  merged: {},
  addMerged: action((state, payload) => {
    state.merged = { ...state.merged, ...payload };
  }),
  getMerged: thunk(async (actions, payload) => {
    const replays = await ReplayByUUID(payload.join(';'));
    if (replays.ok) {
      const found = [replays.data].flat();
      actions.addMerged(
        Object.fromEntries(
          payload.map((uuid, i) => [uuid, found[i]]).filter(([, r]) => r),
        ),
      );
    }
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
