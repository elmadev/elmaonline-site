/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { UserInfo, UpdateUserInfo } from 'data/api';

export default {
  userInfo: '',
  error: '',
  message: '',
  setUserInfo: action((state, payload) => {
    state.userInfo = payload;
  }),
  setError: action((state, payload) => {
    state.error = payload;
  }),
  setMessage: action((state, payload) => {
    state.message = payload;
  }),
  getUserInfo: thunk(async (actions, payload) => {
    const get = await UserInfo(payload);
    if (get.ok) {
      actions.setUserInfo(get.data);
    }
  }),
  updateUserInfo: thunk(async (actions, payload) => {
    const update = await UpdateUserInfo(payload);
    if (update.ok) {
      if (update.data.success) {
        actions.setUserInfo(update.data.info);
        actions.setMessage(update.data.message);
      } else {
        actions.setError(update.data.message);
      }
    }
  }),
};
