import { action, thunk } from 'easy-peasy';
import { News } from 'api';

export default {
  news: [],
  setNews: action((state, payload) => {
    state.news = payload;
  }),
  getNews: thunk(async (actions, payload) => {
    const get = await News(payload);
    if (get.ok) {
      actions.setNews(get.data);
    }
  }),
};
