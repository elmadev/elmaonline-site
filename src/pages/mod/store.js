/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { NickRequests, NickAccept, NickDecline } from 'data/api';

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
  acceptNick: thunk(async (actions, payload) => {
    const post = await NickAccept(payload);
    if (post.ok) {
      actions.getNickChanges();
    }
  }),
  declineNick: thunk(async (actions, payload) => {
    const post = await NickDecline(payload);
    if (post.ok) {
      actions.getNickChanges();
    }
  }),
};
