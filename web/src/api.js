import { create } from 'apisauce';
import config from 'config';
import { authToken } from 'utils/nick';
import assert from 'assert';
import { isObjectLike, isArray, mapValues, meanBy } from 'lodash';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

let baseURL = config.api;
const api = create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    Authorization: authToken(),
  },
  timeout: 10000,
});

const apiUpload = create({
  baseURL: config.url,
  headers: {
    Accept: '*/*',
    'Cache-Control': 'no-cache',
    Authorization: authToken(),
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000,
});

export const setApiAuth = authToken => {
  api.setHeader('Authorization', authToken);
};

// apisauce adapter
// ie. useQueryAlt( 'key', async () => api.get('replay_comment/23') );
// with useQuery, queryFn should resolve to its payload or throw an error.
// with useQueryAlt, it can resolve to object like { ok: success, data: payload },
// (ie. like apisauce functions) or an array like [ success, payload ]
// (if 4th parameter is true).
export const useQueryAlt = (
  queryKey,
  queryFn,
  queryOpts = {},
  arrayFormat = false,
) => {
  // I thought this should be added to defaultOptions (src/react-query.js),
  // but this didn't stop queries from re-fetching when using navigate.
  if (queryOpts.staleTime === undefined) {
    queryOpts.staleTime = 300000;
  }

  return useQuery({
    queryKey,
    queryFn: async (...args) => {
      const res = await queryFn(...args);

      if (arrayFormat) {
        assert(
          isArray(res) && res.length === 2,
          'Expected an async queryFn that resolves to an array of length 2.',
        );

        if (res[0]) {
          return res[1];
        }

        // eslint-disable-next-line no-console
        console.error('Status not OK', queryKey, res[1]);
        throw new Error('Status not OK');
      } else {
        assert(
          isObjectLike(res),
          'Expected an async queryFn that resolves to an object.',
        );

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
export const ReplayComment = replayIndex =>
  api.get(`replay_comment/${replayIndex}`);
export const AddReplayComment = data => api.post(`replay_comment/add`, data);
export const AllReplayComments = (limit, offset) =>
  api.get('replay_comment/', { limit, offset });
export const ReplayRating = replayIndex =>
  api.get(`replay_rating/${replayIndex}`);
export const AddReplayRating = data => api.post(`replay_rating/add`, data);
export const ReplayDrivenBy = (kuskiIndex, query = {}) =>
  api.get(`replay/driven_by/${kuskiIndex}`, query);
export const ReplayUploadedBy = (kuskiIndex, query = {}) =>
  api.get(`replay/uploaded_by/${kuskiIndex}`, query);
export const ReplayByUUID = (UUID, Fingerprint) =>
  api.get(`replay/byUUID/${UUID}?f=${Fingerprint}`);
export const RandomReplay = () => api.get('replay/random');
export const ReplaysSearchByDriven = data =>
  api.get(`replay/search/byDriven/${data.q}/${data.offset}`);
export const ReplaysSearchByLevel = data =>
  api.get(`replay/search/byLevel/${data.q}/${data.offset}`);
export const ReplaysSearchByFilename = data =>
  api.get(`replay/search/byFilename/${data.q}/${data.offset}`);
export const ReplaysByLevelIndex = LevelIndex =>
  api.get(`replay/byLevelIndex/${LevelIndex}`);
export const InsertReplay = data => api.post('replay', data);
export const UpdateReplay = data => api.post('replay/update', data);
export const Replays = ({
  page,
  pageSize,
  tags,
  sortBy,
  order,
  levelPack,
  excludedTags,
}) => {
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
export const AllMyReplays = ({ page, pageSize, tags, sortBy, order }) => {
  return api.get(`replay/my`, {
    page,
    pageSize,
    tags,
    sortBy,
    order,
  });
};
export const ShareTimeFile = data => api.post('replay/share', data);
export const EditReplay = data => api.post('replay/edit', data);

// country
export const Country = () => api.get('country');

// login
export const Register = data => api.post('register', data);
export const Confirm = data => api.post('register/confirm', data);
export const ResetPasswordConfirm = data =>
  api.post('register/resetconfirm', data);
export const ResetPassword = data => api.post('register/reset', data);
export const DiscordAuthUrl = data => api.post('/register/discord', data);
export const DiscordCode = data => api.post('/register/discord/code', data);
export const DiscordRemove = () => api.post('/register/discord/remove', {});

// cups
export const Cups = () => api.get('cups');
export const CupsOngoing = () => api.get('cups/ongoing');
export const Cup = shortName => api.get(`cups/${shortName}`);
export const CupEvents = cupGroupIndex =>
  api.get(`cups/events/${cupGroupIndex}`);
export const CupEvent = data =>
  api.get(`cups/event/${data.cupGroupIndex}/${data.cupIndex}`);
export const CupEventByTimeIndex = index =>
  api.get(`cups/eventByTimeIndex/${index}`);
export const UpdateCup = (cupGroupIndex, data) =>
  api.post(`cups/edit/${cupGroupIndex}`, data);
export const UpdateCupBlog = data => api.post(`cups/blog/add`, data);
export const AddCup = data => api.post(`cups/add`, data);
export const AddEvent = (data, cupGroupIndex) =>
  api.post(`cups/${cupGroupIndex}/event/add`, data);
export const EditEvent = data =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.CupIndex}/edit`,
    data.event,
  );
export const DeleteEvent = data =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.event.CupIndex}/delete`,
    data.event,
  );
export const GenerateEvent = data =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.event.CupIndex}/generate`,
    data.event,
  );
export const SubmitInterview = data =>
  api.post(`cups/${data.CupGroupIndex}/event/${data.CupIndex}/interview`, data);
export const MyReplays = CupGroupIndex =>
  api.get(`cups/${CupGroupIndex}/myreplays`);
export const UpdateCupReplay = data =>
  api.post(`cups/${data.CupGroupIndex}/updatereplay`, data);
export const TeamReplays = CupGroupIndex =>
  api.get(`cups/${CupGroupIndex}/teamreplays`);
export const CupReplay = CupTimeIndex => api.get(`cups/time/${CupTimeIndex}`);

// kuski map
export const KuskiMap = () => api.get('kuskimap');
export const AddKuskiMap = data => api.post('kuskimap/add', data);

// allfinished
export const Highlight = () => api.get('allfinished/highlight');
export const PersonalAllFinished = data =>
  api.get(`allfinished/${data.LevelIndex}/${data.KuskiIndex}/${data.limit}`);
export const PersonalAppleRuns = data =>
  api.get(`allfinished/appleruns/${data.LevelIndex}/${data.limit}`);

export const PersonalLatest = data =>
  api.get(
    `allfinished/${data.KuskiIndex}/${data.limit}?level=${data.search.level}&from=${data.search.from}&to=${data.search.to}`,
  );
export const PersonalLatestRuns = data =>
  api.get(
    `allfinished/runs/${data.KuskiIndex}/${data.limit}?level=${data.search.level}&from=${data.search.from}&to=${data.search.to}`,
  );
export const LeaderHistory = data => {
  const { from = '', to = '', KuskiIndex = '', BattleIndex = '' } = data;
  return api.get(
    `allfinished/leaderhistory/${data.LevelIndex}?from=${from}&to=${to}&KuskiIndex=${KuskiIndex}&BattleIndex=${BattleIndex}`,
  );
};
export const AllFinishedLevel = LevelIndex =>
  api.get(`allfinished/${LevelIndex}`);

// crippled
export const CrippledTimes = (LevelIndex, cripple, limit, all, limitAll) =>
  api.get(
    `crippled/bestTimes/${LevelIndex}/${cripple}/${limit}?all=${
      all ? 1 : 0
    }&limitAll=${limitAll}`,
  );
export const CrippledPersonal = (LevelIndex, KuskiIndex = 0, cripple, limit) =>
  api.get(`crippled/personal/${LevelIndex}/${KuskiIndex}/${cripple}/${limit}`);

export const CrippledTimeStats = (LevelIndex, KuskiIndex = 0, cripple) =>
  api.get(`crippled/timeStats/${LevelIndex}/${KuskiIndex}/${cripple}`);

export const CrippledLevelPackRecords = (LevelPackName, cripple) =>
  api.get(`crippled/levelPackRecords/${LevelPackName}/${cripple}`);

export const CrippledLevelPackPersonalRecords = (LevelPackName, KuskiIndex) =>
  api.get(`crippled/levelPackPersonalRecords/${LevelPackName}/${KuskiIndex}`);

// levelpack
export const LevelPacks = () => api.get('levelpack');
export const LevelPacksStats = () => api.get('levelpack/stats');

// add some derived values.
// perhaps we could just do this on server.
const mapLevelPackLevelStats = levelStats => {
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

export const LevelPackLevelStats = async (byName, NameOrIndex) => {
  const ret = await api.get(
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
export const LevelPack = (LevelPackName, levels = 0) =>
  api.get(`levelpack/${LevelPackName}`, {
    levels: levels ? '1' : undefined,
  });
export const LevelCollectionStats = (type, value) => {
  if (type === 'ids') {
    value = (value || []).join(',');
  }
  return api.get(`levelstats/collection/${type}/${value}`);
};

export const TotalTimes = data =>
  api.get(`levelpack/${data.levelPackIndex}/totaltimes/${data.eolOnly}`);
export const PersonalTimes = data =>
  api.get(
    `levelpack/${data.name}/personal/${data.PersonalKuskiIndex}/${data.eolOnly}`,
  );
export const PersonalWithMulti = data =>
  api.get(
    `levelpack/${data.name}/personalwithmulti/${data.PersonalKuskiIndex}/${data.eolOnly}`,
  );
export const HistoricTT = data =>
  api.get(`levelpack/${data.LevelPackName}/historic/${data.KuskiIndex}`);
export const LevelPackStats = data =>
  api.get(`levelpack/${data.name}/stats/${data.eolOnly}`, null, {
    timeout: 60000,
  });
export const LevelPackStatsFilter = data =>
  api.get(
    `levelpack/${data.name}/stats/${data.eolOnly}/${data.filter}/${data.filterValue}`,
    null,
    {
      timeout: 60000,
    },
  );
export const LevelPackRecords = data =>
  api.get(`levelpack/${data.name}/records/${data.eolOnly ? 1 : 0}`);
export const LevelPackRecordsFilter = data =>
  api.get(
    `levelpack/${data.name}/records/${data.eolOnly ? 1 : 0}/${data.filter}/${
      data.filterValue
    }`,
  );
export const MultiRecords = LevelPackName =>
  api.get(`levelpack/${LevelPackName}/multirecords`);
export const LevelPackSearch = q => api.get(`levelpack/search/${q}`);
export const LevelsSearch = data =>
  api.get(`levelpack/searchLevel/${data.q}/${data.offset}/${data.showLocked}`);
export const LevelsSearchAll = data =>
  api.get(`levelpack/searchLevel/${data.q}/${data.ShowLocked}`);
export const AddLevelPack = data => api.post('levelpack/add', data);
export const UpdateLevelPack = (index, data) =>
  api.post(`levelpack/update/${index}`, data);
export const LevelPackUpdateLevel = data =>
  api.post('levelpack/admin/updateLevel', data);
export const LevelPackDeleteLevel = data =>
  api.post('levelpack/admin/deleteLevel', data);
export const LevelPackAddLevel = data =>
  api.post('levelpack/admin/addLevel', data);
export const LevelPackSortLevel = data =>
  api.post('levelpack/admin/sortLevel', data);
export const LevelPackSort = data => api.post('levelpack/admin/sort', data);
export const LevelPackFavAdd = data =>
  api.post('levelpack/favourite/add', data);
export const LevelPackFavRemove = data =>
  api.post('levelpack/favourite/remove', data);
export const LevelPackFavs = () => api.get('levelpack/favourite');
export const IntBestTimes = kuskiIndex => {
  return api.get(`levelpack/internals/besttimes/${kuskiIndex}`);
};
export const LevelPackStatsKuski = KuskiIndex =>
  api.get(`levelpackstats/kuski/${KuskiIndex}`);
export const LevelPacksByLevel = LevelIndex =>
  api.get(`levelpack/byLevel/${+LevelIndex}`);
export const CupsByLevel = LevelIndex => api.get(`cups/byLevel/${+LevelIndex}`);
export const LatestLevelPacks = limit => api.get(`levelpack/latest/${limit}`);

export const LevelPackRecordHistory = (name, opts) =>
  api.get(`levelpack/record-history/${name}`, {
    limit: opts.limit,
    offset: opts.offset,
    sort: opts.sort || 'desc',
  });

// collections
export const AddCollection = data =>
  api.post('levelpack/collections/add', data);
export const Collections = () => api.get('levelpack/collections');
export const Collection = name => api.get(`levelpack/collections/${name}`);
export const SearchPack = search =>
  api.get(`levelpack/collections/search/${search}`);
export const AddPack = data => api.post('levelpack/collections/addpack', data);
export const DeletePack = data =>
  api.post('levelpack/collections/deletepack', data);

// besttime
export const Besttime = data =>
  api.get(`besttime/${data.levelId}/${data.limit}/${data.eolOnly}`);
export const BesttimeFilter = data =>
  api.get(
    `besttime/${data.levelId}/${data.limit}/${data.eolOnly}/${data.filter}/${data.filterValue}`,
  );
export const PersonalLatestPRs = data =>
  api.get(
    `besttime/latest/${data.KuskiIndex}/${data.limit}?level=${data.search.level}&from=${data.search.from}&to=${data.search.to}`,
  );
export const MultiBesttime = data =>
  api.get(`besttime/multi/${data.levelId}/${data.limit}`);

export const RecentBestRecords = (
  daysPast,
  limit,
  repeatLevels = 1,
  opts = {},
) =>
  api.get(`besttime/best-records/0/0/${limit || 0}/${repeatLevels ? 1 : 0}`, {
    ...opts,
    daysPast,
  });

// battles
export const BattlesSearchByFilename = data =>
  api.get(`battle/search/byFilename/${data.q}/${data.offset}`);
export const BattlesSearchByDesigner = data =>
  api.get(`battle/search/byDesigner/${data.q}/${data.offset}`);
export const BattlesSearch = data => api.get(`battle/search/generic`, data);
export const BattlesByLevel = LevelIndex =>
  api.get(`battle/byLevel/${LevelIndex}`);
export const BattleResults = BattleIndex =>
  api.get(`battle/byBattleIndex/${BattleIndex}`);
export const BattleList = IndexList =>
  api.get(`battle/byBattleIndexList/${IndexList}`); // array of battle indices
export const GetAllBattleTimes = query =>
  api.get(`battle/allBattleTimes/${query}`);
export const BattlesByDesigner = data =>
  api.get(
    `battle/byDesigner/${data.KuskiIndex}?page=${data.page}&pageSize=${data.pageSize}`,
  );
export const BattlesByPlayer = data =>
  api.get(
    `battle/byPlayer/${data.KuskiIndex}?page=${data.page}&pageSize=${data.pageSize}`,
  );
export const AllBattleRuns = BattleIndex =>
  api.get(`battle/allRuns/${BattleIndex}`);
export const BattleListPeriod = data =>
  api.get(`battle/byPeriod/${data.start}/${data.end}/${data.limit}`);
export const BattleReplays = BattleIndex =>
  api.get(`battle/replays/${BattleIndex}`);
export const LatestBattles = limit => api.get(`battle/${limit}`);
export const LatestBattleReplays = limit =>
  api.get(`battle/replays?limit=${limit}`);

// players
export const PlayersSearch = data =>
  api.get(`player/search/${data.q}/${data.offset}`);
export const TeamsSearch = data =>
  api.get(`player/searchTeam/${data.q}/${data.offset}`);
export const UserInfo = KuskiIndex => api.get(`player/${KuskiIndex}`);
export const UserInfoByIdentifier = data =>
  api.get(`player/${data.IdentifierType}/${data.KuskiIdentifier}`);
export const UpdateUserInfo = data => api.post(`register/update`, data);
export const Ignore = Kuski => api.post(`player/ignore/${Kuski}`, {});
export const Ignored = () => api.get('player/ignored');
export const Unignore = KuskiIndex =>
  api.post(`player/unignore/${KuskiIndex}`, {});
export const Players = () => api.get('player/');
export const GetCrew = () => api.get('player/crew/');
export const NotificationSettings = () => api.get('player/settings');
export const ChangeSettings = data => api.post('player/settings', data);
export const PlayerRecordCount = KuskiIndex =>
  api.get(`player/record-count/${KuskiIndex}`);
export const PlayerRecords = (KuskiIndex, opts) =>
  api.get(`player/records/${KuskiIndex}`, opts);

// teams
export const Teams = () => api.get('teams');
export const TeamMembers = Team => api.get(`teams/${Team}`);

// chat
export const SearchChat = data =>
  api.get('chatlog', { params: JSON.stringify(data) });

// lgr
export const LGR = LGRName => api.get(`lgr/info/${LGRName}`);
export const LGRs = () => api.get(`lgr/info`);
export const NewLGR = formData => apiUpload.post('api/lgr/add', formData);
export const EditLGR = (LGRName, formData) =>
  apiUpload.post(`api/lgr/info/${LGRName}`, formData);
export const DeleteLGR = LGRName => api.delete(`lgr/del/${LGRName}`);
export const LGRComments = LGRIndex => api.get(`lgr_comment/get/${LGRIndex}`);
export const NewLGRComment = data => api.post(`lgr_comment/add`, data);

// level
export const Level = (LevelIndex, withLevelStats = false) =>
  api.get(`level/${LevelIndex}`, { stats: withLevelStats ? '1' : '' });
export const LevelData = LevelIndex => api.get(`level/leveldata/${LevelIndex}`);
export const LevelTimeStats = ({ LevelIndex, from, to }) =>
  api.get(`level/timestats/${LevelIndex}`, { from, to });
export const UpdateLevel = data =>
  api.post(`level/${data.LevelIndex}`, data.update);
export const UpdateLevelTags = data =>
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
export const PersonalRanking = KuskiIndex =>
  api.get(`ranking/kuski/${KuskiIndex}`);
export const Ranking = data =>
  api.get(`ranking/${data.periodType}/${data.period}`);
export const RankingHistoryByBattle = BattleIndex =>
  api.get(`ranking/battle/${BattleIndex}`);

// mod
export const NickRequests = () => api.get(`mod/nickrequests`);
export const NickAccept = data =>
  api.post(`mod/nickrequests/accept/${data.SiteSettingIndex}`, {});
export const NickDecline = data =>
  api.post(`mod/nickrequests/decline/${data.SiteSettingIndex}`, {});
export const Banlist = () => api.get('mod/banlist');
export const BanlistKuski = KuskiIndex => api.get(`mod/banlist/${KuskiIndex}`);
export const BanKuski = data => api.post('mod/bankuski', data);
export const ErrorLog = data =>
  api.get(`mod/errorlog/${data.Kuski}/${data.ErrorTime}`);
export const ActionLog = data =>
  api.get(`mod/actionlog/${data.Kuski}/${data.ErrorTime}`);
export const GiveRights = data => api.post('mod/giverights', data);
export const IPlogs = KuskiIndex => api.get(`mod/iplogs/${KuskiIndex}`);

// news
export const News = amount => api.get(`news/${amount}`);
export const AddNews = data => api.post('news', data);

// donations
export const GetDonations = () => api.get(`donate/`);

// upload
export const UploadFile = data => apiUpload.post(`upload/file`, data);
export const UpdateFile = data => api.post(`upload`, data);
export const MyFiles = data =>
  api.get(
    `upload/${data.limit}?filename=${data.search.filename}&from=${data.search.from}&to=${data.search.to}`,
  );
export const DeleteFile = data =>
  api.delete(`upload/${data.index}/${data.uuid}/${data.filename}`);

// taswr
export const GetDatInfo = data => apiUpload.post(`api/taswr/getdatinfo`, data);

// tags
export const GetReplayTags = () => api.get(`tag?type=replay`);
export const GetLevelTags = () => api.get(`tag?type=level`);
export const GetLevelPackTags = () => api.get(`tag?type=levelpack`);
export const GetLGRTags = () => api.get(`tag?type=lgr`);
export const GetTags = () => api.get(`tag`);
export const CreateTag = data => api.post(`tag`, data);
export const UpdateTag = (TagIndex, data) => api.put(`tag/${TagIndex}`, data);
export const DeleteTag = TagIndex => api.delete(`tag/${TagIndex}`);

// notifications
export const GetNotifications = () => api.get(`notification`);
export const GetNotificationsCount = () => api.get(`notification/count`);
export const MarkNotificationsSeen = () =>
  api.post(`notification/markSeen`, {});

// status
export const SystemStatus = () => api.get('news/status');

// battle league
export const BattleLeagues = () => api.get('battleleague');
export const AddBattleLeague = data => api.post('battleleague/add', data);
export const BattleLeague = shortName => api.get(`battleleague/${shortName}`);
export const AddBattleLeagueBattle = data =>
  api.post('battleleague/add/battle', data);
export const UpdateBattleLeagueBattle = data =>
  api.post('battleleague/update/battle', data);
export const UpdateBattleLeagueWhitelist = data =>
  api.post('battleleague/update/whitelist', data);
export const UpdateBattleLeagueResultOverride = data =>
  api.post('battleleague/update/override', data);
export const UpdateBattleLeagueBreak = data =>
  api.post('battleleague/update/break', data);
export const DeleteBattleLeagueBattle = id =>
  api.delete(`battleleague/delete/battle/${id}`);

// recap
export const RecapOverall = year => api.get(`recap/${year}`);
export const RecapPlayer = ({ user, year }) => api.get(`recap/${year}/${user}`);
export const RecapBestof = year => api.get(`recap/bestof/${year}`);
export const RecalPlayerAll = user => api.get(`recap/alltime/${user}`);
export const RecapOverAllAll = () => api.get(`recap/alltime`);
