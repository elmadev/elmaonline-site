import { action, thunk } from 'easy-peasy';
import { ReplayRating, AddReplayRating } from 'api';

export default {
  ratings: [],
  lastReplayIndex: 0,
  setRatings: action((state, payload) => {
    state.ratings = payload.ratings;
    state.lastReplayIndex = payload.lastReplayIndex;
  }),
  getRatings: thunk(async (actions, payload) => {
    const replayRatings = await ReplayRating(payload);
    if (replayRatings.ok) {
      actions.setRatings({
        ratings: replayRatings.data,
        lastReplayIndex: payload,
      });
    }
  }),
  addRating: thunk(async (actions, payload) => {
    const add = await AddReplayRating(payload);
    if (add.ok) {
      actions.getRatings(payload.ReplayIndex);
    }
  }),
};
