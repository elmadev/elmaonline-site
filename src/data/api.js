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
export const Cups = () => api.get('cups');
export const Cup = shortName => api.get(`cups/${shortName}`);
export const CupEvents = cupGroupIndex =>
  api.get(`cups/events/${cupGroupIndex}`);
export const UpdateCup = (cupGroupIndex, data) =>
  api.post(`cups/edit/${cupGroupIndex}`, data);
export const UpdateCupBlog = data => api.post(`cups/blog/add`, data);
export const AddCup = data => api.post(`cups/add`, data);
export const AddEvent = (data, cupGroupIndex) =>
  api.post(`cups/${cupGroupIndex}/event/add`, data);
export const EditEvent = data =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.CupIndex}/edit`,
    data.event,
  );
export const DeleteEvent = data =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.event.CupIndex}/delete`,
    data.event,
  );
export const GenerateEvent = data =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.event.CupIndex}/generate`,
    data.event,
  );
export const KuskiMap = () => api.get('kuskimap');
export const AddKuskiMap = data => api.post('kuskimap/add', data);
export const ResetPasswordConfirm = data =>
  api.post('register/resetconfirm', data);
export const ResetPassword = data => api.post('register/reset', data);
export const Highlight = () => api.get('allfinished/highlight');
export const TotalTimes = LevelPackIndex =>
  api.get(`levelpack/${LevelPackIndex}/totaltimes`);
export const PersonalTimes = data =>
  api.get(`levelpack/${data.name}/personal/${data.PersonalKuskiIndex}`);
export const PersonalAllFinished = data =>
  api.get(`allfinished/${data.LevelIndex}/${data.KuskiIndex}/${data.limit}`);
export const Besttime = data =>
  api.get(`besttime/${data.levelId}/${data.limit}`);
export const Records = LevelPackName =>
  api.get(`levelpack/${LevelPackName}/records`);
export const LevelPackSearch = q => api.get(`levelpack/search/${q}`);
