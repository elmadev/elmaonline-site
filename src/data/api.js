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
export const ReplayRating = replayIndex =>
  api.get(`replay_rating/${replayIndex}`);
export const AddReplayRating = data => api.post(`replay_rating/add`, data);
export const ReplayDrivenBy = kuskiIndex =>
  api.get(`replay/driven_by/${kuskiIndex}`);
export const ReplayUploadedBy = kuskiIndex =>
  api.get(`replay/uploaded_by/${kuskiIndex}`);
