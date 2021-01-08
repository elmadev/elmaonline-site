import { create } from 'apisauce';

const isWindow = typeof window !== 'undefined';
let baseURL = 'http://localhost:3000/api/';
if (isWindow) {
  baseURL = `${window.location.protocol}//${window.location.host}/api/`;
}
const api = create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
  timeout: 10000,
});

// replays
export const ReplayComment = replayIndex =>
  api.get(`replay_comment/${replayIndex}`);
export const AddReplayComment = data => api.post(`replay_comment/add`, data);
export const ReplayRating = replayIndex =>
  api.get(`replay_rating/${replayIndex}`);
export const AddReplayRating = data => api.post(`replay_rating/add`, data);
export const ReplayDrivenBy = kuskiIndex =>
  api.get(`replay/driven_by/${kuskiIndex}`);
export const ReplayUploadedBy = kuskiIndex =>
  api.get(`replay/uploaded_by/${kuskiIndex}`);
export const ReplayByUUID = UUID => api.get(`replay/byUUID/${UUID}`);
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
export const Replays = data =>
  api.get(`replay?page=${data.page}&pageSize=${data.pageSize}`);

// country
export const Country = () => api.get('country');

// login
export const Register = data => api.post('register', data);
export const Confirm = data => api.post('register/confirm', data);
export const ResetPasswordConfirm = data =>
  api.post('register/resetconfirm', data);
export const ResetPassword = data => api.post('register/reset', data);

// cups
export const Cups = () => api.get('cups');
export const Cup = shortName => api.get(`cups/${shortName}`);
export const CupEvents = cupGroupIndex =>
  api.get(`cups/events/${cupGroupIndex}`);
export const CupEvent = data =>
  api.get(`cups/event/${data.cupGroupIndex}/${data.cupIndex}`);
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
export const PersonalLatest = data =>
  api.get(`allfinished/${data.KuskiIndex}/${data.limit}`);
export const AllFinishedInRange = data =>
  api.get(`allfinished/ranged/${data.LevelIndex}/${data.from}/${data.to}`);
export const AllFinishedLevel = LevelIndex =>
  api.get(`allfinished/${LevelIndex}`);

// levelpack
export const LevelPacks = () => api.get('levelpack');
export const LevelPack = LevelPackName => api.get(`levelpack/${LevelPackName}`);
export const TotalTimes = data =>
  api.get(`levelpack/${data.levelPackIndex}/totaltimes/${data.eolOnly}`);
export const PersonalTimes = data =>
  api.get(
    `levelpack/${data.name}/personal/${data.PersonalKuskiIndex}/${
      data.eolOnly
    }`,
  );
export const Records = data =>
  api.get(`levelpack/${data.name}/records/${data.eolOnly}`);
export const MultiRecords = LevelPackName =>
  api.get(`levelpack/${LevelPackName}/multirecords`);
export const LevelPackSearch = q => api.get(`levelpack/search/${q}`);
export const LevelsSearch = data =>
  api.get(`levelpack/searchLevel/${data.q}/${data.offset}/${data.showLocked}`);
export const LevelsSearchAll = data =>
  api.get(`levelpack/searchLevel/${data.q}`);
export const AddLevelPack = data => api.post('levelpack/add', data);
export const LevelPackDeleteLevel = data =>
  api.post('levelpack/admin/deleteLevel', data);
export const LevelPackAddLevel = data =>
  api.post('levelpack/admin/addLevel', data);
export const LevelPackSortLevel = data =>
  api.post('levelpack/admin/sortLevel', data);
export const LevelPackSort = data => api.post('levelpack/admin/sort', data);

// besttime
export const Besttime = data =>
  api.get(`besttime/${data.levelId}/${data.limit}/${data.eolOnly}`);
export const PersonalLatestPRs = data =>
  api.get(`besttime/latest/${data.KuskiIndex}/${data.limit}`);
export const MultiBesttime = data =>
  api.get(`besttime/multi/${data.levelId}/${data.limit}`);

// battles
export const BattlesSearchByFilename = data =>
  api.get(`battle/search/byFilename/${data.q}/${data.offset}`);
export const BattlesSearchByDesigner = data =>
  api.get(`battle/search/byDesigner/${data.q}/${data.offset}`);
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
    `battle/byDesigner/${data.KuskiIndex}?page=${data.page}&pageSize=${
      data.pageSize
    }`,
  );
export const BattlesByPlayer = data =>
  api.get(
    `battle/byPlayer/${data.KuskiIndex}?page=${data.page}&pageSize=${
      data.pageSize
    }`,
  );
export const BattleListPeriod = data =>
  api.get(`battle/byPeriod/${data.start}/${data.end}/${data.limit}`);

// players
export const PlayersSearch = data =>
  api.get(`player/search/${data.q}/${data.offset}`);
export const TeamsSearch = data =>
  api.get(`player/searchTeam/${data.q}/${data.offset}`);
export const UserInfo = KuskiIndex => api.get(`player/${KuskiIndex}`);
export const UserInfoByIdentifier = data =>
  api.get(`player/${data.IdentifierType}/${data.KuskiIdentifier}`);
export const UpdateUserInfo = data => api.post(`register/update`, data);
export const Ignore = Kuski => api.post(`player/ignore/${Kuski}`);
export const Ignored = () => api.get('player/ignored');
export const Unignore = KuskiIndex => api.post(`player/unignore/${KuskiIndex}`);
export const Players = () => api.get('player/');

// teams
export const Teams = () => api.get('teams');
export const TeamMembers = Team => api.get(`teams/${Team}`);

// chat
export const SearchChat = data => api.get('chatlog', { params: data });

// level
export const Level = LevelIndex => api.get(`level/${LevelIndex}`);
export const LevelData = LevelIndex => api.get(`level/leveldata/${LevelIndex}`);
export const LevelTimeStats = LevelIndex =>
  api.get(`level/timestats/${LevelIndex}`);
export const UpdateLevel = data =>
  api.post(`level/${data.LevelIndex}`, data.update);

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
  api.post(`mod/nickrequests/accept/${data.SiteSettingIndex}`);
export const NickDecline = data =>
  api.post(`mod/nickrequests/decline/${data.SiteSettingIndex}`);
export const Banlist = () => api.get('mod/banlist');
export const BanlistKuski = KuskiIndex => api.get(`mod/banlist/${KuskiIndex}`);
export const BanKuski = data => api.post('mod/bankuski', data);
export const ErrorLog = data =>
  api.get(`mod/errorlog/${data.Kuski}/${data.ErrorTime}`);
export const ActionLog = data =>
  api.get(`mod/actionlog/${data.Kuski}/${data.ErrorTime}`);
export const GiveRights = data => api.post('mod/giverights', data);
export const IPlogs = KuskiIndex => api.get(`mod/iplogs/${KuskiIndex}`);
