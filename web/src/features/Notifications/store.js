import { action, thunk } from 'easy-peasy';
import { GetNotifications, MarkNotificationsSeen } from 'api';

export default {
  notifications: [],
  setNotifications: action((state, payload) => {
    state.notifications = payload;
  }),
  getNotifications: thunk(async actions => {
    const get = await GetNotifications();
    if (get.ok) {
      actions.setNotifications(get.data);
    }
  }),

  seenAt: null,
  setMarkSeen: action((state, payload) => {
    state.seenAt = payload;
  }),
  markSeen: thunk(async actions => {
    const post = await MarkNotificationsSeen();
    if (post.ok) {
      actions.setMarkSeen(new Date());
    }
  }),
};
