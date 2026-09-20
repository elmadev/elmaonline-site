import { action, persist } from 'easy-peasy';

export const PAGE_SIZES = [30, 60, 120, 240];

export default {
  settings: persist({ pageSize: 30 }, { storage: 'localStorage' }),
  setPageSize: action((state, pageSize) => {
    state.settings.pageSize = pageSize;
  }),
};
