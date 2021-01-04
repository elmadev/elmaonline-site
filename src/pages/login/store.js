/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default {
  loggedIn: cookies.get('token') !== undefined,
  username: cookies.get('username'),
  setLoggedIn: action((state, payload) => {
    state.loggedIn = payload;
  }),
  setUsername: action((state, payload) => {
    state.username = payload;
  }),
  login: thunk(async (actions, payload) => {
    const login = await fetch('/token', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await login.json();

    if (!body.Response.success) {
      return Promise.reject(body.Response.message);
    }

    const options = {
      path: '/',
      maxAge: 8640000,
    };
    cookies.set('token', body.Response.token, options);
    cookies.set('username', body.Response.username, options);
    cookies.set('userid', body.Response.userid, options);
    if (body.Response.mod) {
      cookies.set('mod', body.Response.mod, options);
    }
    if (body.Response.admin) {
      cookies.set('admin', body.Response.admin, options);
    }
    actions.setLoggedIn(true);
    actions.setUsername(body.Response.username);
    return Promise.resolve();
  }),
  logout: thunk(async actions => {
    cookies.remove('token', { path: '/' });
    cookies.remove('username', { path: '/' });
    cookies.remove('userid', { path: '/' });
    cookies.remove('mod', { path: '/' });
    cookies.remove('admin', { path: '/' });
    actions.setLoggedIn(false);
  }),
};
