/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import {
  PersonalLatest,
  PersonalLatestPRs,
  PersonalRanking,
  Records,
  PersonalTimes,
  BattlesByDesigner,
  UserInfoByIdentifier,
  BattlesByPlayer,
} from 'data/api';

export default {
  latestTimes: [],
  latestPRs: [],
  setLatest: action((state, payload) => {
    state.latestTimes = payload;
  }),
  setlatestPRs: action((state, payload) => {
    state.latestPRs = payload;
  }),
  getLatest: thunk(async (actions, payload) => {
    actions.setLatest([]);
    actions.setlatestPRs([]);
    const times = await PersonalLatest(payload);
    if (times.ok) {
      actions.setLatest(times.data);
    }
    const prs = await PersonalLatestPRs(payload);
    if (prs.ok) {
      actions.setlatestPRs(prs.data);
    }
  }),
  ranking: [],
  setRanking: action((state, payload) => {
    state.ranking = payload;
  }),
  getRanking: thunk(async (actions, payload) => {
    const call = await PersonalRanking(payload);
    if (call.ok) {
      actions.setRanking(call.data);
    }
  }),
  tt: [],
  setTt: action((state, payload) => {
    state.tt = payload;
  }),
  getTt: thunk(async (actions, payload) => {
    const records = await Records({ name: 'Int', eolOnly: 0 });
    const times = await PersonalTimes({
      PersonalKuskiIndex: payload,
      name: 'Int',
      eolOnly: 0,
    });
    if (records.ok && times.ok) {
      const levels = records.data.map(r => {
        const personal = times.data.filter(t => t.LevelIndex === r.LevelIndex);
        if (personal.length > 0) {
          return { ...r, LevelBesttime: personal[0].LevelBesttime };
        }
        return { ...r, LevelBesttime: [] };
      });
      actions.setTt(levels);
    }
  }),
  designedBattles: {
    count: 0,
    rows: [],
  },
  setDesignedBattes: action((state, payload) => {
    state.designedBattles = payload;
  }),
  getDesignedBattles: thunk(async (actions, payload) => {
    const call = await BattlesByDesigner(payload);
    if (call.ok) {
      actions.setDesignedBattes(call.data);
    }
  }),
  playedBattles: {
    rows: [],
  },
  setPlayedBattles: action((state, payload) => {
    state.playedBattles = payload;
  }),
  getPlayedBattles: thunk(async (actions, payload) => {
    const battles = await BattlesByPlayer(payload);
    if (battles.ok) {
      actions.setPlayedBattles(battles.data);
    }
  }),
  kuski: '',
  setKuski: action((state, payload) => {
    state.kuski = payload;
  }),
  getKuskiByName: thunk(async (actions, payload) => {
    const kuski = await UserInfoByIdentifier({
      IdentifierType: 'Kuski',
      KuskiIdentifier: payload,
    });
    if (kuski.ok) {
      actions.setKuski(kuski.data);
    }
  }),
};
