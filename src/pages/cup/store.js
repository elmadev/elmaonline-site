/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { Cup, CupEvents, UpdateCup } from 'data/api';

export default {
  cup: {},
  lastCupShortName: '',
  events: [],
  setCupGroup: action((state, payload) => {
    state.cup = payload.cup;
    state.lastCupShortName = payload.last;
  }),
  setCupEvents: action((state, payload) => {
    state.events = payload;
  }),
  getCup: thunk(async (actions, payload) => {
    const getCup = await Cup(payload);
    if (getCup.ok) {
      actions.setCupGroup({ cup: getCup.data, last: payload });
      const getCupEvents = await CupEvents(getCup.data.CupGroupIndex);
      if (getCupEvents.ok) {
        actions.setCupEvents(getCupEvents.data);
      }
    }
  }),
  update: thunk(async (actions, payload) => {
    const update = await UpdateCup(payload.shortName, payload.data);
    if (update.ok) {
      actions.getCup(payload.shortName);
    }
  }),
};
