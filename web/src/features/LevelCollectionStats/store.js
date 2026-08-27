import { action, thunk } from 'easy-peasy';
import { LevelCollectionStats } from '../../api';

export default {
  // rows, count
  stats: [],
  setStats: action((state, payload) => {
    state.stats = payload;
  }),
  fetchStats: thunk(async (actions, payload) => {
    actions.setStats([]);
    const response = await LevelCollectionStats(payload[0], payload[1]);

    if (response.ok) {
      const stats = response?.data?.stats;
      if (!stats) {
        actions.setStats([]);
      } else {
        actions.setStats(stats);
      }
    }
  }),
};
