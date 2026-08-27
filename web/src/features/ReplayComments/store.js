import { action, thunk } from 'easy-peasy';
import { ReplayComment, AddReplayComment } from 'api';

export default {
  commentlist: [],
  lastReplayIndex: 0,
  setComments: action((state, payload) => {
    state.commentlist = payload.commentlist;
    state.lastReplayIndex = payload.lastReplayIndex;
  }),
  getComments: thunk(async (actions, payload) => {
    const replayComments = await ReplayComment(payload);
    if (replayComments.ok) {
      actions.setComments({
        commentlist: replayComments.data,
        lastReplayIndex: payload,
      });
    }
  }),
  addComment: thunk(async (actions, payload) => {
    const add = await AddReplayComment(payload);
    if (add.ok) {
      actions.getComments(payload.ReplayIndex);
    }
  }),
};
