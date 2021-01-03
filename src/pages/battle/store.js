/* eslint-disable no-param-reassign */
import { action, thunk, persist } from 'easy-peasy';
import {
  GetAllBattleTimes,
  BattleResults,
  RankingHistoryByBattle,
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
  rankingHistory: null,
  setRankingHistory: thunk(async (state, payload) => {
    state.rankingHistory = payload;
  }),
  getRankingHistoryByBattle: thunk(async (actions, payload) => {
    const history = await RankingHistoryByBattle(payload);
    if (history.ok) {
      actions.setRankingHistory(history.data);
    }
  }),
};
