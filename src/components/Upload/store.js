/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { InsertReplay, UpdateReplay, UserInfoByIdentifier } from 'data/api';

export default {
  inserted: {},
  updated: {},
  error: '',
  kuskiInfo: {},
  setInserted: action((state, payload) => {
    state.inserted = payload;
  }),
  setUpdated: action((state, payload) => {
    state.updated = payload;
  }),
  setError: action((state, payload) => {
    state.error = payload;
  }),
  setKuskiInfo: action((state, payload) => {
    state.kuskiInfo = payload;
  }),
  insertReplay: thunk(async (actions, payload) => {
    const insert = await InsertReplay(payload);
    if (insert.ok) {
      actions.setInserted(insert.data);
    }
  }),
  updateReplay: thunk(async (actions, payload) => {
    const update = await UpdateReplay({ ReplayIndex: payload });
    if (update.ok) {
      actions.setUpdated(update.data);
    }
  }),
  getKuskiByName: thunk(async (actions, payload) => {
    const get = await UserInfoByIdentifier({
      IdentifierType: 'Kuski',
      KuskiIdentifier: payload.Kuski,
    });
    if (get.ok) {
      actions.setKuskiInfo({ ...get.data, RecFileName: payload.RecFileName });
    }
  }),
};
