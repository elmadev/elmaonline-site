import { action, thunk } from 'easy-peasy';
import { LGRComments, NewLGRComment } from 'api';

export default {
  page: 'LGRComments',

  lgrIndex: null,
  comments: [],
  setComments: action((state, payload) => {
    state.lgrIndex = payload[0];
    state.comments = payload[1];
  }),
  getComments: thunk(async (actions, LGRIndex) => {
    const lgrComments = await LGRComments(LGRIndex);
    if (lgrComments.ok) {
      actions.setComments([LGRIndex, lgrComments.data]);
    }
  }),
  addComment: thunk(async (actions, payload) => {
    const add = await NewLGRComment(payload);
    if (add.ok) {
      actions.getComments(payload.LGRIndex);
    }
  }),
};
