/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import {
  Highlight,
  TotalTimes,
  PersonalTimes,
  PersonalAllFinished,
  Besttime,
  Records,
} from 'data/api';

export default {
  highlight: [9999999999, 9999999999, 9999999999, 9999999999, 9999999999],
  setHighlight: action((state, payload) => {
    state.highlight = payload;
  }),
  getHighlight: thunk(async actions => {
    const highlights = await Highlight();
    if (highlights.ok) {
      actions.setHighlight(highlights.data);
    }
  }),
  totaltimes: [],
  setTotalTimes: action((state, payload) => {
    state.totaltimes = payload;
  }),
  getTotalTimes: thunk(async (actions, payload) => {
    const tts = await TotalTimes(payload);
    if (tts.ok) {
      actions.setTotalTimes(tts.data);
    }
  }),
  timesError: '',
  setError: action((state, payload) => {
    state.timesError = payload;
  }),
  personalTimes: [],
  setPersonalTimes: action((state, payload) => {
    state.personalTimes = payload;
  }),
  getPersonalTimes: thunk(async (actions, payload) => {
    const times = await PersonalTimes(payload);
    if (times.ok) {
      if (times.data.error) {
        actions.setError(times.data.error);
      } else {
        actions.setPersonalTimes(times.data);
      }
    }
  }),
  personalAllFinished: [],
  setPeronalAllFinished: action((state, payload) => {
    state.personalAllFinished = payload;
  }),
  getPersonalAllFinished: thunk(async (actions, payload) => {
    const times = await PersonalAllFinished(payload);
    if (times.ok) {
      actions.setPeronalAllFinished(times.data);
    }
  }),
  levelBesttimes: [],
  setLevelBesttimes: action((state, payload) => {
    state.levelBesttimes = payload;
  }),
  getLevelBesttimes: thunk(async (actions, payload) => {
    const times = await Besttime(payload);
    if (times.ok) {
      actions.setLevelBesttimes(times.data);
    }
  }),
  records: [],
  setRecords: action((state, payload) => {
    state.records = payload;
  }),
  getRecords: thunk(async (actions, payload) => {
    const times = await Records(payload);
    if (times.ok) {
      actions.setRecords(times.data);
    }
  }),
};
