/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { Highlight, TotalTimes } from 'data/api';

export default {
  highlight: [9999999999, 9999999999, 9999999999, 9999999999, 9999999999],
  setHighlight: action((state, payload) => {
    state.highlight = payload;
  }),
  getHighlight: thunk(async actions => {
    const highlights = await Highlight();
    if (highlights.ok) {
      actions.setHighlight(highlights.data);
    }
  }),
  totaltimes: [],
  setTotalTimes: action((state, payload) => {
    state.totaltimes = payload;
  }),
  getTotalTimes: thunk(async (actions, payload) => {
    const tts = await TotalTimes(payload);
    if (tts.ok) {
      actions.setTotalTimes(tts.data);
    }
  }),
};
