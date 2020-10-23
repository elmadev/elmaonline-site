/* eslint-disable no-param-reassign */
import { action, persist, thunk } from 'easy-peasy';
import {
  AllFinishedInRange,
  Cup,
  CupEvents,
  UpdateCup,
  UpdateCupBlog,
  AddEvent,
  EditEvent,
  DeleteEvent,
  GenerateEvent,
  SubmitInterview,
  MyReplays,
  UpdateReplay,
  PersonalAllFinished,
  TeamReplays,
} from 'data/api';

export default {
  cup: {},
  lastCupShortName: '',
  events: [],
  setCupGroup: action((state, payload) => {
    state.cup = payload.cup;
    state.lastCupShortName = payload.last;
  }),
  setCupEvents: action((state, payload) => {
    state.events = payload;
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
  allFinished: [],
  setMyReplays: action((state, payload) => {
    state.myReplays = payload;
  }),
  setMyTimes: action((state, payload) => {
    state.myTimes = payload;
  }),
  setAllFinished: action((state, payload) => {
    state.allFinished = payload;
  }),
  getMyReplays: thunk(async (actions, payload) => {
    const recs = await MyReplays(payload);
    if (recs.ok) {
      actions.setMyReplays(recs.data);
    }
  }),
  updateReplay: thunk(async (actions, payload) => {
    const update = await UpdateReplay(payload);
    if (update.ok) {
      actions.getMyReplays(payload.CupGroupIndex);
    }
  }),
  getMyTimes: thunk(async (actions, payload) => {
    const times = await PersonalAllFinished(payload);
    if (times.ok) {
      actions.setMyTimes(times.data);
    }
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
  getAllFinishedInRange: thunk(async (actions, payload) => {
    const times = await AllFinishedInRange(payload);
    if (times.ok) {
      actions.setAllFinished(times.data);
    }
  }),
};
