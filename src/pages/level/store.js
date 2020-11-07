/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { Besttime, Level, BattlesByLevel, AllFinishedLevel } from 'data/api';

export default {
  besttimes: [],
  level: {},
  battlesForLevel: [],
  loading: true,
  allfinished: [],
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
};
