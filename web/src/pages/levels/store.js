import { action, thunk, actionOn } from 'easy-peasy';
import {
  LevelPacks,
  LevelPackFavAdd,
  LevelPackFavRemove,
  LevelPackFavs,
  Collections,
  LevelPacksStats,
} from 'api';
import { cachedSort } from './storeUtils';
import { shiftedLogisticFn } from 'utils/calcs';

export default {
  checkSort: actionOn(
    actions => [
      actions.setLevelpacks,
      actions.setFavs,
      actions.setStats,
      actions.setSort,
    ],
    state => {
      state.levelpacksSorted = cachedSort(
        state.levelpacks,
        state.favs,
        state.stats,
        state.sort || 'default',
      );
    },
  ),
  // sort lives in URL. Component passes it to store.
  sort: 'default',
  setSort: action((state, payload) => {
    state.sort = payload;
  }),
  // sorted and with pack.Fav set on all packs. (use this).
  levelpacksSorted: [],
  // just the raw data from the server. Potentially not ever needed in component.
  levelpacks: [],
  setLevelpacks: action((state, payload) => {
    state.levelpacks = payload;
  }),
  // re-fetch should be avoided when possible. The issue is that sort and detailed view
  // use navigation, which triggers component re-mounting, then component effects run
  // and call this function, and even though we memoized the sort, it seems to fail
  // sometimes due to inputs being objects which are JSON encoded in different orders,
  // therefore, if we're not careful, changing sort options causes a re-fetch from several
  // endpoints and then sorts the data 3 additional times which makes the page slow.
  getLevelpacks: thunk(async (actions, refetch, helpers) => {
    if (!refetch && helpers.getState().levelpacks.length) {
      return;
    }

    const get = await LevelPacks();
    if (get.ok) {
      actions.setLevelpacks(get.data);
    }
  }),
  favsFetched: false,
  favs: [],
  setFavs: action((state, payload) => {
    state.favs = payload;
    state.favsFetched = true;
  }),
  getFavs: thunk(async (actions, refetch, helpers) => {
    if (!refetch && helpers.getState().favsFetched) {
      return;
    }

    const get = await LevelPackFavs();
    if (get.ok) {
      actions.setFavs(get.data);
    }
  }),
  addFav: thunk(async (actions, payload) => {
    const post = await LevelPackFavAdd(payload);
    if (post.ok) {
      actions.getFavs(true);
    }
  }),
  removeFav: thunk(async (actions, payload) => {
    const post = await LevelPackFavRemove(payload);
    if (post.ok) {
      actions.getFavs(true);
    }
  }),
  collections: [],
  setCollections: action((state, payload) => {
    state.collections = payload;
  }),
  getCollections: thunk(async actions => {
    const get = await Collections();
    if (get.ok) {
      actions.setCollections(get.data);
    }
  }),
  // levelpack stats objects, indexed by LevelPackIndex
  stats: {},
  setStats: action((state, payload) => {
    state.stats = payload;
  }),
  getStats: thunk(async (actions, refetch, helpers) => {
    if (!refetch && helpers.getState().stats.length) {
      return;
    }

    const get = await LevelPacksStats();
    if (get.ok) {
      const indexed = get.data.reduce((acc, val) => {
        val.NormalizedPopularity = shiftedLogisticFn(
          0.9935,
          val.AvgKuskiPerLevel,
        );

        acc[val.LevelPackIndex] = val;
        return acc;
      }, {});

      actions.setStats(indexed);
    }
  }),
};
