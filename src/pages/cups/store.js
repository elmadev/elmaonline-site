/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { Cups } from 'data/api';

export default {
  cupList: [],
  setCupList: action((state, payload) => {
    state.cupList = payload;
  }),
  getCups: thunk(async actions => {
    const cups = await Cups();
    if (cups.ok) {
      actions.setCupList(cups.data);
    }
  }),
};
