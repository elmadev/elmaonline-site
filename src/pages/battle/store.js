/* eslint-disable no-param-reassign */
import { action, persist } from 'easy-peasy';

export default {
  settings: persist(
    {
      autoPlayRecs: false,
    },
    { storage: 'localStorage' },
  ),
  toggleRecAutoplay: action(state => {
    state.settings.autoPlayRecs = !state.settings.autoPlayRecs;
  }),
};
