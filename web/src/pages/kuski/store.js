import { action, thunk, persist } from 'easy-peasy';
import { model } from 'utils/easy-peasy';
import {
  PersonalLatest,
  PersonalLatestPRs,
  PersonalLatestRuns,
  PersonalRanking,
  BattlesByDesigner,
  GiveRights,
  IPlogs,
  BanlistKuski,
  BanKuski,
  UserInfoByIdentifier,
  BattlesByPlayer,
  IntBestTimes,
  ShareTimeFile,
  MyFiles,
  DeleteFile,
} from 'api';

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
  ranking: false,
  setRanking: action((state, payload) => {
    state.ranking = payload;
  }),
  getRanking: thunk(async (actions, payload) => {
    const call = await PersonalRanking(payload);
    if (call.ok) {
      actions.setRanking(call.data);
    }
  }),
  intTotalTime: false,
  setIntTotalTime: action((state, payload) => {
    state.intTotalTime = payload;
  }),
  getIntTotalTime: thunk(async (actions, payload) => {
    // weird things happen when we do this and switch between first tab.
    // actions.setIntTotalTime(false);

    const response = await IntBestTimes(payload);

    if (response.ok) {
      actions.setIntTotalTime(response.data);
    }
  }),
  designedBattles: [],
  setDesignedBattes: action((state, payload) => {
    state.designedBattles = payload;
  }),
  getDesignedBattles: thunk(async (actions, payload) => {
    const call = await BattlesByDesigner(payload);
    if (call.ok) {
      actions.setDesignedBattes(call.data);
    }
  }),
  giveRights: thunk(async (actions, payload) => {
    const post = await GiveRights(payload);
    if (post.ok) {
      actions.getKuskiByName(payload.name);
    }
  }),
  iplogs: [],
  setIplogs: action((state, payload) => {
    state.iplogs = payload;
  }),
  getIplogs: thunk(async (actions, payload) => {
    const get = await IPlogs(payload);
    if (get.ok) {
      actions.setIplogs(get.data);
    }
  }),
  kuskiBans: { ips: [], flags: [] },
  setKuskiBans: action((state, payload) => {
    state.kuskiBans = payload;
  }),
  getKuskiBans: thunk(async (actions, payload) => {
    const get = await BanlistKuski(payload);
    if (get.ok) {
      actions.setKuskiBans(get.data);
    }
  }),
  banKuski: thunk(async (actions, payload) => {
    const post = await BanKuski(payload);
    if (post.ok) {
      actions.getKuskiBans(payload.KuskiIndex);
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
  kuskiLoading: true,
  setKuski: action((state, payload) => {
    state.kuski = payload;
  }),
  setKuskiLoading: action((state, payload) => {
    state.kuskiLoading = payload;
  }),
  getKuskiByName: thunk(async (actions, payload) => {
    actions.setKuskiLoading(true);
    const kuski = await UserInfoByIdentifier({
      IdentifierType: 'Kuski',
      KuskiIdentifier: payload,
    });
    if (kuski.ok) {
      actions.setKuski(kuski.data);
    }
    actions.setKuskiLoading(false);
  }),
  // times tab
  timesAndReplays: {
    ...model(PersonalLatest),
  },
  PRsAndReplays: {
    ...model(PersonalLatestPRs),
  },
  runsAndReplays: {
    ...model(PersonalLatestRuns),
  },
  shareTimeFile: thunk(async (actions, payload) => {
    const post = await ShareTimeFile(payload);
    if (post.ok) {
      actions.timesAndReplays.fetch({
        search: payload.search,
        limit: 100,
        KuskiIndex: payload.KuskiIndex,
      });
    }
    return post;
  }),
  search: {
    level: '',
    from: '',
    to: '',
  },
  setSearch: action((state, payload) => {
    state.search[payload.field] = payload.value;
  }),
  // files tab
  files: {
    ...model(MyFiles),
  },
  fileSearch: {
    filename: '',
    from: '',
    to: '',
  },
  setFileSearch: action((state, payload) => {
    state.fileSearch[payload.field] = payload.value;
  }),
  deleteFile: thunk(async (actions, payload) => {
    const post = await DeleteFile(payload);
    if (post.ok) {
      actions.files.fetch({ limit: payload.limit, search: payload.search });
    }
  }),
  settings: persist(
    {
      collapse: false,
    },
    { storage: 'localStorage' },
  ),
  setCollapse: action((state, payload) => {
    state.settings.collapse = payload;
  }),
};
