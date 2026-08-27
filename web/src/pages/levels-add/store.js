import { action, thunk } from 'easy-peasy';
import { AddLevelPack } from 'api';

export default {
  addSuccess: '',
  setAddSuccess: action((state, payload) => {
    state.addSuccess = payload;
  }),
  error: '',
  setError: action((state, payload) => {
    state.error = payload;
  }),
  addLevelPack: thunk(async (actions, payload) => {
    const add = await AddLevelPack(payload);
    if (add.data.error) {
      actions.setError(add.data.error);
      return;
    }
    if (add.ok) {
      actions.setAddSuccess(payload.LevelPackName);
    }
  }),
};
