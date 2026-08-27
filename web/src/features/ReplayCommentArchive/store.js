import { action, thunk } from 'easy-peasy';
import { AllReplayComments } from '../../api';

export default {
  // rows, count
  comments: [[], 0],
  setComments: action((state, payload) => {
    const [rows, count] = payload;
    state.comments[0] = Array.isArray(rows) ? rows : [];
    state.comments[1] = +(count || 0) || 0;
  }),
  fetchComments: thunk(async (actions, payload) => {
    // passing limit, offset
    const response = await AllReplayComments(payload[0], payload[1]);

    if (response.ok) {
      actions.setComments([response.data.rows, response.data.count]);
    }
  }),
};
