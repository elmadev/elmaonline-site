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
  kinglist: [],
  lastPack: 0,
  totaltimesLoading: false,
  setTotalTimes: action((state, payload) => {
    state.totaltimes = payload;
  }),
  setKinglist: action((state, payload) => {
    state.kinglist = payload;
  }),
  setTotaltimesLoading: action((state, payload) => {
    state.totaltimesLoading = payload;
  }),
  setLastPack: action((state, payload) => {
    state.lastPack = payload;
  }),
  getTotalTimes: thunk(async (actions, payload) => {
    actions.setTotaltimesLoading(true);
    const tts = await TotalTimes(payload);
    if (tts.ok) {
      actions.setTotalTimes(tts.data.tts);
      actions.setKinglist(tts.data.points);
      actions.setLastPack(payload);
    }
    actions.setTotaltimesLoading(false);
  }),
  timesError: '',
  setError: action((state, payload) => {
    state.timesError = payload;
  }),
  personalTimes: [],
  personalTimesLoading: false,
  setPersonalTimes: action((state, payload) => {
    state.personalTimes = payload;
  }),
  setPersonalTimesLoading: action((state, paylaod) => {
    state.personalTimesLoading = paylaod;
  }),
  getPersonalTimes: thunk(async (actions, payload) => {
    actions.setPersonalTimesLoading(true);
    const times = await PersonalTimes(payload);
    if (times.ok) {
      if (times.data.error) {
        actions.setError(times.data.error);
      } else {
        actions.setPersonalTimes(times.data);
      }
    }
    actions.setPersonalTimesLoading(false);
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
  recordsLoading: false,
  setRecords: action((state, payload) => {
    state.records = payload;
  }),
  setRecordsLoading: action((state, payload) => {
    state.recordsLoading = payload;
  }),
  getRecords: thunk(async (actions, payload) => {
    actions.setRecordsLoading(true);
    const times = await Records(payload);
    if (times.ok) {
      actions.setRecords(times.data);
    }
    actions.setRecordsLoading(false);
  }),
};
