import { create } from 'apisauce';
import type { ApiResponse, Monitor, RequestTransform } from 'apisauce';
import config from 'config';
import { authToken, saveToken, checkSession } from 'utils/nick';
import { isObjectLike, isArray, mapValues, meanBy } from 'lodash';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type {
  QueryFunctionContext,
  QueryKey,
  UseQueryOptions,
} from '@tanstack/react-query';

// placeholder for endpoints that are not typed yet, replace with the
// #contract types as each endpoint gets typed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Untyped = any;

const baseURL = config.api;
const api = create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
  timeout: 10000,
});

const apiUpload = create({
  baseURL: config.url,
  headers: {
    Accept: '*/*',
    'Cache-Control': 'no-cache',
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000,
});

// read the token from the cookie on every request, so a token renewed in
// another tab is picked up and an expired one is never sent
const addAuthHeader: RequestTransform = request => {
  if (request.headers) {
    request.headers.Authorization = authToken();
  }
};

// the api sends a renewed token when the current one is due, swap it in so
// active users stay logged in. skipped if the user logged out meanwhile
// a 401 may mean the token expired while the tab was open, so check that
const handleAuthResponse: Monitor = response => {
  const token = response.headers?.['x-renewed-token'];
  if (token && authToken()) {
    saveToken(token);
  }
  if (response.status === 401) {
    checkSession();
  }
};

[api, apiUpload].forEach(instance => {
  instance.addRequestTransform(addAuthHeader);
  instance.addMonitor(handleAuthResponse);
});

// apisauce adapter
// ie. useQueryAlt( 'key', async () => api.get('replay_comment/23') );
// with useQuery, queryFn should resolve to its payload or throw an error.
// with useQueryAlt, it resolves to an apisauce response { ok, data }
export const useQueryAlt = <TQueryFnData, TData = TQueryFnData>(
  queryKey: QueryKey,
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<ApiResponse<TQueryFnData>>,
  queryOpts: Omit<
    UseQueryOptions<TQueryFnData, Error, TData>,
    'queryKey' | 'queryFn'
  > = {},
) =>
  useQuery({
    ...queryOpts,
    // I thought this should be added to defaultOptions (src/react-query.js),
    // but this didn't stop queries from re-fetching when using navigate.
    staleTime: queryOpts.staleTime ?? 300000,
    queryKey,
    queryFn: async context => {
      const res = await queryFn(context);

      if (!isObjectLike(res)) {
        throw new Error(
          'Expected an async queryFn that resolves to an object.',
        );
      }

      // react-query rejects undefined data anyway, so fail with a clearer error
      if (res.ok) {
        if (res.data === undefined) {
          throw new Error('Response has no data');
        }
        return res.data;
      }

      // eslint-disable-next-line no-console
      console.error('Status not OK', queryKey, res.data);
      throw new Error('Status not OK');
    },
  });

export { keepPreviousData };

// replays
export const ReplayComment = (replayIndex: Untyped) =>
  api.get(`replay_comment/${replayIndex}`);
export const AddReplayComment = (data: Untyped) =>
  api.post(`replay_comment/add`, data);
export const AllReplayComments = (limit: Untyped, offset: Untyped) =>
  api.get('replay_comment/', { limit, offset });
export const ReplayRating = (replayIndex: Untyped) =>
  api.get(`replay_rating/${replayIndex}`);
export const AddReplayRating = (data: Untyped) =>
  api.post(`replay_rating/add`, data);
export const ReplayDrivenBy = (kuskiIndex: Untyped, query = {}) =>
  api.get(`replay/driven_by/${kuskiIndex}`, query);
export const ReplayUploadedBy = (kuskiIndex: Untyped, query = {}) =>
  api.get(`replay/uploaded_by/${kuskiIndex}`, query);
export const ReplayByUUID = (UUID: Untyped, Fingerprint: Untyped) =>
  api.get(`replay/byUUID/${UUID}?f=${Fingerprint}`);
export const RandomReplay = () => api.get('replay/random');
export const ReplaysSearchByDriven = (data: Untyped) =>
  api.get(`replay/search/byDriven/${data.q}/${data.offset}`);
export const ReplaysSearchByLevel = (data: Untyped) =>
  api.get(`replay/search/byLevel/${data.q}/${data.offset}`);
export const ReplaysSearchByFilename = (data: Untyped) =>
  api.get(`replay/search/byFilename/${data.q}/${data.offset}`);
export const ReplaysByLevelIndex = (LevelIndex: Untyped) =>
  api.get(`replay/byLevelIndex/${LevelIndex}`);
export const InsertReplay = (data: Untyped) => api.post('replay', data);
export const UpdateReplay = (data: Untyped) => api.post('replay/update', data);
export const Replays = ({
  page,
  pageSize,
  tags,
  sortBy,
  order,
  levelPack,
  excludedTags,
}: Untyped) => {
  return api.get(`replay`, {
    page,
    pageSize,
    tags,
    sortBy,
    order,
    levelPack,
    excludedTags,
  });
};
export const AllMyReplays = ({
  page,
  pageSize,
  tags,
  sortBy,
  order,
}: Untyped) => {
  return api.get(`replay/my`, {
    page,
    pageSize,
    tags,
    sortBy,
    order,
  });
};
export const ShareTimeFile = (data: Untyped) => api.post('replay/share', data);
export const EditReplay = (data: Untyped) => api.post('replay/edit', data);

// country
export const Country = () => api.get('country');

// login
export const Register = (data: Untyped) => api.post('register', data);
export const Confirm = (data: Untyped) => api.post('register/confirm', data);
export const ResetPasswordConfirm = (data: Untyped) =>
  api.post('register/resetconfirm', data);
export const ResetPassword = (data: Untyped) =>
  api.post('register/reset', data);
export const DiscordAuthUrl = (data: Untyped) =>
  api.post('/register/discord', data);
export const DiscordCode = (data: Untyped) =>
  api.post('/register/discord/code', data);
export const DiscordRemove = () => api.post('/register/discord/remove', {});

// cups
export const Cups = () => api.get('cups');
export const CupsOngoing = () => api.get('cups/ongoing');
export const Cup = (shortName: Untyped) => api.get(`cups/${shortName}`);
export const CupEvents = (cupGroupIndex: Untyped) =>
  api.get(`cups/events/${cupGroupIndex}`);
export const CupEvent = (data: Untyped) =>
  api.get(`cups/event/${data.cupGroupIndex}/${data.cupIndex}`);
export const CupEventByTimeIndex = (index: Untyped) =>
  api.get(`cups/eventByTimeIndex/${index}`);
export const UpdateCup = (cupGroupIndex: Untyped, data: Untyped) =>
  api.post(`cups/edit/${cupGroupIndex}`, data);
export const UpdateCupBlog = (data: Untyped) => api.post(`cups/blog/add`, data);
export const AddCup = (data: Untyped) => api.post(`cups/add`, data);
export const AddEvent = (data: Untyped, cupGroupIndex: Untyped) =>
  api.post(`cups/${cupGroupIndex}/event/add`, data);
export const EditEvent = (data: Untyped) =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.CupIndex}/edit`,
    data.event,
  );
export const DeleteEvent = (data: Untyped) =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.event.CupIndex}/delete`,
    data.event,
  );
export const GenerateEvent = (data: Untyped) =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.event.CupIndex}/generate`,
    data.event,
  );
export const SubmitInterview = (data: Untyped) =>
  api.post(`cups/${data.CupGroupIndex}/event/${data.CupIndex}/interview`, data);
export const MyReplays = (CupGroupIndex: Untyped) =>
  api.get(`cups/${CupGroupIndex}/myreplays`);
export const UpdateCupReplay = (data: Untyped) =>
  api.post(`cups/${data.CupGroupIndex}/updatereplay`, data);
export const TeamReplays = (CupGroupIndex: Untyped) =>
  api.get(`cups/${CupGroupIndex}/teamreplays`);
export const CupReplay = (CupTimeIndex: Untyped) =>
  api.get(`cups/time/${CupTimeIndex}`);

// kuski map
export const KuskiMap = () => api.get('kuskimap');
export const AddKuskiMap = (data: Untyped) => api.post('kuskimap/add', data);

// allfinished
export const Highlight = () => api.get('allfinished/highlight');
export const PersonalAllFinished = (data: Untyped) =>
  api.get(`allfinished/${data.LevelIndex}/${data.KuskiIndex}/${data.limit}`);
export const PersonalAppleRuns = (data: Untyped) =>
  api.get(`allfinished/appleruns/${data.LevelIndex}/${data.limit}`);

export const PersonalLatest = (data: Untyped) =>
  api.get(
    `allfinished/${data.KuskiIndex}/${data.limit}?level=${data.search.level}&from=${data.search.from}&to=${data.search.to}`,
  );
export const PersonalLatestRuns = (data: Untyped) =>
  api.get(
    `allfinished/runs/${data.KuskiIndex}/${data.limit}?level=${data.search.level}&from=${data.search.from}&to=${data.search.to}`,
  );
export const LeaderHistory = (data: Untyped) => {
  const { from = '', to = '', KuskiIndex = '', BattleIndex = '' } = data;
  return api.get(
    `allfinished/leaderhistory/${data.LevelIndex}?from=${from}&to=${to}&KuskiIndex=${KuskiIndex}&BattleIndex=${BattleIndex}`,
  );
};
export const AllFinishedLevel = (LevelIndex: Untyped) =>
  api.get(`allfinished/${LevelIndex}`);

// crippled
export const CrippledTimes = (
  LevelIndex: Untyped,
  cripple: Untyped,
  limit: Untyped,
  all: Untyped,
  limitAll: Untyped,
) =>
  api.get(
    `crippled/bestTimes/${LevelIndex}/${cripple}/${limit}?all=${
      all ? 1 : 0
    }&limitAll=${limitAll}`,
  );
export const CrippledPersonal = (
  LevelIndex: Untyped,
  KuskiIndex = 0,
  cripple: Untyped,
  limit: Untyped,
) =>
  api.get(`crippled/personal/${LevelIndex}/${KuskiIndex}/${cripple}/${limit}`);

export const CrippledTimeStats = (
  LevelIndex: Untyped,
  KuskiIndex = 0,
  cripple: Untyped,
) => api.get(`crippled/timeStats/${LevelIndex}/${KuskiIndex}/${cripple}`);

export const CrippledLevelPackRecords = (
  LevelPackName: Untyped,
  cripple: Untyped,
) => api.get(`crippled/levelPackRecords/${LevelPackName}/${cripple}`);

export const CrippledLevelPackPersonalRecords = (
  LevelPackName: Untyped,
  KuskiIndex: Untyped,
) =>
  api.get(`crippled/levelPackPersonalRecords/${LevelPackName}/${KuskiIndex}`);

// levelpack
export const LevelPacks = () => api.get('levelpack');
export const LevelPacksStats = () => api.get('levelpack/stats');

// add some derived values.
// perhaps we could just do this on server.
const mapLevelPackLevelStats = (levelStats: Untyped) => {
  const arr = Object.values(levelStats);

  const avgTimeAll = meanBy(arr, 'TimeAll');
  const avgKuskiCountAll = meanBy(arr, 'KuskiCountAll');

  return mapValues(levelStats, s => {
    return {
      ...s,
      RelativeTimeAll: avgTimeAll > 0 ? s.TimeAll / avgTimeAll : 0,
      RelativeKuskiCountAll:
        avgKuskiCountAll > 0 ? s.KuskiCountAll / avgKuskiCountAll : 0,
    };
  });
};

export const LevelPackLevelStats = async (
  byName: Untyped,
  NameOrIndex: Untyped,
) => {
  const ret = await api.get<Untyped>(
    `levelpack/level-stats/${byName ? 1 : 0}/${NameOrIndex}`,
  );

  if (ret.ok) {
    // endpoint returning data in unintentional format.
    // Could fix api and remove this later.
    ret.data = mapValues(ret.data, arrayOfObjects => {
      if (isArray(arrayOfObjects)) {
        return arrayOfObjects[0] || {};
      }
      return arrayOfObjects;
    });

    ret.data = mapLevelPackLevelStats(ret.data);
  }

  return ret;
};
export const LevelPack = (LevelPackName: Untyped, levels = 0) =>
  api.get(`levelpack/${LevelPackName}`, {
    levels: levels ? '1' : undefined,
  });
export const LevelCollectionStats = (type: Untyped, value: Untyped) => {
  if (type === 'ids') {
    value = (value || []).join(',');
  }
  return api.get(`levelstats/collection/${type}/${value}`);
};

export const TotalTimes = (data: Untyped) =>
  api.get(`levelpack/${data.levelPackIndex}/totaltimes/${data.eolOnly}`);
export const PersonalTimes = (data: Untyped) =>
  api.get(
    `levelpack/${data.name}/personal/${data.PersonalKuskiIndex}/${data.eolOnly}`,
  );
export const PersonalWithMulti = (data: Untyped) =>
  api.get(
    `levelpack/${data.name}/personalwithmulti/${data.PersonalKuskiIndex}/${data.eolOnly}`,
  );
export const HistoricTT = (data: Untyped) =>
  api.get(`levelpack/${data.LevelPackName}/historic/${data.KuskiIndex}`);
export const LevelPackStats = (data: Untyped) =>
  api.get(`levelpack/${data.name}/stats/${data.eolOnly}`, undefined, {
    timeout: 60000,
  });
export const LevelPackStatsFilter = (data: Untyped) =>
  api.get(
    `levelpack/${data.name}/stats/${data.eolOnly}/${data.filter}/${data.filterValue}`,
    undefined,
    {
      timeout: 60000,
    },
  );
export const LevelPackRecords = (data: Untyped) =>
  api.get(`levelpack/${data.name}/records/${data.eolOnly ? 1 : 0}`);
export const LevelPackRecordsFilter = (data: Untyped) =>
  api.get(
    `levelpack/${data.name}/records/${data.eolOnly ? 1 : 0}/${data.filter}/${
      data.filterValue
    }`,
  );
export const MultiRecords = (LevelPackName: Untyped) =>
  api.get(`levelpack/${LevelPackName}/multirecords`);
export const LevelPackSearch = (q: Untyped) => api.get(`levelpack/search/${q}`);
export const LevelsSearch = (data: Untyped) =>
  api.get(`levelpack/searchLevel/${data.q}/${data.offset}/${data.showLocked}`);
export const LevelsSearchAll = (data: Untyped) =>
  api.get(`levelpack/searchLevel/${data.q}/${data.ShowLocked}`);
export const AddLevelPack = (data: Untyped) => api.post('levelpack/add', data);
export const UpdateLevelPack = (index: Untyped, data: Untyped) =>
  api.post(`levelpack/update/${index}`, data);
export const LevelPackUpdateLevel = (data: Untyped) =>
  api.post('levelpack/admin/updateLevel', data);
export const LevelPackDeleteLevel = (data: Untyped) =>
  api.post('levelpack/admin/deleteLevel', data);
export const LevelPackAddLevel = (data: Untyped) =>
  api.post('levelpack/admin/addLevel', data);
export const LevelPackSortLevel = (data: Untyped) =>
  api.post('levelpack/admin/sortLevel', data);
export const LevelPackSort = (data: Untyped) =>
  api.post('levelpack/admin/sort', data);
export const LevelPackFavAdd = (data: Untyped) =>
  api.post('levelpack/favourite/add', data);
export const LevelPackFavRemove = (data: Untyped) =>
  api.post('levelpack/favourite/remove', data);
export const LevelPackFavs = () => api.get('levelpack/favourite');
export const IntBestTimes = (kuskiIndex: Untyped) => {
  return api.get(`levelpack/internals/besttimes/${kuskiIndex}`);
};
export const LevelPackStatsKuski = (KuskiIndex: Untyped) =>
  api.get(`levelpackstats/kuski/${KuskiIndex}`);
export const LevelPacksByLevel = (LevelIndex: Untyped) =>
  api.get(`levelpack/byLevel/${+LevelIndex}`);
export const CupsByLevel = (LevelIndex: Untyped) =>
  api.get(`cups/byLevel/${+LevelIndex}`);
export const LatestLevelPacks = (limit: Untyped) =>
  api.get(`levelpack/latest/${limit}`);

export const LevelPackRecordHistory = (name: Untyped, opts: Untyped) =>
  api.get(`levelpack/record-history/${name}`, {
    limit: opts.limit,
    offset: opts.offset,
    sort: opts.sort || 'desc',
  });

// collections
export const AddCollection = (data: Untyped) =>
  api.post('levelpack/collections/add', data);
export const Collections = () => api.get('levelpack/collections');
export const Collection = (name: Untyped) =>
  api.get(`levelpack/collections/${name}`);
export const SearchPack = (search: Untyped) =>
  api.get(`levelpack/collections/search/${search}`);
export const AddPack = (data: Untyped) =>
  api.post('levelpack/collections/addpack', data);
export const DeletePack = (data: Untyped) =>
  api.post('levelpack/collections/deletepack', data);

// besttime
export const Besttime = (data: Untyped) =>
  api.get(`besttime/${data.levelId}/${data.limit}/${data.eolOnly}`);
export const BesttimeFilter = (data: Untyped) =>
  api.get(
    `besttime/${data.levelId}/${data.limit}/${data.eolOnly}/${data.filter}/${data.filterValue}`,
  );
export const PersonalLatestPRs = (data: Untyped) =>
  api.get(
    `besttime/latest/${data.KuskiIndex}/${data.limit}?level=${data.search.level}&from=${data.search.from}&to=${data.search.to}`,
  );
export const MultiBesttime = (data: Untyped) =>
  api.get(`besttime/multi/${data.levelId}/${data.limit}`);

export const RecentBestRecords = (
  daysPast: Untyped,
  limit: Untyped,
  repeatLevels = 1,
  opts = {},
) =>
  api.get(`besttime/best-records/0/0/${limit || 0}/${repeatLevels ? 1 : 0}`, {
    ...opts,
    daysPast,
  });

// battles
export const BattlesSearchByFilename = (data: Untyped) =>
  api.get(`battle/search/byFilename/${data.q}/${data.offset}`);
export const BattlesSearchByDesigner = (data: Untyped) =>
  api.get(`battle/search/byDesigner/${data.q}/${data.offset}`);
export const BattlesSearch = (data: Untyped) =>
  api.get(`battle/search/generic`, data);
export const BattlesByLevel = (LevelIndex: Untyped) =>
  api.get(`battle/byLevel/${LevelIndex}`);
export const BattleResults = (BattleIndex: Untyped) =>
  api.get(`battle/byBattleIndex/${BattleIndex}`);
export const BattleList = (IndexList: Untyped) =>
  api.get(`battle/byBattleIndexList/${IndexList}`); // array of battle indices
export const GetAllBattleTimes = (query: Untyped) =>
  api.get(`battle/allBattleTimes/${query}`);
export const BattlesByDesigner = (data: Untyped) =>
  api.get(
    `battle/byDesigner/${data.KuskiIndex}?page=${data.page}&pageSize=${data.pageSize}`,
  );
export const BattlesByPlayer = (data: Untyped) =>
  api.get(
    `battle/byPlayer/${data.KuskiIndex}?page=${data.page}&pageSize=${data.pageSize}`,
  );
export const AllBattleRuns = (BattleIndex: Untyped) =>
  api.get(`battle/allRuns/${BattleIndex}`);
export const BattleListPeriod = (data: Untyped) =>
  api.get(`battle/byPeriod/${data.start}/${data.end}/${data.limit}`);
export const BattleReplays = (BattleIndex: Untyped) =>
  api.get(`battle/replays/${BattleIndex}`);
export const LatestBattles = (limit: Untyped) => api.get(`battle/${limit}`);
export const LatestBattleReplays = (limit: Untyped) =>
  api.get(`battle/replays?limit=${limit}`);

// players
export const PlayersSearch = (data: Untyped) =>
  api.get(`player/search/${data.q}/${data.offset}`);
export const TeamsSearch = (data: Untyped) =>
  api.get(`player/searchTeam/${data.q}/${data.offset}`);
export const UserInfo = (KuskiIndex: Untyped) =>
  api.get(`player/${KuskiIndex}`);
export const UserInfoByIdentifier = (data: Untyped) =>
  api.get(`player/${data.IdentifierType}/${data.KuskiIdentifier}`);
export const UpdateUserInfo = (data: Untyped) =>
  api.post(`register/update`, data);
export const Ignore = (Kuski: Untyped) =>
  api.post(`player/ignore/${Kuski}`, {});
export const Ignored = () => api.get('player/ignored');
export const Unignore = (KuskiIndex: Untyped) =>
  api.post(`player/unignore/${KuskiIndex}`, {});
export const Players = () => api.get('player/');
export const GetCrew = () => api.get('player/crew/');
export const NotificationSettings = () => api.get('player/settings');
export const ChangeSettings = (data: Untyped) =>
  api.post('player/settings', data);
export const PlayerRecordCount = (KuskiIndex: Untyped) =>
  api.get(`player/record-count/${KuskiIndex}`);
export const PlayerRecords = (KuskiIndex: Untyped, opts: Untyped) =>
  api.get(`player/records/${KuskiIndex}`, opts);

// teams
export const Teams = () => api.get('teams');
export const TeamMembers = (Team: Untyped) => api.get(`teams/${Team}`);

// chat
export const SearchChat = (data: Untyped) =>
  api.get('chatlog', { params: JSON.stringify(data) });

// lgr
export const LGR = (LGRName: Untyped) => api.get(`lgr/info/${LGRName}`);
export const LGRs = () => api.get(`lgr/info`);
export const NewLGR = (formData: Untyped) =>
  apiUpload.post('api/lgr/add', formData);
export const EditLGR = (LGRName: Untyped, formData: Untyped) =>
  apiUpload.post(`api/lgr/info/${LGRName}`, formData);
export const DeleteLGR = (LGRName: Untyped) => api.delete(`lgr/del/${LGRName}`);
export const LGRComments = (LGRIndex: Untyped) =>
  api.get(`lgr_comment/get/${LGRIndex}`);
export const NewLGRComment = (data: Untyped) =>
  api.post(`lgr_comment/add`, data);

// level
export const Level = (LevelIndex: Untyped, withLevelStats = false) =>
  api.get(`level/${LevelIndex}`, { stats: withLevelStats ? '1' : '' });
export const LevelData = (LevelIndex: Untyped) =>
  api.get(`level/leveldata/${LevelIndex}`);
export const LevelTimeStats = ({ LevelIndex, from, to }: Untyped) =>
  api.get(`level/timestats/${LevelIndex}`, { from, to });
export const UpdateLevel = (data: Untyped) =>
  api.post(`level/${data.LevelIndex}`, data.update);
export const UpdateLevelTags = (data: Untyped) =>
  api.post(`level/${data.LevelIndex}/tags`, data.tags);
export const Levels = ({
  page,
  pageSize,
  tags,
  sortBy,
  order,
  levelPack,
  excludedTags,
  addedBy,
  finished,
  battled,
  finishedBy,
  q,
}: Untyped) => {
  return api.get(`level`, {
    page,
    pageSize,
    tags,
    sortBy,
    order,
    levelPack,
    excludedTags,
    addedBy,
    finished,
    battled,
    finishedBy,
    q,
  });
};
export const GetLevelKuskis = () => api.get(`level/kuskis`);

// ranking
export const PersonalRanking = (KuskiIndex: Untyped) =>
  api.get(`ranking/kuski/${KuskiIndex}`);
export const Ranking = (data: Untyped) =>
  api.get(`ranking/${data.periodType}/${data.period}`);
export const RankingHistoryByBattle = (BattleIndex: Untyped) =>
  api.get(`ranking/battle/${BattleIndex}`);

// mod
export const NickRequests = () => api.get(`mod/nickrequests`);
export const NickAccept = (data: Untyped) =>
  api.post(`mod/nickrequests/accept/${data.SiteSettingIndex}`, {});
export const NickDecline = (data: Untyped) =>
  api.post(`mod/nickrequests/decline/${data.SiteSettingIndex}`, {});
export const Banlist = () => api.get('mod/banlist');
export const BanlistKuski = (KuskiIndex: Untyped) =>
  api.get(`mod/banlist/${KuskiIndex}`);
export const BanKuski = (data: Untyped) => api.post('mod/bankuski', data);
export const ErrorLog = (data: Untyped) =>
  api.get(`mod/errorlog/${data.Kuski}/${data.ErrorTime}`);
export const ActionLog = (data: Untyped) =>
  api.get(`mod/actionlog/${data.Kuski}/${data.ErrorTime}`);
export const GiveRights = (data: Untyped) => api.post('mod/giverights', data);
export const IPlogs = (KuskiIndex: Untyped) =>
  api.get(`mod/iplogs/${KuskiIndex}`);

// news
export const News = (amount: Untyped) => api.get(`news/${amount}`);
export const AddNews = (data: Untyped) => api.post('news', data);

// donations
export const GetDonations = () => api.get(`donate/`);

// upload
export const UploadFile = (data: Untyped) =>
  apiUpload.post(`upload/file`, data);
export const UpdateFile = (data: Untyped) => api.post(`upload`, data);
export const MyFiles = (data: Untyped) =>
  api.get(
    `upload/${data.limit}?filename=${data.search.filename}&from=${data.search.from}&to=${data.search.to}`,
  );
export const DeleteFile = (data: Untyped) =>
  api.delete(`upload/${data.index}/${data.uuid}/${data.filename}`);

// taswr
export const GetDatInfo = (data: Untyped) =>
  apiUpload.post(`api/taswr/getdatinfo`, data);

// tags
export const GetReplayTags = () => api.get(`tag?type=replay`);
export const GetLevelTags = () => api.get(`tag?type=level`);
export const GetLevelPackTags = () => api.get(`tag?type=levelpack`);
export const GetLGRTags = () => api.get(`tag?type=lgr`);
export const GetTags = () => api.get(`tag`);
export const CreateTag = (data: Untyped) => api.post(`tag`, data);
export const UpdateTag = (TagIndex: Untyped, data: Untyped) =>
  api.put(`tag/${TagIndex}`, data);
export const DeleteTag = (TagIndex: Untyped) => api.delete(`tag/${TagIndex}`);

// notifications
export const GetNotifications = () => api.get(`notification`);
export const GetNotificationsCount = () => api.get(`notification/count`);
export const MarkNotificationsSeen = () =>
  api.post(`notification/markSeen`, {});

// status
export const SystemStatus = () => api.get('news/status');

// battle league
export const BattleLeagues = () => api.get('battleleague');
export const AddBattleLeague = (data: Untyped) =>
  api.post('battleleague/add', data);
export const BattleLeague = (shortName: Untyped) =>
  api.get(`battleleague/${shortName}`);
export const AddBattleLeagueBattle = (data: Untyped) =>
  api.post('battleleague/add/battle', data);
export const UpdateBattleLeagueBattle = (data: Untyped) =>
  api.post('battleleague/update/battle', data);
export const UpdateBattleLeagueWhitelist = (data: Untyped) =>
  api.post('battleleague/update/whitelist', data);
export const UpdateBattleLeagueResultOverride = (data: Untyped) =>
  api.post('battleleague/update/override', data);
export const UpdateBattleLeagueBreak = (data: Untyped) =>
  api.post('battleleague/update/break', data);
export const DeleteBattleLeagueBattle = (id: Untyped) =>
  api.delete(`battleleague/delete/battle/${id}`);

// recap
export const RecapOverall = (year: Untyped) => api.get(`recap/${year}`);
export const RecapPlayer = ({ user, year }: Untyped) =>
  api.get(`recap/${year}/${user}`);
export const RecapBestof = (year: Untyped) => api.get(`recap/bestof/${year}`);
export const RecalPlayerAll = (user: Untyped) =>
  api.get(`recap/alltime/${user}`);
export const RecapOverAllAll = () => api.get(`recap/alltime`);
