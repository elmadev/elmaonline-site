import { action, thunk, persist } from 'easy-peasy';
import { GetCrew, GetDonations } from 'api';
import { format } from 'date-fns';

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
  donate: persist(
    {
      donations: null,
      donationsCacheDate: '',
      setDonations: action((state, payload) => {
        state.donations = payload;
        state.donationsCacheDate = format(new Date(), 'yyyy-DDD');
      }),
      getDonations: thunk(async (actions, payload, helpers) => {
        if (payload.cached) {
          if (
            helpers.getState().donations &&
            helpers.getState().donationsCacheDate ===
              format(new Date(), 'yyyy-DDD')
          ) {
            return;
          }
        }
        actions.setDonations(null);
        const donations = await GetDonations(payload);
        if (donations.ok) {
          actions.setDonations(donations.data);
        }
      }),
    },
    { storage: 'localStorage' },
  ),
};
