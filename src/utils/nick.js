import Cookies from 'universal-cookie';

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
