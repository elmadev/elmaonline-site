import { action, persist, thunk } from 'easy-peasy';
import {
  LeaderHistory,
  Cup,
  CupsOngoing,
  CupEvents,
  UpdateCup,
  UpdateCupBlog,
  AddEvent,
  EditEvent,
  DeleteEvent,
  GenerateEvent,
  SubmitInterview,
  MyReplays,
  UpdateCupReplay,
  PersonalAllFinished,
  PersonalAppleRuns,
  TeamReplays,
  LevelsSearchAll,
} from 'api';
import { forEach } from 'lodash';

export default {
  cup: {},
  lastCupShortName: '',
  events: [],
  onGoingCups: ['default', []],
  setCupGroup: action((state, payload) => {
    state.cup = payload.cup;
    state.lastCupShortName = payload.last;
  }),
  setCupEvents: action((state, payload) => {
    state.events = payload;
  }),
  setOnGoingCups: action((state, payload) => {
    state.onGoingCups = payload;
  }),
  getCup: thunk(async (actions, payload) => {
    const getCup = await Cup(payload);
    if (getCup.ok && getCup.data) {
      actions.setCupGroup({ cup: getCup.data, last: payload });
      const getCupEvents = await CupEvents(getCup.data.CupGroupIndex);
      if (getCupEvents.ok) {
        actions.setCupEvents(getCupEvents.data);
      }
    }
  }),
  getOnGoingCups: thunk(async actions => {
    actions.setOnGoingCups(['loading', []]);
    const getCup = await CupsOngoing();
    if (getCup.ok) {
      actions.setOnGoingCups(['finished', getCup.data]);
    }
  }),
  update: thunk(async (actions, payload) => {
    const update = await UpdateCup(payload.CupGroupIndex, payload.data);
    if (update.ok) {
      actions.getCup(payload.shortName);
    }
  }),
  addNewBlog: thunk(async (actions, payload) => {
    const add = await UpdateCupBlog(payload.data);
    if (add.ok) {
      actions.getCup(payload.shortName);
    }
  }),
  addEvent: thunk(async (actions, payload) => {
    const add = await AddEvent(payload.event, payload.CupGroupIndex);
    if (add.ok) {
      actions.getCup(payload.last);
    }
  }),
  editEvent: thunk(async (actions, payload) => {
    const edit = await EditEvent(payload);
    if (edit.ok) {
      actions.getCup(payload.last);
    }
  }),
  deleteEvent: thunk(async (actions, payload) => {
    const del = await DeleteEvent(payload);
    if (del.ok) {
      actions.getCup(payload.last);
    }
  }),
  updated: '',
  setUpdated: action((state, payload) => {
    state.updated = payload;
  }),
  generateEvent: thunk(async (actions, payload) => {
    const generate = await GenerateEvent(payload);
    if (generate.ok) {
      actions.getCup(payload.last);
      actions.setUpdated('Event results generated');
    }
  }),
  sendInterview: thunk(async (actions, payload) => {
    const send = await SubmitInterview(payload);
    if (send.ok) {
      actions.getCup(payload.ShortName);
    }
  }),
  myReplays: [],
  myTimes: [],
  leaderHistory: [],
  setMyReplays: action((state, payload) => {
    state.myReplays = payload;
  }),
  setMyTimes: action((state, payload) => {
    state.myTimes = payload;
  }),
  pushMyTimes: action((state, payload) => {
    state.myTimes.push({
      level: payload.level,
      times: payload.times,
      appleRuns: payload.appleRuns,
    });
  }),
  setLeaderHistory: action((state, payload) => {
    state.leaderHistory = payload;
  }),
  getMyReplays: thunk(async (actions, payload) => {
    const recs = await MyReplays(payload);
    if (recs.ok) {
      actions.setMyReplays(recs.data);
    }
  }),
  updateReplay: thunk(async (actions, payload) => {
    const update = await UpdateCupReplay(payload);
    if (update.ok) {
      actions.getMyReplays(payload.CupGroupIndex);
    }
  }),
  getMyTimes: thunk(async (actions, payload) => {
    actions.setMyTimes([]);
    const times = await PersonalAllFinished(payload);
    const appleRuns = await PersonalAppleRuns({
      LevelIndex: payload.LevelIndex,
      limit: 5,
    });
    if (times.ok && appleRuns.ok) {
      actions.pushMyTimes({
        times: times.data,
        appleRuns: appleRuns.data,
        level: payload.LevelIndex,
      });
    }
  }),
  myTimesOptions: persist(
    {
      order: 'byTime',
      onlyImproved: false,
    },
    {
      storage: 'localStorage',
    },
  ),
  setMyTimesOptions: action((state, payload) => {
    state.myTimesOptions = payload;
  }),
  teamReplays: [],
  teamOptions: persist(
    {
      showOngoing: false,
      sortByTime: false,
    },
    {
      storage: 'localStorage',
    },
  ),
  setTeamOptions: action((state, payload) => {
    state.teamOptions = payload;
  }),
  setTeamReplays: action((state, payload) => {
    state.teamReplays = payload;
  }),
  getTeamReplays: thunk(async (actions, payload) => {
    const recs = await TeamReplays(payload);
    if (recs.ok) {
      actions.setTeamReplays(recs.data);
    }
  }),
  getLeaderHistory: thunk(async (actions, payload) => {
    const times = await LeaderHistory(payload);
    if (times.ok) {
      actions.setLeaderHistory(times.data);
    }
  }),
  levelList: [],
  setLevelList: action((state, payload) => {
    state.levelList = payload;
  }),
  findLevels: thunk(async (actions, payload) => {
    const get = await LevelsSearchAll({ q: payload, ShowLocked: 1 });
    if (get.ok) {
      const newList = [];
      forEach(get.data, l => {
        newList.push({
          name: `${l.LevelName} (${l.LevelIndex})`,
          value: l.LevelIndex,
        });
      });
      actions.setLevelList(newList);
    }
  }),
};
