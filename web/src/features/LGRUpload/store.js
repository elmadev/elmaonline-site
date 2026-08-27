import { action, thunk } from 'easy-peasy';
import { GetLGRTags } from 'api';

export default {
  page: 'LGRUpload',

  tagOptions: [],
  setTagOptions: action((state, payload) => {
    state.tagOptions = payload;
  }),
  getTagOptions: thunk(async actions => {
    const get = await GetLGRTags();
    if (get.ok) {
      actions.setTagOptions(get.data);
    }
  }),
};
