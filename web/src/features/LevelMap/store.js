import { action, computed, thunk } from 'easy-peasy';
import { LevelData } from 'api';
import memoize from 'memoizee';

export default {
  levelData: {},
  setLevelData: action((state, payload) => {
    state.levelData[payload.LevelIndex] = payload;
  }),
  getLevelData: thunk(async (actions, payload) => {
    const levelData = await LevelData(payload);
    if (levelData.ok && levelData.data) {
      actions.setLevelData(levelData.data);
    }
  }),
  getByLevelIndex: computed(state => {
    return memoize(id => state.levelData[id], { max: 1000 });
  }),
};
