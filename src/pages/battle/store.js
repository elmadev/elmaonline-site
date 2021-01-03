/* eslint-disable no-param-reassign */
import { action, thunk, persist } from 'easy-peasy';
import {
  GetAllBattleTimes,
  // GetBattles,
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
  allBattleTimes: [],
  setAllBattleTimes: action((state, payload) => {
    state.allBattleTimes = payload;
  }),
  getAllBattleTimes2: thunk(async (actions, payload) => {
    const times = await GetAllBattleTimes('154536', payload);
    if (times.ok) {
      actions.setAllBattleTimes(times.data);
    }
  }),
  battle: [],
  setBattle: action((state, payload) => {
    state.allBattleTimes = payload;
  }),
  // getBattles: thunk(async (actions, payload) => {
  //   const times = await GetBattles(payload);
  //   if (times.ok) {
  //     actions.setBattles(times.data);
  //   }
  // }),
};
