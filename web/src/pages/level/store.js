import { action, thunk, persist } from 'easy-peasy';
import {
  Besttime,
  Level,
  BattlesByLevel,
  AllFinishedLevel,
  LevelTimeStats,
  LeaderHistory,
  LevelPacksByLevel,
  CupsByLevel,
  GetLevelTags,
  UpdateLevelTags,
  PersonalAllFinished,
} from 'api';

export default {
  besttimes: [],
  besttimesLoading: 0,
  level: {},
  levelpacks: [],
  cups: [],
  battlesForLevel: [],
  loading: true,
  allfinished: [],
  allLoading: 0,
  myTimes: [],
  myTimesLoading: 0,
  eoltimes: [],
  eolLoading: 0,
  timeStats: [],
  personalLeaderHistory: [],
  leaderHistory: [],
  statsLoading: 0,
  leaderHistoryLoading: 0,
  personalLeaderHistoryLoading: 0,
  settings: persist(
    {
      fancyMap: navigator.userAgent.toLowerCase().indexOf('firefox') === -1,
      showGravityApples: false,
    },
    { storage: 'localStorage' },
  ),
  toggleFancyMap: action(state => {
    state.settings.fancyMap = !state.settings.fancyMap;
  }),
  toggleShowGravityApples: action(state => {
    state.settings.showGravityApples = !state.settings.showGravityApples;
  }),
  setBestLoading: action((state, payload) => {
    state.besttimesLoading = payload;
  }),
  setBesttimes: action((state, payload) => {
    state.besttimes = payload.times;
    state.besttimesLoading = payload.id;
  }),
  getBesttimes: thunk(async (actions, payload) => {
    actions.setBestLoading(true);
    const times = await Besttime(payload);
    if (times.ok) {
      actions.setBesttimes({ times: times.data, id: payload.levelId });
    }
  }),
  setLevel: action((state, payload) => {
    state.level = payload;
    state.loading = false;
  }),
  setLevelPacks: action((state, payload) => {
    state.levelpacks = payload;
  }),
  setCups: action((state, payload) => {
    state.cups = payload;
  }),
  setBattlesForLevel: action((state, payload) => {
    state.battlesForLevel = payload;
  }),
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  getLevel: thunk(async (actions, payload) => {
    actions.setLoading(true);
    Level(payload, 1).then(res => {
      if (res.ok) {
        actions.setLevel(res.data);
      }
    });

    BattlesByLevel(payload).then(res => {
      if (res.ok) {
        actions.setBattlesForLevel(res.data);
      }
    });

    LevelPacksByLevel(payload).then(res => {
      if (res.ok) {
        actions.setLevelPacks(res.data);
      }
    });

    CupsByLevel(payload).then(res => {
      if (res.ok) {
        actions.setCups(res.data);
      }
    });
  }),
  setAllfinished: action((state, payload) => {
    state.allfinished = payload.times;
    state.allLoading = payload.id;
  }),
  getAllfinished: thunk(async (actions, payload) => {
    const times = await AllFinishedLevel(payload);
    if (times.ok) {
      actions.setAllfinished({ times: times.data, id: payload });
    }
  }),
  setEoltimes: action((state, payload) => {
    state.eoltimes = payload.times;
    state.eolLoading = payload.id;
  }),
  getEoltimes: thunk(async (actions, payload) => {
    const times = await Besttime(payload);
    if (times.ok) {
      actions.setEoltimes({ times: times.data, id: payload.levelId });
    }
  }),
  setTimeStats: action((state, payload) => {
    state.timeStats = payload.data;
    state.statsLoading = payload.id;
  }),
  getTimeStats: thunk(async (actions, payload) => {
    const stats = await LevelTimeStats(payload);
    if (stats.ok) {
      actions.setTimeStats({
        data: stats.data,
        id: payload.LevelIndex,
      });
    }
  }),
  setPersonalLeaderHistory: action((state, payload) => {
    state.personalLeaderHistory = payload.data;
    state.personalLeaderHistoryLoading = payload.id;
  }),
  getPersonalLeaderHistory: thunk(async (actions, payload) => {
    const leaderHistory = await LeaderHistory(payload);
    if (leaderHistory.ok) {
      actions.setPersonalLeaderHistory({
        data: leaderHistory.data,
        id: payload.LevelIndex,
      });
    }
  }),
  setLeaderHistory: action((state, payload) => {
    state.leaderHistory = payload.data;
    state.leaderHistoryLoading = payload.id;
  }),
  getLeaderHistory: thunk(async (actions, payload) => {
    const leaderHistory = await LeaderHistory(payload);
    if (leaderHistory.ok) {
      actions.setLeaderHistory({
        data: leaderHistory.data,
        id: payload.LevelIndex,
      });
    }
  }),
  tagOptions: [],
  setTagOptions: action((state, payload) => {
    state.tagOptions = payload;
  }),
  getTagOptions: thunk(async actions => {
    const get = await GetLevelTags();
    if (get.ok) {
      actions.setTagOptions(get.data);
    }
  }),
  updateLevelTags: thunk(async (actions, payload) => {
    const response = await UpdateLevelTags(payload);

    if (response.ok) {
      actions.setLevel(response.data);
    } else {
      return ['Server error.'];
    }
  }),
  setMyTimes: action((state, payload) => {
    state.myTimes = payload.times;
    state.myTimesLoading = payload.id;
  }),
  getMyTimes: thunk(async (actions, payload) => {
    const times = await PersonalAllFinished(payload);
    if (times.ok) {
      actions.setMyTimes({ times: times.data, id: payload.LevelIndex });
    }
  }),
};
