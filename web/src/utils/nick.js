import Cookies from 'universal-cookie';

// login cookies live as long as the absolute session cap (tokenMaxAge in
// api/src/utils/auth.js), the token's own exp decides if it's still valid
export const loginCookieOptions = {
  path: '/',
  maxAge: 300 * 24 * 60 * 60,
};

export const saveToken = token => {
  const cookies = new Cookies();
  cookies.set('token', token, loginCookieOptions);
};

// check token expiry, tokens without exp were issued before that and
// are rejected, so treat both as logged out
const tokenExpired = token => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp !== 'number' || exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const authToken = () => {
  const cookies = new Cookies();
  const token = cookies.get('token');
  if (token && !tokenExpired(token)) {
    return token;
  }
  return '';
};

// log out a tab whose token expired (or was logged out in another tab) while
// it was open. checked on navigation, when the tab gets focus and on 401s
let sessionStore = null;

export const checkSession = () => {
  if (sessionStore?.getState().Login.loggedIn && !authToken()) {
    sessionStore.getActions().Login.logout();
  }
};

export const watchSession = (store, router) => {
  sessionStore = store;
  router.subscribe('onResolved', checkSession);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkSession();
    }
  });
};

export const nick = () => {
  const cookies = new Cookies();
  const token = authToken();
  const username = cookies.get('username');
  if (token && username) {
    return username;
  }
  return '';
};

export const nickId = () => {
  const cookies = new Cookies();
  const token = authToken();
  const userid = cookies.get('userid');
  if (token && userid) {
    return parseInt(userid, 10);
  }
  return 0;
};

export const mod = () => {
  const cookies = new Cookies();
  const token = authToken();
  const m = cookies.get('mod');
  if (token && m) {
    return parseInt(m, 10);
  }
  return 0;
};

export const admin = () => {
  const cookies = new Cookies();
  const token = authToken();
  const a = cookies.get('admin');
  if (token && a) {
    return parseInt(a, 10);
  }
  return 0;
};
