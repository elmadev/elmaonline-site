import { create } from 'apisauce';

const isWindow = typeof window !== 'undefined';
let baseURL = 'http://localhost:3000/api/';
if (isWindow) {
  baseURL = `${window.location.protocol}//${window.location.host}/api/`;
}
const api = create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
  timeout: 10000,
});

export const ReplayComment = replayIndex =>
  api.get(`replay_comment/${replayIndex}`);
export const AddReplayComment = data => api.post(`replay_comment/add`, data);
export const ReplayRating = replayIndex =>
  api.get(`replay_rating/${replayIndex}`);
export const AddReplayRating = data => api.post(`replay_rating/add`, data);
export const ReplayDrivenBy = kuskiIndex =>
  api.get(`replay/driven_by/${kuskiIndex}`);
export const ReplayUploadedBy = kuskiIndex =>
  api.get(`replay/uploaded_by/${kuskiIndex}`);
export const Country = () => api.get('country');
export const Register = data => api.post('register', data);
export const Confirm = data => api.post('register/confirm', data);
export const KuskiMap = () => api.get('kuskimap');
export const AddKuskiMap = data => api.post('kuskimap/add', data);
export const ResetPasswordConfirm = data =>
  api.post('register/resetconfirm', data);
export const ResetPassword = data => api.post('register/reset', data);
