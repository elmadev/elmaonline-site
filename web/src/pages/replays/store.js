import { action, thunk } from 'easy-peasy';
import { GetTags, CreateTag, UpdateTag, DeleteTag } from 'api';

export default {
  error: null,
  tags: [],
  setError: action((state, payload) => {
    state.error = payload;
  }),
  setTags: action((state, payload) => {
    state.tags = payload;
  }),
  getTags: thunk(async (actions, payload) => {
    const get = await GetTags(payload);
    if (get.ok) {
      actions.setTags(get.data);
    }
  }),
  addTag: thunk(async (actions, payload) => {
    const post = await CreateTag(payload);
    if (post.ok) {
      actions.getTags(payload.name);
    } else {
      actions.setError(post.data.error);
    }
  }),
  updateTag: thunk(async (actions, payload) => {
    const put = await UpdateTag(payload.TagIndex, payload);
    if (put.ok) {
      actions.getTags();
    } else {
      actions.setError(put.data.error);
    }
  }),
  deleteTag: thunk(async (actions, payload) => {
    const response = await DeleteTag(payload);
    if (response.ok) {
      actions.getTags();
    } else {
      actions.setError(response.data.error);
    }
  }),
};
