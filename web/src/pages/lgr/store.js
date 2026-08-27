import { action, thunk } from 'easy-peasy';
import { LGR } from 'api';

export default {
  page: 'LGR',

  lgr: null,
  setLGR: action((state, payload) => {
    state.lgr = payload;
  }),
  getLGR: thunk(async (actions, payload) => {
    actions.setLGR(null);
    const get = await LGR(payload);
    if (get.ok) {
      actions.setLGR(get.data);
    }
  }),
};
