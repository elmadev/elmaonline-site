/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { UserInfo, UpdateUserInfo, Ignored, Ignore, Unignore } from 'data/api';

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
  ignored: [],
  setIgnored: action((state, payload) => {
    state.ignored = payload;
  }),
  getIgnored: thunk(async actions => {
    const get = await Ignored();
    if (get.ok) {
      actions.setIgnored(get.data);
    }
  }),
  ignore: thunk(async (actions, payload) => {
    const addIgnore = await Ignore(payload);
    if (addIgnore.ok) {
      actions.getIgnored();
    }
  }),
  unignore: thunk(async (actions, payload) => {
    const removeIgonre = await Unignore(payload);
    if (removeIgonre.ok) {
      actions.getIgnored();
    }
  }),
};
