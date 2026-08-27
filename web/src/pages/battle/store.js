import { action, thunk } from 'easy-peasy';
import {
  GetAllBattleTimes,
  BattleResults,
  RankingHistoryByBattle,
  AllBattleRuns,
  BattleReplays,
} from 'api';

export default {
  allBattleTimes: null,
  setAllBattleTimes: action((state, payload) => {
    state.allBattleTimes = payload;
  }),
  getAllBattleTimes: thunk(async (actions, payload) => {
    const allTimes = await GetAllBattleTimes(payload);
    if (allTimes.ok) {
      actions.setAllBattleTimes(allTimes.data);
    }
  }),
  allBattleRuns: null,
  setAllBattleRuns: action((state, payload) => {
    state.allBattleRuns = payload;
  }),
  getAllBattleRuns: thunk(async (actions, payload) => {
    const runs = await AllBattleRuns(payload);
    if (runs.ok) {
      actions.setAllBattleRuns(runs.data);
    }
  }),
  battle: null,
  setBattle: action((state, payload) => {
    state.battle = payload;
  }),
  getBattle: thunk(async (actions, payload) => {
    const times = await BattleResults(payload);
    if (times.ok) {
      actions.setBattle(times.data);
    }
  }),
  nextBattleFound: false,
  setNextBattleFound: action((state, payload) => {
    state.nextBattleFound = payload;
  }),
  getNextBattleFound: thunk(async (actions, payload) => {
    const battle = await BattleResults(payload);
    if (battle.ok) {
      if (battle.data === null) {
        actions.setNextBattleFound(false);
      } else {
        actions.setNextBattleFound(true);
      }
    }
  }),
  rankingHistory: {},
  setRankingHistory: action((state, payload) => {
    state.rankingHistory = payload;
  }),
  getRankingHistoryByBattle: thunk(async (actions, payload) => {
    const history = await RankingHistoryByBattle(payload);
    if (history.ok) {
      actions.setRankingHistory(history.data);
    }
  }),
  replays: [],
  setReplays: action((state, payload) => {
    state.replays = payload;
  }),
  getReplays: thunk(async (actions, payload) => {
    const get = await BattleReplays(payload);
    if (get.ok) {
      actions.setReplays(get.data);
    }
  }),
};
