/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import {
  LevelPackSearch,
  BattlesSearchByFilename,
  BattlesSearchByDesigner,
  PlayersSearch,
  TeamsSearch,
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
  players: [],
  morePlayers: true,
  setPlayers: action((state, payload) => {
    state.players = [...state.players, ...payload];
    if (payload.length < 25) {
      state.morePlayers = false;
    } else {
      state.morePlayers = true;
    }
  }),
  resetPlayers: action(state => {
    state.players = [];
  }),
  getPlayers: thunk(async (actions, payload) => {
    actions.resetPlayers();
    const players = await PlayersSearch(payload);
    if (players.ok) {
      actions.setPlayers(players.data);
    }
  }),
  fetchMorePlayers: thunk(async (actions, payload) => {
    const players = await PlayersSearch(payload);
    if (players.ok) {
      actions.setPlayers(players.data);
    }
  }),
  teams: [],
  moreTeams: true,
  setTeams: action((state, payload) => {
    state.teams = [...state.teams, ...payload];
    if (payload.length < 25) {
      state.moreTeams = false;
    } else {
      state.moreTeams = true;
    }
  }),
  resetTeams: action(state => {
    state.teams = [];
  }),
  getTeams: thunk(async (actions, payload) => {
    actions.resetTeams();
    const teams = await TeamsSearch(payload);
    if (teams.ok) {
      actions.setTeams(teams.data);
    }
  }),
  fetchMoreTeams: thunk(async (actions, payload) => {
    const teams = await TeamsSearch(payload);
    if (teams.ok) {
      actions.setTeams(teams.data);
    }
  }),
};
