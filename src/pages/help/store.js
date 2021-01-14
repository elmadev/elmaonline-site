/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { GetCrew } from 'data/api';

export default {
  crew: null,
  setCrew: action((state, payload) => {
    state.crew = payload;
  }),
  getCrew: thunk(async (actions, payload) => {
    actions.setCrew(null);
    const crew = await GetCrew(payload);
    if (crew.ok) {
      actions.setCrew(crew.data);
    }
  }),
};
