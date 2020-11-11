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
  level: {},
  battlesForLevel: [],
  loading: true,
  allfinished: [],
  eoltimes: [],
  timeStats: [],
  setBesttimes: action((state, payload) => {
    state.besttimes = payload;
  }),
  getBesttimes: thunk(async (actions, payload) => {
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
    state.allfinished = payload;
  }),
  getAllfinished: thunk(async (actions, payload) => {
    const times = await AllFinishedLevel(payload);
    if (times.ok) {
      actions.setAllfinished(times.data);
    }
  }),
  setEoltimes: action((state, payload) => {
    state.eoltimes = payload;
  }),
  getEoltimes: thunk(async (actions, payload) => {
    const times = await Besttime(payload);
    if (times.ok) {
      actions.setEoltimes(times.data);
    }
  }),
  setTimeStats: action((state, payload) => {
    state.timeStats = payload;
  }),
  getTimeStats: thunk(async (actions, payload) => {
    const stats = await LevelTimeStats(payload);
    if (stats.ok) {
      actions.setTimeStats(stats.data);
    }
  }),
};
