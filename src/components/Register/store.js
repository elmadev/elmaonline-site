/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { Country, Register, Confirm } from 'data/api';

export default {
  countries: [],
  getCountries: thunk(async actions => {
    const countries = await Country();
    if (countries.ok) {
      actions.setCountries(countries.data);
    }
  }),
  setCountries: action((state, payload) => {
    state.countries = payload;
  }),
  registerMessage: '',
  setRegisterMessage: action((state, payload) => {
    state.registerMessage = payload;
  }),
  registerSuccess: false,
  setRegisterSuccess: action((state, payload) => {
    state.registerSuccess = payload;
  }),
  register: thunk(async (actions, payload) => {
    const attemptReg = await Register(payload);
    if (attemptReg.ok) {
      if (attemptReg.data.success) {
        actions.setRegisterSuccess(true);
      } else {
        actions.setRegisterMessage(attemptReg.data.message);
      }
    }
  }),
  confirmSuccess: 0,
  setConfirmSuccess: action((state, payload) => {
    state.confirmSuccess = payload;
  }),
  tryConfirm: thunk(async (actions, payload) => {
    const attemptConfirm = await Confirm(payload);
    if (attemptConfirm.ok) {
      if (attemptConfirm.data.success) {
        actions.setConfirmSuccess(1);
      } else {
        actions.setConfirmSuccess(-1);
      }
    } else {
      actions.setConfirmSuccess(-1);
    }
  }),
};
