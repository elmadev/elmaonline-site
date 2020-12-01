/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { NickRequests } from 'data/api';

export default {
  nickChanges: '',
  setNickChanges: action((state, payload) => {
    state.nickChanges = payload;
  }),
  getNickChanges: thunk(async actions => {
    const get = await NickRequests();
    if (get.ok) {
      actions.setNickChanges(get.data);
    }
  }),
};
