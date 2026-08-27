import { action, thunk } from 'easy-peasy';
import { Collection, SearchPack, AddPack, DeletePack } from 'api';

export default {
  packs: [],
  setPacks: action((state, payload) => {
    state.packs = payload;
  }),
  collection: {},
  setCollection: action((state, payload) => {
    state.collection = payload;
  }),
  getCollection: thunk(async (actions, payload) => {
    const get = await Collection(payload);
    if (get.ok) {
      actions.setPacks(get.data.Packs);
      actions.setCollection(get.data.Collection);
    }
  }),
  packsFound: [],
  setPacksFound: action((state, payload) => {
    state.packsFound = payload;
  }),
  searchPack: thunk(async (actions, payload) => {
    const get = await SearchPack(payload);
    if (get.ok) {
      actions.setPacksFound(get.data);
    }
  }),
  addPack: thunk(async (actions, payload) => {
    const post = await AddPack(payload);
    if (post.ok) {
      actions.getCollection(payload.name);
    }
  }),
  deletePack: thunk(async (actions, payload) => {
    const post = await DeletePack(payload);
    if (post.ok) {
      actions.getCollection(payload.name);
    }
  }),
};
