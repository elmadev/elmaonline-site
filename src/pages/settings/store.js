/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { UserInfo } from 'data/api';

export default {
  userInfo: '',
  setUserInfo: action((state, payload) => {
    state.userInfo = payload;
  }),
  getUserInfo: thunk(async (actions, payload) => {
    const get = await UserInfo(payload);
    if (get.ok) {
      actions.setUserInfo(get.data);
    }
  }),
};
