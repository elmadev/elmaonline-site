import { create } from 'apisauce';

const baseURL = 'http://localhost:3000/api/';
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
