import { action, thunk, persist } from 'easy-peasy';
import {
  Highlight,
  PersonalAllFinished,
  Besttime,
  BesttimeFilter,
  LevelPackStats,
  LevelPackStatsFilter,
  MultiRecords,
  MultiBesttime,
  PersonalWithMulti,
  PersonalTimes,
  LevelPackDeleteLevel,
  LevelsSearchAll,
  LevelPackAddLevel,
  LevelPackSort,
  LevelPack,
  UpdateLevelPack,
  LevelPackUpdateLevel,
  LevelPackRecords,
  LevelPackRecordsFilter,
  GetLevelPackTags,
} from 'api';

export default {
  levelPackInfo: {},
  setLevelPackInfo: action((state, payload) => {
    state.levelPackInfo = payload;
  }),
  getLevelPackInfo: thunk(async (actions, payload) => {
    const get = await LevelPack(payload, true);
    if (get.ok) {
      actions.setLevelPackInfo(get.data);
    }
    actions.setAdminLoading(false);
  }),
  // update long name, desc.
  updateLevelPack: thunk(async (actions, payload, { getState }) => {
    const response = await UpdateLevelPack(payload.LevelPackIndex, payload);

    if (response.ok) {
      const { LevelPack, errors = [], success = false } = response.data;
      if (success) {
        actions.setLevelPackInfo({ ...getState().levelPackInfo, ...LevelPack });
      }

      return errors;
    } else {
      return ['Server error.'];
    }
  }),
  highlight: [9999999999, 9999999999, 9999999999, 9999999999, 9999999999],
  multiHighlight: [9999999999, 9999999999, 9999999999, 9999999999, 9999999999],
  setHighlight: action((state, payload) => {
    state.highlight = payload.single;
    state.multiHighlight = payload.multi;
  }),
  getHighlight: thunk(async actions => {
    const highlights = await Highlight();
    if (highlights.ok) {
      actions.setHighlight(highlights.data);
    }
  }),
  settings: persist(
    {
      highlightWeeks: 1,
      showLegacyIcon: true,
      showLegacy: true,
      showMoreStats: false,
      relative: false,
      highlightTargets: false,
      showLogos: true,
    },
    { storage: 'localStorage' },
  ),
  setHighlightWeeks: action((state, payload) => {
    state.settings.highlightWeeks = payload;
  }),
  toggleShowLegacyIcon: action(state => {
    state.settings.showLegacyIcon = !state.settings.showLegacyIcon;
  }),
  toggleShowLegacy: action(state => {
    state.settings.showLegacy = !state.settings.showLegacy;
  }),
  toggleShowLogos: action(state => {
    state.settings.showLogos = !state.settings.showLogos;
  }),
  setShowMoreStats: action((state, payload) => {
    state.settings.showMoreStats = payload;
  }),
  setRelative: action((state, payload) => {
    state.settings.relative = payload;
  }),
  setHighlightTargets: action((state, payload) => {
    state.settings.highlightTargets = payload;
  }),
  totaltimes: [],
  kinglist: [],
  setTotalTimes: action((state, payload) => {
    state.totaltimes = payload;
  }),
  setKinglist: action((state, payload) => {
    state.kinglist = payload;
  }),
  teams: [],
  countries: [],
  kuskis: [],
  setTeams: action((state, payload) => {
    state.teams = payload;
  }),
  setCountries: action((state, payload) => {
    state.countries = payload;
  }),
  setKuskis: action((state, payload) => {
    state.kuskis = payload;
  }),
  compareKuski: {},
  setCompare: action((state, payload) => {
    state.compareKuski[payload.PersonalKuskiIndex] = payload.Times;
  }),
  getCompareKuski: thunk(async (actions, payload) => {
    const get = await PersonalTimes(payload);
    if (get.ok) {
      actions.setCompare({ ...payload, Times: get.data });
    }
  }),
  compareCountry: {},
  setCompareCountry: action((state, payload) => {
    state.compareCountry[payload.filterValue] = payload.Times;
  }),
  getCompareCountry: thunk(async (actions, payload) => {
    const get = await LevelPackRecordsFilter(payload);
    if (get.ok) {
      actions.setCompareCountry({ ...payload, Times: get.data });
    }
  }),
  compareTeam: {},
  setCompareTeam: action((state, payload) => {
    state.compareTeam[payload.filterValue] = payload.Times;
  }),
  getCompareTeam: thunk(async (actions, payload) => {
    const get = await LevelPackRecordsFilter(payload);
    if (get.ok) {
      actions.setCompareTeam({ ...payload, Times: get.data });
    }
  }),
  personalTimes: [],
  setPersonalTimes: action((state, payload) => {
    state.personalTimes = payload;
  }),
  getPersonalTimes: thunk(async (actions, payload) => {
    actions.setPersonalKuski(payload.PersonalKuskiIndex);
    const data = await PersonalWithMulti(payload);
    if (data.ok) {
      if (data.data.error) {
        actions.setError(data.data.error);
      } else {
        actions.setPersonalTimes(data.data);
      }
    }
  }),
  timesError: '',
  setError: action((state, payload) => {
    state.timesError = payload;
  }),
  personalKuski: '',
  setPersonalKuski: action((state, payload) => {
    state.personalKuski = payload;
  }),
  personalAllFinished: [],
  setPeronalAllFinished: action((state, payload) => {
    state.personalAllFinished = payload;
  }),
  getPersonalAllFinished: thunk(async (actions, payload) => {
    const times = await PersonalAllFinished(payload);
    if (times.ok) {
      actions.setPeronalAllFinished(times.data);
    }
  }),
  levelBesttimes: [],
  setLevelBesttimes: action((state, payload) => {
    state.levelBesttimes = payload;
  }),
  getLevelBesttimes: thunk(async (actions, payload) => {
    let times;
    if (payload.filter) {
      times = await BesttimeFilter(payload);
    } else {
      times = await Besttime(payload);
    }
    if (times.ok) {
      actions.setLevelBesttimes(times.data);
    }
  }),
  levelMultiBesttimes: [],
  setLevelMultiBesttimes: action((state, payload) => {
    state.levelMultiBesttimes = payload;
  }),
  getLevelMultiBesttimes: thunk(async (actions, payload) => {
    const times = await MultiBesttime(payload);
    if (times.ok) {
      actions.setLevelMultiBesttimes(times.data);
    }
  }),
  recordsLoading: false,
  setRecordsLoading: action((state, payload) => {
    state.recordsLoading = payload;
  }),
  getStats: thunk(async (actions, payload) => {
    actions.setRecordsLoading(true);
    let times;
    if (payload.filter) {
      times = await LevelPackStatsFilter(payload);
    } else {
      times = await LevelPackStats(payload);
    }
    if (times.ok) {
      actions.setTotalTimes(times.data.tts);
      actions.setKinglist(times.data.points);
      if (times.data.teams) {
        actions.setTeams(times.data.teams);
      }
      if (times.data.countries) {
        actions.setCountries(times.data.countries);
      }
      if (times.data.kuskis) {
        actions.setKuskis(times.data.kuskis);
      }
    }
    actions.setRecordsLoading(false);
  }),
  recordsOnly: [],
  setRecordsOnly: action((state, payload) => {
    state.recordsOnly = payload;
  }),
  recordsOnlyLoading: false,
  setRecordsOnlyLoading: action((state, payload) => {
    state.recordsOnlyLoading = payload;
  }),
  getRecordsOnly: thunk(async (actions, payload) => {
    actions.setRecordsOnlyLoading(true);
    let get;
    if (payload.filter) {
      get = await LevelPackRecordsFilter(payload);
    } else {
      get = await LevelPackRecords(payload);
    }
    if (get.ok) {
      actions.setRecordsOnly(get.data);
    }
    actions.setRecordsOnlyLoading(false);
  }),
  multiRecords: [],
  multiRecordsLoading: false,
  setMultiRecords: action((state, payload) => {
    state.multiRecords = payload;
  }),
  setMultiRecordsLoading: action((state, payload) => {
    state.multiRecordsLoading = payload;
  }),
  getMultiRecords: thunk(async (actions, payload) => {
    actions.setMultiRecordsLoading(true);
    const times = await MultiRecords(payload);
    if (times.ok) {
      actions.setMultiRecords(times.data);
    }
    actions.setMultiRecordsLoading(false);
  }),
  deleteLevel: thunk(async (actions, payload) => {
    const del = await LevelPackDeleteLevel(payload);
    if (del.ok) {
      actions.getLevelPackInfo(payload.name);
    }
  }),
  levelsFound: [],
  adminLoading: false,
  setLevelsFound: action((state, payload) => {
    state.levelsFound = payload;
  }),
  setAdminLoading: action((state, payload) => {
    state.adminLoading = payload;
  }),
  searchLevel: thunk(async (actions, payload) => {
    const levs = await LevelsSearchAll(payload);
    if (levs.ok) {
      actions.setLevelsFound(levs.data);
    }
  }),
  addLevel: thunk(async (actions, payload) => {
    const add = await LevelPackAddLevel(payload);
    if (add.ok) {
      actions.getLevelPackInfo(payload.name);
    }
  }),
  sortPack: thunk(async (actions, payload) => {
    actions.setAdminLoading(true);
    const sort = await LevelPackSort(payload);
    if (sort.ok) {
      actions.getLevelPackInfo(payload.name);
    } else {
      actions.setAdminLoading(false);
    }
  }),
  updateLevel: thunk(async (actions, payload) => {
    const update = await LevelPackUpdateLevel(payload);
    if (update.ok) {
      actions.getLevelPackInfo(payload.name);
    }
  }),
  team: '',
  setTeam: action((state, payload) => {
    state.team = payload;
  }),
  country: '',
  setCountry: action((state, payload) => {
    state.country = payload;
  }),
  kuskisFilter: [],
  setKuskisFilter: action((state, payload) => {
    state.kuskisFilter = payload;
  }),
  tagOptions: [],
  setTagOptions: action((state, payload) => {
    state.tagOptions = payload;
  }),
  getTagOptions: thunk(async actions => {
    const get = await GetLevelPackTags();
    if (get.ok) {
      actions.setTagOptions(get.data);
    }
  }),
};
