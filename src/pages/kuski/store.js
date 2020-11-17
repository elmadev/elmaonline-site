/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { PersonalLatest, PersonalLatestPRs, PersonalRanking } from 'data/api';

export default {
  latestTimes: [],
  latestPRs: [],
  setLatest: action((state, payload) => {
    state.latestTimes = payload;
  }),
  setlatestPRs: action((state, payload) => {
    state.latestPRs = payload;
  }),
  getLatest: thunk(async (actions, payload) => {
    actions.setLatest([]);
    actions.setlatestPRs([]);
    const times = await PersonalLatest(payload);
    if (times.ok) {
      actions.setLatest(times.data);
    }
    const prs = await PersonalLatestPRs(payload);
    if (prs.ok) {
      actions.setlatestPRs(prs.data);
    }
  }),
  ranking: [],
  setRanking: action((state, payload) => {
    state.ranking = payload;
  }),
  getRanking: thunk(async (actions, payload) => {
    const call = await PersonalRanking(payload);
    if (call.ok) {
      actions.setRanking(call.data);
    }
  }),
};
