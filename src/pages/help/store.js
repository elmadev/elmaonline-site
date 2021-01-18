/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { GetCrew, GetDonations } from 'data/api';

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
  donations: null,
  setDonations: action((state, payload) => {
    state.donations = payload;
  }),
  getDonations: thunk(async (actions, payload) => {
    actions.setDonations(null);
    const donations = await GetDonations(payload);
    if (donations.ok) {
      actions.setDonations(donations.data);
    }
  }),
};
