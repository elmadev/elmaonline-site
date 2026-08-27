import Cookies from 'universal-cookie';

export const authToken = () => {
  const cookies = new Cookies();
  const token = cookies.get('token');
  if (token) {
    return token;
  }
  return '';
};

export const nick = () => {
  const cookies = new Cookies();
  const token = cookies.get('token');
  const username = cookies.get('username');
  if (token && username) {
    return username;
  }
  return '';
};

export const nickId = () => {
  const cookies = new Cookies();
  const token = cookies.get('token');
  const userid = cookies.get('userid');
  if (token && userid) {
    return parseInt(userid, 10);
  }
  return 0;
};

export const mod = () => {
  const cookies = new Cookies();
  const token = cookies.get('token');
  const m = cookies.get('mod');
  if (token && m) {
    return parseInt(m, 10);
  }
  return 0;
};

export const admin = () => {
  const cookies = new Cookies();
  const token = cookies.get('token');
  const a = cookies.get('admin');
  if (token && a) {
    return parseInt(a, 10);
  }
  return 0;
};
