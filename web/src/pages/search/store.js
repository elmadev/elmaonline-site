import { action, thunk } from 'easy-peasy';
import {
  LevelPackSearch,
  BattlesSearchByFilename,
  BattlesSearchByDesigner,
  PlayersSearch,
  TeamsSearch,
  ReplaysSearchByDriven,
  ReplaysSearchByLevel,
  ReplaysSearchByFilename,
  LevelsSearch,
  UpdateLevel,
} from 'api';

export default {
  levelPacks: [],
  levels: [],
  moreLevels: true,
  showLocked: false,
  setLevelPacks: action((state, payload) => {
    state.levelPacks = payload;
  }),
  setLevels: action((state, payload) => {
    state.levels = [...state.levels, ...payload];
    if (payload.length === 25) {
      state.moreLevels = true;
    } else {
      state.moreLevels = false;
    }
  }),
  setShowLocked: action((state, payload) => {
    state.showLocked = payload;
  }),
  resetLevels: action(state => {
    state.levels = [];
    state.levelPacks = [];
  }),
  getLevels: thunk(async (actions, payload) => {
    actions.resetLevels();
    const packs = await LevelPackSearch(payload.q);
    if (packs.ok) {
      actions.setLevelPacks(packs.data);
    }
    const levs = await LevelsSearch(payload);
    if (levs.ok) {
      actions.setLevels(levs.data.levels);
      actions.setShowLocked(levs.data.showLocked);
    }
  }),
  fetchMoreLevels: thunk(async (actions, payload) => {
    const levs = await LevelsSearch(payload);
    if (levs.ok) {
      actions.setLevels(levs.data.levels);
      actions.setShowLocked(levs.data.showLocked);
    }
  }),
  battlesByFilename: [],
  battlesByDesigner: [],
  moreBattleFile: true,
  moreBattleDesigner: true,
  setBattlesByFilename: action((state, payload) => {
    state.battlesByFilename = [...state.battlesByFilename, ...payload];
    if (payload.length === 25) {
      state.moreBattleFile = true;
    } else {
      state.moreBattleFile = false;
    }
  }),
  setBattlesByDesigner: action((state, payload) => {
    state.battlesByDesigner = [...state.battlesByDesigner, ...payload];
    if (payload.length === 25) {
      state.moreBattleDesigner = true;
    } else {
      state.moreBattleDesigner = false;
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
    if (payload.length === 25) {
      state.morePlayers = true;
    } else {
      state.morePlayers = false;
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
    if (payload.length === 25) {
      state.moreTeams = true;
    } else {
      state.moreTeams = false;
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
  replaysByDriven: [],
  replaysByLevel: [],
  replaysByFilename: [],
  moreReplaysDriven: true,
  moreReplaysLevel: true,
  moreReplaysFile: true,
  setReplaysByDriven: action((state, payload) => {
    state.replaysByDriven = [...state.replaysByDriven, ...payload];
    if (payload.length === 25) {
      state.moreReplaysDriven = true;
    } else {
      state.moreReplaysDriven = false;
    }
  }),
  setReplaysByLevel: action((state, payload) => {
    state.replaysByLevel = [...state.replaysByLevel, ...payload];
    if (payload.length === 25) {
      state.moreReplaysLevel = true;
    } else {
      state.moreReplaysLevel = false;
    }
  }),
  setReplaysByFilename: action((state, payload) => {
    state.replaysByFilename = [...state.replaysByFilename, ...payload];
    if (payload.length === 25) {
      state.moreReplaysFile = true;
    } else {
      state.moreReplaysFile = false;
    }
  }),
  resetReplays: action(state => {
    state.replaysByDriven = [];
    state.replaysByLevel = [];
    state.replaysByFilename = [];
  }),
  getReplays: thunk(async (actions, payload) => {
    actions.resetReplays();
    const replays = await ReplaysSearchByDriven(payload);
    if (replays.ok) {
      actions.setReplaysByDriven(replays.data);
    }
    const replaysLevel = await ReplaysSearchByLevel(payload);
    if (replaysLevel.ok) {
      actions.setReplaysByLevel(replaysLevel.data);
    }
    const replaysFile = await ReplaysSearchByFilename(payload);
    if (replaysFile.ok) {
      actions.setReplaysByFilename(replaysFile.data);
    }
  }),
  fetchMoreReplaysDriven: thunk(async (actions, payload) => {
    const replays = await ReplaysSearchByDriven(payload);
    if (replays.ok) {
      actions.setReplaysByDriven(replays.data);
    }
  }),
  fetchMoreReplaysLevel: thunk(async (actions, payload) => {
    const replaysLevel = await ReplaysSearchByLevel(payload);
    if (replaysLevel.ok) {
      actions.setReplaysByLevel(replaysLevel.data);
    }
  }),
  fetchmoreReplaysFile: thunk(async (actions, payload) => {
    const replaysFile = await ReplaysSearchByFilename(payload);
    if (replaysFile.ok) {
      actions.setReplaysByFilename(replaysFile.data);
    }
  }),
  changeLevel: thunk(async (actions, payload) => {
    await UpdateLevel(payload);
  }),
};
