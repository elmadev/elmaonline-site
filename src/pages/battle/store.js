/* eslint-disable no-param-reassign */
import { action, thunk, persist } from 'easy-peasy';
import {
  GetAllBattleTimes,
  BattleResults,
  RankingHistoryByBattle,
  AllBattleRuns,
} from 'data/api';

export default {
  settings: persist(
    {
      autoPlayRecs: false,
    },
    { storage: 'localStorage' },
  ),
  toggleRecAutoplay: action(state => {
    state.settings.autoPlayRecs = !state.settings.autoPlayRecs;
  }),
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
};
