/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { LevelData } from 'data/api';

export default {
  levelData: null,
  setLevelData: action((state, payload) => {
    state.levelData = payload;
  }),
  getLevelData: thunk(async (actions, payload) => {
    const levelData = await LevelData(payload);
    if (levelData.ok) {
      actions.setLevelData(levelData.data);
    }
  }),
};
