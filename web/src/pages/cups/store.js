import { action, thunk } from 'easy-peasy';
import { Cups, AddCup } from 'api';

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
  addSuccess: '',
  setAddSuccess: action((state, payload) => {
    state.addSuccess = payload;
  }),
  addCup: thunk(async (actions, payload) => {
    const add = await AddCup(payload);
    if (add.ok) {
      actions.setAddSuccess(payload.CupName);
      actions.getCups();
    }
  }),
};
