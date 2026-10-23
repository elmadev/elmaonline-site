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
import type { ApiError, Id, ListQuery, PathParams } from 'contract/endpoint.ts';
import type { CountryEndpoints } from 'contract/country.ts';
import type {
  EditReplayBody,
  InsertReplayBody,
  ReplayEndpoints,
  ReplayListQuery,
  ShareReplayBody,
} from 'contract/replay.ts';

// loose param types for endpoints that aren't in the contract yet
type Flag = boolean | number;
type Payload = object;
type DateSearch = {
  search: { level: string; from: string; to: string };
};
type Search = { q: string; offset: Id };
type Filter = { filter: string; filterValue: Id };

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

// The endpoints in the contract. Each area is imported from its own file.
// A call is typed by its key: the params come from the path, and the query,
// body and response from the endpoint, ie.
//   get('GET /replay/byUUID/:UUID', { params: { UUID }, query: { f } })
type Endpoints = CountryEndpoints & ReplayEndpoints;
type EndpointKey = keyof Endpoints & string;
type KeyOf<Method extends string> = Extract<EndpointKey, `${Method} ${string}`>;
type PathOf<Key extends string> = Key extends `${string} ${infer Path}`
  ? Path
  : never;
type ParamsArg<Key extends EndpointKey> = keyof PathParams<
  PathOf<Key>
> extends never
  ? unknown
  : { params: PathParams<PathOf<Key>> };
type QueryArg<Key extends EndpointKey> = Endpoints[Key] extends {
  query: infer Query;
}
  ? Record<never, never> extends Query
    ? { query?: Query }
    : { query: Query }
  : unknown;
type Args<Key extends EndpointKey> = ParamsArg<Key> & QueryArg<Key>;
// the args are optional when nothing in them is required
type ArgsTuple<Key extends EndpointKey> =
  Record<never, never> extends Args<Key>
    ? [args?: Args<Key>]
    : [args: Args<Key>];
type BodyOf<Key extends EndpointKey> = Endpoints[Key] extends {
  body: infer Body;
}
  ? Body
  : never;

const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

// 'GET /replay/byUUID/:UUID' and { UUID: 'abc' } give 'replay/byUUID/abc'
const urlOf = (key: string, params: unknown) =>
  key
    .slice(key.indexOf(' ') + 2)
    .replace(/:(\w+)/g, (_, name: string) =>
      isObject(params)
        ? encodeURIComponent(String(Reflect.get(params, name)))
        : '',
    );

const get = <Key extends KeyOf<'GET'>>(key: Key, ...[args]: ArgsTuple<Key>) => {
  const params = isObject(args) && 'params' in args ? args.params : undefined;
  const query =
    isObject(args) && 'query' in args && isObject(args.query)
      ? args.query
      : undefined;
  return api.get<Endpoints[Key]['res'], ApiError>(urlOf(key, params), query);
};

// none of the post endpoints have route params yet
const post = <Key extends KeyOf<'POST'>>(key: Key, body: BodyOf<Key>) =>
  api.post<Endpoints[Key]['res'], ApiError>(urlOf(key, undefined), body);

// apisauce adapter
// ie. useQueryAlt( 'key', async () => api.get('replay_comment/23') );
// with useQuery, queryFn should resolve to its payload or throw an error.
// with useQueryAlt, it can resolve to object like { ok: success, data: payload },
// (ie. like apisauce functions) or an array like [ success, payload ]
// (if 4th parameter is true).
export const useQueryAlt = <T>(
  queryKey: QueryKey,
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<ApiResponse<T, unknown> | [boolean, T]>,
  queryOpts: Omit<UseQueryOptions<T | undefined>, 'queryKey' | 'queryFn'> = {},
  arrayFormat = false,
) => {
  // I thought this should be added to defaultOptions (src/react-query.js),
  // but this didn't stop queries from re-fetching when using navigate.
  if (queryOpts.staleTime === undefined) {
    queryOpts.staleTime = 300000;
  }

  return useQuery({
    queryKey,
    queryFn: async context => {
      const res = await queryFn(context);

      if (arrayFormat) {
        if (!(isArray(res) && res.length === 2)) {
          throw new Error(
            'Expected an async queryFn that resolves to an array of length 2.',
          );
        }

        if (res[0]) {
          return res[1];
        }

        // eslint-disable-next-line no-console
        console.error('Status not OK', queryKey, res[1]);
        throw new Error('Status not OK');
      } else {
        if (isArray(res) || !isObjectLike(res)) {
          throw new Error(
            'Expected an async queryFn that resolves to an object.',
          );
        }

        if (res.ok) {
          return res.data;
        }

        // eslint-disable-next-line no-console
        console.error('Status not OK', queryKey, res.data);
        throw new Error('Status not OK');
      }
    },
    ...queryOpts,
  });
};

export { keepPreviousData };

// replays
export const ReplayComment = (replayIndex: Id) =>
  api.get(`replay_comment/${replayIndex}`);
export const AddReplayComment = (data: Payload) =>
  api.post(`replay_comment/add`, data);
export const AllReplayComments = (limit: number, offset: number) =>
  api.get('replay_comment/', { limit, offset });
export const ReplayRating = (replayIndex: Id) =>
  api.get(`replay_rating/${replayIndex}`);
export const AddReplayRating = (data: Payload) =>
  api.post(`replay_rating/add`, data);
export const ReplayDrivenBy = (KuskiIndex: Id, query: ReplayListQuery) =>
  get('GET /replay/driven_by/:KuskiIndex', { params: { KuskiIndex }, query });
export const ReplayUploadedBy = (KuskiIndex: Id, query: ReplayListQuery) =>
  get('GET /replay/uploaded_by/:KuskiIndex', {
    params: { KuskiIndex },
    query,
  });
export const ReplayByUUID = (UUID: string, f?: string) =>
  get('GET /replay/byUUID/:UUID', { params: { UUID }, query: { f } });
export const RandomReplay = () => get('GET /replay/random');
export const ReplaysSearchByDriven = ({ q, offset }: Search) =>
  get('GET /replay/search/byDriven/:query/:offset', {
    params: { query: q, offset },
  });
export const ReplaysSearchByLevel = ({ q, offset }: Search) =>
  get('GET /replay/search/byLevel/:query/:offset', {
    params: { query: q, offset },
  });
export const ReplaysSearchByFilename = ({ q, offset }: Search) =>
  get('GET /replay/search/byFilename/:query/:offset', {
    params: { query: q, offset },
  });
export const ReplaysByLevelIndex = (LevelIndex: Id) =>
  get('GET /replay/byLevelIndex/:LevelIndex', { params: { LevelIndex } });
export const InsertReplay = (data: InsertReplayBody) =>
  post('POST /replay', data);
export const UpdateReplay = (data: { ReplayIndex: number }) =>
  post('POST /replay/update', data);
export const Replays = ({
  page,
  pageSize,
  tags,
  sortBy,
  order,
  levelPack,
  excludedTags,
}: ListQuery) =>
  get('GET /replay', {
    query: { page, pageSize, tags, sortBy, order, levelPack, excludedTags },
  });
export const AllMyReplays = ({
  page,
  pageSize,
  tags,
  sortBy,
  order,
}: ListQuery) =>
  get('GET /replay/my', {
    query: { page, pageSize, tags, sortBy, order },
  });
export const ShareTimeFile = (data: ShareReplayBody) =>
  post('POST /replay/share', data);
export const EditReplay = (data: EditReplayBody) =>
  post('POST /replay/edit', data);

// country
export const Country = () => get('GET /country');

// login
export const Register = (data: Payload) => api.post('register', data);
export const Confirm = (data: Payload) => api.post('register/confirm', data);
export const ResetPasswordConfirm = (data: Payload) =>
  api.post('register/resetconfirm', data);
export const ResetPassword = (data: Payload) =>
  api.post('register/reset', data);
export const DiscordAuthUrl = (data: Payload) =>
  api.post('/register/discord', data);
export const DiscordCode = (data: Payload) =>
  api.post('/register/discord/code', data);
export const DiscordRemove = () => api.post('/register/discord/remove', {});

// cups
type CupEventEdit = {
  CupGroupIndex: Id;
  CupIndex?: Id;
  event: { CupIndex: Id };
};

export const Cups = () => api.get('cups');
export const CupsOngoing = () => api.get('cups/ongoing');
export const Cup = (shortName: string) => api.get(`cups/${shortName}`);
export const CupEvents = (cupGroupIndex: Id) =>
  api.get(`cups/events/${cupGroupIndex}`);
export const CupEvent = (data: { cupGroupIndex: Id; cupIndex: Id }) =>
  api.get(`cups/event/${data.cupGroupIndex}/${data.cupIndex}`);
export const CupEventByTimeIndex = (index: Id) =>
  api.get(`cups/eventByTimeIndex/${index}`);
export const UpdateCup = (cupGroupIndex: Id, data: Payload) =>
  api.post(`cups/edit/${cupGroupIndex}`, data);
export const UpdateCupBlog = (data: Payload) => api.post(`cups/blog/add`, data);
export const AddCup = (data: Payload) => api.post(`cups/add`, data);
export const AddEvent = (data: Payload, cupGroupIndex: Id) =>
  api.post(`cups/${cupGroupIndex}/event/add`, data);
export const EditEvent = (data: CupEventEdit) =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.CupIndex}/edit`,
    data.event,
  );
export const DeleteEvent = (data: CupEventEdit) =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.event.CupIndex}/delete`,
    data.event,
  );
export const GenerateEvent = (data: CupEventEdit) =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.event.CupIndex}/generate`,
    data.event,
  );
export const SubmitInterview = (data: { CupGroupIndex: Id; CupIndex: Id }) =>
  api.post(`cups/${data.CupGroupIndex}/event/${data.CupIndex}/interview`, data);
export const MyReplays = (CupGroupIndex: Id) =>
  api.get(`cups/${CupGroupIndex}/myreplays`);
export const UpdateCupReplay = (data: { CupGroupIndex: Id }) =>
  api.post(`cups/${data.CupGroupIndex}/updatereplay`, data);
export const TeamReplays = (CupGroupIndex: Id) =>
  api.get(`cups/${CupGroupIndex}/teamreplays`);
export const CupReplay = (CupTimeIndex: Id) =>
  api.get(`cups/time/${CupTimeIndex}`);

// kuski map
export const KuskiMap = () => api.get('kuskimap');
export const AddKuskiMap = (data: Payload) => api.post('kuskimap/add', data);

// allfinished
export const Highlight = () => api.get('allfinished/highlight');
export const PersonalAllFinished = (data: {
  LevelIndex: Id;
  KuskiIndex: Id;
  limit: Id;
}) =>
  api.get(`allfinished/${data.LevelIndex}/${data.KuskiIndex}/${data.limit}`);
export const PersonalAppleRuns = (data: { LevelIndex: Id; limit: Id }) =>
  api.get(`allfinished/appleruns/${data.LevelIndex}/${data.limit}`);

export const PersonalLatest = (
  data: { KuskiIndex: Id; limit: Id } & DateSearch,
) =>
  api.get(
    `allfinished/${data.KuskiIndex}/${data.limit}?level=${data.search.level}&from=${data.search.from}&to=${data.search.to}`,
  );
export const PersonalLatestRuns = (
  data: { KuskiIndex: Id; limit: Id } & DateSearch,
) =>
  api.get(
    `allfinished/runs/${data.KuskiIndex}/${data.limit}?level=${data.search.level}&from=${data.search.from}&to=${data.search.to}`,
  );
export const LeaderHistory = (data: {
  LevelIndex: Id;
  from?: Id;
  to?: Id;
  KuskiIndex?: Id;
  BattleIndex?: Id;
}) => {
  const { from = '', to = '', KuskiIndex = '', BattleIndex = '' } = data;
  return api.get(
    `allfinished/leaderhistory/${data.LevelIndex}?from=${from}&to=${to}&KuskiIndex=${KuskiIndex}&BattleIndex=${BattleIndex}`,
  );
};
export const AllFinishedLevel = (LevelIndex: Id) =>
  api.get(`allfinished/${LevelIndex}`);

// crippled
export const CrippledTimes = (
  LevelIndex: Id,
  cripple: string,
  limit: Id,
  all: Flag,
  limitAll: Id,
) =>
  api.get(
    `crippled/bestTimes/${LevelIndex}/${cripple}/${limit}?all=${
      all ? 1 : 0
    }&limitAll=${limitAll}`,
  );
export const CrippledPersonal = (
  LevelIndex: Id,
  KuskiIndex: Id = 0,
  cripple: string,
  limit: Id,
) =>
  api.get(`crippled/personal/${LevelIndex}/${KuskiIndex}/${cripple}/${limit}`);

export const CrippledTimeStats = (
  LevelIndex: Id,
  KuskiIndex: Id = 0,
  cripple: string,
) => api.get(`crippled/timeStats/${LevelIndex}/${KuskiIndex}/${cripple}`);

export const CrippledLevelPackRecords = (
  LevelPackName: string,
  cripple: string,
) => api.get(`crippled/levelPackRecords/${LevelPackName}/${cripple}`);

export const CrippledLevelPackPersonalRecords = (
  LevelPackName: string,
  KuskiIndex: Id,
) =>
  api.get(`crippled/levelPackPersonalRecords/${LevelPackName}/${KuskiIndex}`);

// levelpack
// a level's stats, or {} for a level without any
type LevelStats = { TimeAll?: number; KuskiCountAll?: number };
type LevelPackQuery = { name: string; eolOnly: Flag };

export const LevelPacks = () => api.get('levelpack');
export const LevelPacksStats = () => api.get('levelpack/stats');

// add some derived values.
// perhaps we could just do this on server.
const mapLevelPackLevelStats = (levelStats: Record<string, LevelStats>) => {
  const arr = Object.values(levelStats);

  const avgTimeAll = meanBy(arr, 'TimeAll');
  const avgKuskiCountAll = meanBy(arr, 'KuskiCountAll');

  return mapValues(levelStats, s => {
    return {
      ...s,
      RelativeTimeAll:
        avgTimeAll > 0 && s.TimeAll !== undefined ? s.TimeAll / avgTimeAll : 0,
      RelativeKuskiCountAll:
        avgKuskiCountAll > 0 && s.KuskiCountAll !== undefined
          ? s.KuskiCountAll / avgKuskiCountAll
          : 0,
    };
  });
};

export const LevelPackLevelStats = async (byName: Flag, NameOrIndex: Id) => {
  const ret = await api.get<Record<string, LevelStats | LevelStats[]>>(
    `levelpack/level-stats/${byName ? 1 : 0}/${NameOrIndex}`,
  );

  if (ret.ok) {
    // endpoint returning data in unintentional format.
    // Could fix api and remove this later.
    const levelStats = mapValues(ret.data, arrayOfObjects => {
      if (isArray(arrayOfObjects)) {
        return arrayOfObjects[0] || {};
      }
      return arrayOfObjects;
    });

    ret.data = mapLevelPackLevelStats(levelStats);
  }

  return ret;
};
export const LevelPack = (LevelPackName: string, levels: Flag = 0) =>
  api.get(`levelpack/${LevelPackName}`, {
    levels: levels ? '1' : undefined,
  });
export const LevelCollectionStats = (
  type: string,
  value: Id[] | string | null,
) => {
  const values =
    type === 'ids' && typeof value !== 'string'
      ? (value || []).join(',')
      : value;
  return api.get(`levelstats/collection/${type}/${values}`);
};

export const TotalTimes = (data: { levelPackIndex: Id; eolOnly: Flag }) =>
  api.get(`levelpack/${data.levelPackIndex}/totaltimes/${data.eolOnly}`);
export const PersonalTimes = (
  data: LevelPackQuery & { PersonalKuskiIndex: Id },
) =>
  api.get(
    `levelpack/${data.name}/personal/${data.PersonalKuskiIndex}/${data.eolOnly}`,
  );
export const PersonalWithMulti = (
  data: LevelPackQuery & { PersonalKuskiIndex: Id },
) =>
  api.get(
    `levelpack/${data.name}/personalwithmulti/${data.PersonalKuskiIndex}/${data.eolOnly}`,
  );
export const HistoricTT = (data: { LevelPackName: string; KuskiIndex: Id }) =>
  api.get(`levelpack/${data.LevelPackName}/historic/${data.KuskiIndex}`);
export const LevelPackStats = (data: LevelPackQuery) =>
  api.get(`levelpack/${data.name}/stats/${data.eolOnly}`, undefined, {
    timeout: 60000,
  });
export const LevelPackStatsFilter = (data: LevelPackQuery & Filter) =>
  api.get(
    `levelpack/${data.name}/stats/${data.eolOnly}/${data.filter}/${data.filterValue}`,
    undefined,
    {
      timeout: 60000,
    },
  );
export const LevelPackRecords = (data: LevelPackQuery) =>
  api.get(`levelpack/${data.name}/records/${data.eolOnly ? 1 : 0}`);
export const LevelPackRecordsFilter = (data: LevelPackQuery & Filter) =>
  api.get(
    `levelpack/${data.name}/records/${data.eolOnly ? 1 : 0}/${data.filter}/${
      data.filterValue
    }`,
  );
export const MultiRecords = (LevelPackName: string) =>
  api.get(`levelpack/${LevelPackName}/multirecords`);
export const LevelPackSearch = (q: string) => api.get(`levelpack/search/${q}`);
export const LevelsSearch = (data: Search & { showLocked: Flag }) =>
  api.get(`levelpack/searchLevel/${data.q}/${data.offset}/${data.showLocked}`);
export const LevelsSearchAll = (data: { q: string; ShowLocked: Flag }) =>
  api.get(`levelpack/searchLevel/${data.q}/${data.ShowLocked}`);
export const AddLevelPack = (data: Payload) => api.post('levelpack/add', data);
export const UpdateLevelPack = (index: Id, data: Payload) =>
  api.post(`levelpack/update/${index}`, data);
export const LevelPackUpdateLevel = (data: Payload) =>
  api.post('levelpack/admin/updateLevel', data);
export const LevelPackDeleteLevel = (data: Payload) =>
  api.post('levelpack/admin/deleteLevel', data);
export const LevelPackAddLevel = (data: Payload) =>
  api.post('levelpack/admin/addLevel', data);
export const LevelPackSortLevel = (data: Payload) =>
  api.post('levelpack/admin/sortLevel', data);
export const LevelPackSort = (data: Payload) =>
  api.post('levelpack/admin/sort', data);
export const LevelPackFavAdd = (data: Payload) =>
  api.post('levelpack/favourite/add', data);
export const LevelPackFavRemove = (data: Payload) =>
  api.post('levelpack/favourite/remove', data);
export const LevelPackFavs = () => api.get('levelpack/favourite');
export const IntBestTimes = (kuskiIndex: Id) => {
  return api.get(`levelpack/internals/besttimes/${kuskiIndex}`);
};
export const LevelPackStatsKuski = (KuskiIndex: Id) =>
  api.get(`levelpackstats/kuski/${KuskiIndex}`);
export const LevelPacksByLevel = (LevelIndex: Id) =>
  api.get(`levelpack/byLevel/${+LevelIndex}`);
export const CupsByLevel = (LevelIndex: Id) =>
  api.get(`cups/byLevel/${+LevelIndex}`);
export const LatestLevelPacks = (limit: Id) =>
  api.get(`levelpack/latest/${limit}`);

export const LevelPackRecordHistory = (
  name: string,
  opts: { limit: number; offset: number; sort?: string },
) =>
  api.get(`levelpack/record-history/${name}`, {
    limit: opts.limit,
    offset: opts.offset,
    sort: opts.sort || 'desc',
  });

// collections
export const AddCollection = (data: Payload) =>
  api.post('levelpack/collections/add', data);
export const Collections = () => api.get('levelpack/collections');
export const Collection = (name: string) =>
  api.get(`levelpack/collections/${name}`);
export const SearchPack = (search: string) =>
  api.get(`levelpack/collections/search/${search}`);
export const AddPack = (data: Payload) =>
  api.post('levelpack/collections/addpack', data);
export const DeletePack = (data: Payload) =>
  api.post('levelpack/collections/deletepack', data);

// besttime
type BesttimeQuery = { levelId: Id; limit: Id; eolOnly: Flag };

export const Besttime = (data: BesttimeQuery) =>
  api.get(`besttime/${data.levelId}/${data.limit}/${data.eolOnly}`);
export const BesttimeFilter = (data: BesttimeQuery & Filter) =>
  api.get(
    `besttime/${data.levelId}/${data.limit}/${data.eolOnly}/${data.filter}/${data.filterValue}`,
  );
export const PersonalLatestPRs = (
  data: { KuskiIndex: Id; limit: Id } & DateSearch,
) =>
  api.get(
    `besttime/latest/${data.KuskiIndex}/${data.limit}?level=${data.search.level}&from=${data.search.from}&to=${data.search.to}`,
  );
export const MultiBesttime = (data: { levelId: Id; limit: Id }) =>
  api.get(`besttime/multi/${data.levelId}/${data.limit}`);

export const RecentBestRecords = (
  daysPast: Id,
  limit: Id,
  repeatLevels: Flag = 1,
  opts = {},
) =>
  api.get(`besttime/best-records/0/0/${limit || 0}/${repeatLevels ? 1 : 0}`, {
    ...opts,
    daysPast,
  });

// battles
type Paged = { KuskiIndex: Id; page: Id; pageSize: Id };

export const BattlesSearchByFilename = (data: Search) =>
  api.get(`battle/search/byFilename/${data.q}/${data.offset}`);
export const BattlesSearchByDesigner = (data: Search) =>
  api.get(`battle/search/byDesigner/${data.q}/${data.offset}`);
export const BattlesSearch = (data: object) =>
  api.get(`battle/search/generic`, data);
export const BattlesByLevel = (LevelIndex: Id) =>
  api.get(`battle/byLevel/${LevelIndex}`);
export const BattleResults = (BattleIndex: Id) =>
  api.get(`battle/byBattleIndex/${BattleIndex}`);
export const BattleList = (IndexList: Id[] | string) =>
  api.get(`battle/byBattleIndexList/${IndexList}`); // array of battle indices
export const GetAllBattleTimes = (query: string) =>
  api.get(`battle/allBattleTimes/${query}`);
export const BattlesByDesigner = (data: Paged) =>
  api.get(
    `battle/byDesigner/${data.KuskiIndex}?page=${data.page}&pageSize=${data.pageSize}`,
  );
export const BattlesByPlayer = (data: Paged) =>
  api.get(
    `battle/byPlayer/${data.KuskiIndex}?page=${data.page}&pageSize=${data.pageSize}`,
  );
export const AllBattleRuns = (BattleIndex: Id) =>
  api.get(`battle/allRuns/${BattleIndex}`);
export const BattleListPeriod = (data: { start: Id; end: Id; limit: Id }) =>
  api.get(`battle/byPeriod/${data.start}/${data.end}/${data.limit}`);
export const BattleReplays = (BattleIndex: Id) =>
  api.get(`battle/replays/${BattleIndex}`);
export const LatestBattles = (limit: Id) => api.get(`battle/${limit}`);
export const LatestBattleReplays = (limit: Id) =>
  api.get(`battle/replays?limit=${limit}`);

// players
export const PlayersSearch = (data: Search) =>
  api.get(`player/search/${data.q}/${data.offset}`);
export const TeamsSearch = (data: Search) =>
  api.get(`player/searchTeam/${data.q}/${data.offset}`);
export const UserInfo = (KuskiIndex: Id) => api.get(`player/${KuskiIndex}`);
export const UserInfoByIdentifier = (data: {
  IdentifierType: string;
  KuskiIdentifier: Id;
}) => api.get(`player/${data.IdentifierType}/${data.KuskiIdentifier}`);
export const UpdateUserInfo = (data: Payload) =>
  api.post(`register/update`, data);
export const Ignore = (Kuski: string) => api.post(`player/ignore/${Kuski}`, {});
export const Ignored = () => api.get('player/ignored');
export const Unignore = (KuskiIndex: Id) =>
  api.post(`player/unignore/${KuskiIndex}`, {});
export const Players = () => api.get('player/');
export const GetCrew = () => api.get('player/crew/');
export const NotificationSettings = () => api.get('player/settings');
export const ChangeSettings = (data: Payload) =>
  api.post('player/settings', data);
export const PlayerRecordCount = (KuskiIndex: Id) =>
  api.get(`player/record-count/${KuskiIndex}`);
export const PlayerRecords = (KuskiIndex: Id, opts: object) =>
  api.get(`player/records/${KuskiIndex}`, opts);

// teams
export const Teams = () => api.get('teams');
export const TeamMembers = (Team: string) => api.get(`teams/${Team}`);

// chat
export const SearchChat = (data: object) =>
  api.get('chatlog', { params: JSON.stringify(data) });

// lgr
export const LGR = (LGRName: string) => api.get(`lgr/info/${LGRName}`);
export const LGRs = () => api.get(`lgr/info`);
export const NewLGR = (formData: FormData) =>
  apiUpload.post('api/lgr/add', formData);
export const EditLGR = (LGRName: string, formData: FormData) =>
  apiUpload.post(`api/lgr/info/${LGRName}`, formData);
export const DeleteLGR = (LGRName: string) => api.delete(`lgr/del/${LGRName}`);
export const LGRComments = (LGRIndex: Id) =>
  api.get(`lgr_comment/get/${LGRIndex}`);
export const NewLGRComment = (data: Payload) =>
  api.post(`lgr_comment/add`, data);

// level
export const Level = (LevelIndex: Id, withLevelStats = false) =>
  api.get(`level/${LevelIndex}`, { stats: withLevelStats ? '1' : '' });
export const LevelData = (LevelIndex: Id) =>
  api.get(`level/leveldata/${LevelIndex}`);
export const LevelTimeStats = ({
  LevelIndex,
  from,
  to,
}: {
  LevelIndex: Id;
  from?: Id;
  to?: Id;
}) => api.get(`level/timestats/${LevelIndex}`, { from, to });
export const UpdateLevel = (data: { LevelIndex: Id; update: Payload }) =>
  api.post(`level/${data.LevelIndex}`, data.update);
export const UpdateLevelTags = (data: { LevelIndex: Id; tags: Id[] }) =>
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
}: ListQuery & {
  addedBy?: Id;
  finished?: string;
  battled?: string;
  finishedBy?: Id;
  q?: string;
}) => {
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
export const PersonalRanking = (KuskiIndex: Id) =>
  api.get(`ranking/kuski/${KuskiIndex}`);
export const Ranking = (data: { periodType: string; period: Id }) =>
  api.get(`ranking/${data.periodType}/${data.period}`);
export const RankingHistoryByBattle = (BattleIndex: Id) =>
  api.get(`ranking/battle/${BattleIndex}`);

// mod
type LogQuery = { Kuski: string; ErrorTime: Id };

export const NickRequests = () => api.get(`mod/nickrequests`);
export const NickAccept = (data: { SiteSettingIndex: Id }) =>
  api.post(`mod/nickrequests/accept/${data.SiteSettingIndex}`, {});
export const NickDecline = (data: { SiteSettingIndex: Id }) =>
  api.post(`mod/nickrequests/decline/${data.SiteSettingIndex}`, {});
export const Banlist = () => api.get('mod/banlist');
export const BanlistKuski = (KuskiIndex: Id) =>
  api.get(`mod/banlist/${KuskiIndex}`);
export const BanKuski = (data: Payload) => api.post('mod/bankuski', data);
export const ErrorLog = (data: LogQuery) =>
  api.get(`mod/errorlog/${data.Kuski}/${data.ErrorTime}`);
export const ActionLog = (data: LogQuery) =>
  api.get(`mod/actionlog/${data.Kuski}/${data.ErrorTime}`);
export const GiveRights = (data: Payload) => api.post('mod/giverights', data);
export const IPlogs = (KuskiIndex: Id) => api.get(`mod/iplogs/${KuskiIndex}`);

// news
export const News = (amount: Id) => api.get(`news/${amount}`);
export const AddNews = (data: Payload) => api.post('news', data);

// donations
export const GetDonations = () => api.get(`donate/`);

// upload
export const UploadFile = (data: FormData) =>
  apiUpload.post(`upload/file`, data);
export const UpdateFile = (data: Payload) => api.post(`upload`, data);
export const MyFiles = (data: {
  limit: Id;
  search: { filename: string; from: string; to: string };
}) =>
  api.get(
    `upload/${data.limit}?filename=${data.search.filename}&from=${data.search.from}&to=${data.search.to}`,
  );
export const DeleteFile = (data: {
  index: Id;
  uuid: string;
  filename: string;
}) => api.delete(`upload/${data.index}/${data.uuid}/${data.filename}`);

// taswr
export const GetDatInfo = (data: FormData) =>
  apiUpload.post(`api/taswr/getdatinfo`, data);

// tags
export const GetReplayTags = () => api.get(`tag?type=replay`);
export const GetLevelTags = () => api.get(`tag?type=level`);
export const GetLevelPackTags = () => api.get(`tag?type=levelpack`);
export const GetLGRTags = () => api.get(`tag?type=lgr`);
export const GetTags = () => api.get(`tag`);
export const CreateTag = (data: Payload) => api.post(`tag`, data);
export const UpdateTag = (TagIndex: Id, data: Payload) =>
  api.put(`tag/${TagIndex}`, data);
export const DeleteTag = (TagIndex: Id) => api.delete(`tag/${TagIndex}`);

// notifications
export const GetNotifications = () => api.get(`notification`);
export const GetNotificationsCount = () => api.get(`notification/count`);
export const MarkNotificationsSeen = () =>
  api.post(`notification/markSeen`, {});

// status
export const SystemStatus = () => api.get('news/status');

// battle league
export const BattleLeagues = () => api.get('battleleague');
export const AddBattleLeague = (data: Payload) =>
  api.post('battleleague/add', data);
export const BattleLeague = (shortName: string) =>
  api.get(`battleleague/${shortName}`);
export const AddBattleLeagueBattle = (data: Payload) =>
  api.post('battleleague/add/battle', data);
export const UpdateBattleLeagueBattle = (data: Payload) =>
  api.post('battleleague/update/battle', data);
export const UpdateBattleLeagueWhitelist = (data: Payload) =>
  api.post('battleleague/update/whitelist', data);
export const UpdateBattleLeagueResultOverride = (data: Payload) =>
  api.post('battleleague/update/override', data);
export const UpdateBattleLeagueBreak = (data: Payload) =>
  api.post('battleleague/update/break', data);
export const DeleteBattleLeagueBattle = (id: Id) =>
  api.delete(`battleleague/delete/battle/${id}`);

// recap
export const RecapOverall = (year: Id) => api.get(`recap/${year}`);
export const RecapPlayer = ({ user, year }: { user: string; year: Id }) =>
  api.get(`recap/${year}/${user}`);
export const RecapBestof = (year: Id) => api.get(`recap/bestof/${year}`);
export const RecalPlayerAll = (user: string) =>
  api.get(`recap/alltime/${user}`);
export const RecapOverAllAll = () => api.get(`recap/alltime`);
