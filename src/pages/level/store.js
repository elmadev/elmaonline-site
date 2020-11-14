/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import {
  Besttime,
  Level,
  BattlesByLevel,
  AllFinishedLevel,
  LevelTimeStats,
} from 'data/api';

export default {
  besttimes: [],
  besttimesLoading: false,
  level: {},
  battlesForLevel: [],
  loading: true,
  allfinished: [],
  allLoading: 0,
  eoltimes: [],
  eolLoading: 0,
  timeStats: [],
  statsLoading: 0,
  setBestLoading: action((state, payload) => {
    state.besttimesLoading = payload;
  }),
  setBesttimes: action((state, payload) => {
    state.besttimes = payload;
    state.besttimesLoading = false;
  }),
  getBesttimes: thunk(async (actions, payload) => {
    actions.setBestLoading(true);
    const times = await Besttime(payload);
    if (times.ok) {
      actions.setBesttimes(times.data);
    }
  }),
  setLevel: action((state, payload) => {
    state.level = payload;
    state.loading = false;
  }),
  setBattlesForLevel: action((state, payload) => {
    state.battlesForLevel = payload;
  }),
  getLevel: thunk(async (actions, payload) => {
    const lev = await Level(payload);
    if (lev.ok) {
      actions.setLevel(lev.data);
    }
    const battles = await BattlesByLevel(payload);
    if (battles.ok) {
      actions.setBattlesForLevel(battles.data);
    }
  }),
  setAllfinished: action((state, payload) => {
    state.allfinished = payload.times;
    state.allLoading = payload.id;
  }),
  getAllfinished: thunk(async (actions, payload) => {
    const times = await AllFinishedLevel(payload);
    if (times.ok) {
      actions.setAllfinished({ times: times.data, id: payload });
    }
  }),
  setEoltimes: action((state, payload) => {
    state.eoltimes = payload.times;
    state.eolLoading = payload.id;
  }),
  getEoltimes: thunk(async (actions, payload) => {
    const times = await Besttime(payload);
    if (times.ok) {
      actions.setEoltimes({ times: times.data, id: payload.levelId });
    }
  }),
  setTimeStats: action((state, payload) => {
    state.timeStats = payload.data;
    state.statsLoading = payload.id;
  }),
  getTimeStats: thunk(async (actions, payload) => {
    const stats = await LevelTimeStats(payload);
    if (stats.ok) {
      actions.setTimeStats({ data: stats.data, id: payload });
    }
  }),
};
