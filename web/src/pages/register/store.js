import { action, thunk } from 'easy-peasy';
import {
  Country,
  Register,
  Confirm,
  ResetPasswordConfirm,
  ResetPassword,
} from 'api';

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
  resetMessage: '',
  setResetMessage: action((state, payload) => {
    state.resetMessage = payload;
  }),
  resetSuccess: false,
  setResetSuccess: action((state, payload) => {
    state.resetSuccess = payload;
  }),
  password: '',
  setPassword: action((state, payload) => {
    state.password = payload;
  }),
  resetPassword: thunk(async (actions, payload) => {
    const attemptReset = await ResetPasswordConfirm(payload);
    if (attemptReset.ok) {
      if (attemptReset.data.success) {
        actions.setResetSuccess(true);
      } else {
        actions.setResetMessage(attemptReset.data.message);
      }
    }
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
  tryReset: thunk(async (actions, payload) => {
    const attempReset = await ResetPassword(payload);
    if (attempReset.ok) {
      if (attempReset.data.success) {
        actions.setConfirmSuccess(2);
        actions.setPassword(attempReset.data.newPassword);
      } else {
        actions.setConfirmSuccess(-2);
      }
    } else {
      actions.setConfirmSuccess(-2);
    }
  }),
};
