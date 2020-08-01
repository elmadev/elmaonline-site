/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import {
  LevelPackSearch,
  BattlesSearchByFilename,
  BattlesSearchByDesigner,
} from 'data/api';

export default {
  levelPacks: [],
  setLevelPacks: action((state, payload) => {
    state.levelPacks = payload;
  }),
  getLevelPacks: thunk(async (actions, payload) => {
    const packs = await LevelPackSearch(payload);
    if (packs.ok) {
      actions.setLevelPacks(packs.data);
    }
  }),
  battlesByFilename: [],
  battlesByDesigner: [],
  moreBattleFile: true,
  moreBattleDesigner: true,
  setBattlesByFilename: action((state, payload) => {
    state.battlesByFilename = [...state.battlesByFilename, ...payload];
    if (payload.length < 25) {
      state.moreBattleFile = false;
    } else {
      state.moreBattleFile = true;
    }
  }),
  setBattlesByDesigner: action((state, payload) => {
    state.battlesByDesigner = [...state.battlesByDesigner, ...payload];
    if (payload.length < 25) {
      state.moreBattleDesigner = false;
    } else {
      state.moreBattleDesigner = true;
    }
  }),
  resetBattles: action(state => {
    state.battlesByFilename = [];
    state.battlesByDesigner = [];
  }),
  getBattles: thunk(async (actions, payload) => {
    actions.resetBattles();
    const battles = await BattlesSearchByFilename(payload);
    if (battles.ok) {
      actions.setBattlesByFilename(battles.data);
    }
    const battlesDesigner = await BattlesSearchByDesigner(payload);
    if (battlesDesigner.ok) {
      actions.setBattlesByDesigner(battlesDesigner.data);
    }
  }),
  fetchMoreBattlesFile: thunk(async (actions, payload) => {
    const battles = await BattlesSearchByFilename(payload);
    if (battles.ok) {
      actions.setBattlesByFilename(battles.data);
    }
  }),
  fetchMoreBattlesDesigner: thunk(async (actions, payload) => {
    const battles = await BattlesSearchByDesigner(payload);
    if (battles.ok) {
      actions.setBattlesByDesigner(battles.data);
    }
  }),
};
