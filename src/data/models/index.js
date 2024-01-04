import sequelize from '../sequelize';
import Battle from './Battle'; // add the data model here to import
import Replay from './Replay';
import Level from './Level';
import LevelTags from './LevelTags';
import LevelPackTags from './LevelPackTags';
import Kuski from './Kuski';
import Battletime from './Battletime';
import BattleLeague from './BattleLeague';
import BattleLeagueBattle from './BattleLeagueBattle';
import Chat from './Chat';
import Team from './Team';
import AllFinished from './AllFinished';
import Besttime from './Besttime';
import LevelPack from './LevelPack';
import LevelPackLevel from './LevelPackLevel';
import Time from './Time';
import WeeklyWRs from './WeeklyWRs';
import WeeklyBest from './WeeklyBest';
import Ranking from './Ranking';
import RankingYearly from './RankingYearly';
import RankingMonthly from './RankingMonthly';
import RankingWeekly from './RankingWeekly';
import RankingDaily from './RankingDaily';
import RankingHistory from './RankingHistory';
import BestMultitime from './BestMultitime';
import Multitime from './Multitime';
import ReplayComment from './ReplayComment';
import ReplayRating from './ReplayRating';
import Country from './Country';
import SiteCupGroup from './SiteCupGroup';
import SiteCup from './SiteCup';
import SiteCupTime from './SiteCupTime';
import SiteCupBlog from './SiteCupBlog';
import KuskiMap from './KuskiMap';
import SiteSetting from './SiteSetting';
import LegacyFinished from './LegacyFinished';
import LegacyBesttime from './LegacyBesttime';
import Ignored from './Ignored';
import Ban from './Ban';
import FlagBan from './FlagBan';
import ActionLogs from './ActionLogs';
import Error from './Error';
import Logs from './Logs';
import News from './News';
import Donate from './Donate';
import Upload from './Upload';
import LevelPackFavourite from './LevelPackFavourite';
import LevelPackCollection from './LevelPackCollection';
import LevelPackCollectionPack from './LevelPackCollectionPack';
import Tag from './Tag';
import ReplayTags from './ReplayTags';
import Notification from './Notification';
import LevelStats from './LevelStats';
import KuskiStats from './KuskiStats';
import * as PlayStats from './PlayStats';
import LevelStatsUpdate from './LevelStatsUpdate';
import Setting from './Setting';
import TimeFile from './TimeFile';
import MultiTimeFile from './MultiTimeFile';
import Crippled from './Crippled';
import Recap from './Recap';
import ReplayLog from './ReplayLog';

Replay.belongsTo(Kuski, {
  foreignKey: 'DrivenBy',
  as: 'DrivenByData',
});

Replay.belongsTo(Kuski, {
  foreignKey: 'UploadedBy',
  as: 'UploadedByData',
});

Battle.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Battle.belongsTo(Level, {
  foreignKey: 'LevelIndex',
  as: 'LevelData',
});

Replay.belongsTo(Level, {
  foreignKey: 'LevelIndex',
  as: 'LevelData',
});

Battletime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Battletime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex2',
  as: 'KuskiData2',
});

AllFinished.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

AllFinished.belongsTo(Level, {
  foreignKey: 'LevelIndex',
  as: 'LevelData',
});

AllFinished.hasOne(TimeFile, {
  foreignKey: 'TimeIndex',
  sourceKey: 'TimeIndex',
  as: 'TimeFileData',
});

Besttime.hasOne(TimeFile, {
  foreignKey: 'TimeIndex',
  sourceKey: 'TimeIndex',
  as: 'TimeFileData',
});

Time.hasOne(TimeFile, {
  foreignKey: 'TimeIndex',
  sourceKey: 'TimeIndex',
  as: 'TimeFileData',
});

WeeklyBest.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Time.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Time.belongsTo(Level, {
  foreignKey: 'LevelIndex',
  as: 'LevelData',
});

Battle.hasMany(Battletime, {
  foreignKey: 'BattleIndex',
  as: 'Results',
});

Chat.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Kuski.belongsTo(Team, {
  foreignKey: 'TeamIndex',
  as: 'TeamData',
});

Team.hasMany(Kuski, {
  foreignKey: 'TeamIndex',
  as: 'Members',
});

LevelPack.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Level.belongsTo(Kuski, {
  foreignKey: 'AddedBy',
  as: 'KuskiData',
});

Level.hasMany(Battle, {
  foreignKey: 'LevelIndex',
  as: 'Battles',
});

Level.hasOne(LevelStats, {
  foreignKey: 'LevelIndex',
  as: 'LevelStatsData',
  constraints: false,
});

Level.belongsToMany(Tag, {
  through: LevelTags,
  foreignKey: 'LevelIndex',
  as: 'Tags',
});

Tag.belongsToMany(Level, {
  through: LevelTags,
  foreignKey: 'TagIndex',
  as: 'Levels',
});

LevelStats.belongsTo(Level, {
  foreignKey: 'LevelIndex',
  as: 'LevelData',
  constraints: false,
});

LevelPack.hasMany(LevelPackLevel, {
  foreignKey: 'LevelPackIndex',
  as: 'Levels',
});

LevelPack.belongsToMany(Tag, {
  through: LevelPackTags,
  foreignKey: 'LevelPackIndex',
  as: 'Tags',
});

Tag.belongsToMany(LevelPack, {
  through: LevelPackTags,
  foreignKey: 'TagIndex',
  as: 'LevelPacks',
});

LevelPackLevel.belongsTo(Level, {
  foreignKey: 'LevelIndex',
  as: 'Level',
});

LevelPackLevel.belongsTo(LevelPack, {
  foreignKey: 'LevelPackIndex',
  as: 'LevelPack',
});

LevelPackLevel.hasMany(Besttime, {
  foreignKey: 'LevelIndex',
  sourceKey: 'LevelIndex',
  as: 'LevelBesttime',
});

LevelPackLevel.hasMany(LegacyBesttime, {
  foreignKey: 'LevelIndex',
  sourceKey: 'LevelIndex',
  as: 'LevelLegacyBesttime',
});

LevelPackLevel.hasMany(BestMultitime, {
  foreignKey: 'LevelIndex',
  sourceKey: 'LevelIndex',
  as: 'LevelMultiBesttime',
});

Ignored.belongsTo(Kuski, {
  foreignKey: 'IgnoredKuskiIndex',
  as: 'KuskiData',
});

LegacyBesttime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

LegacyBesttime.belongsTo(Level, {
  foreignKey: 'LevelIndex',
  as: 'LevelData',
});

LegacyFinished.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Besttime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Besttime.belongsTo(Level, {
  foreignKey: 'LevelIndex',
  as: 'LevelData',
});

Besttime.belongsTo(WeeklyWRs, {
  foreignKey: 'TimeIndex',
  targetKey: 'TimeIndex',
  as: 'WeeklyWR',
});

BestMultitime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex1',
  as: 'Kuski1Data',
});

BestMultitime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex2',
  as: 'Kuski2Data',
});

WeeklyBest.belongsTo(WeeklyWRs, {
  foreignKey: 'TimeIndex',
  targetKey: 'TimeIndex',
  as: 'WeeklyWR',
});

Ranking.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Kuski.hasOne(Ranking, {
  foreignKey: 'KuskiIndex',
  as: 'RankingData',
});

RankingYearly.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

RankingMonthly.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

RankingWeekly.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

RankingDaily.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

ReplayComment.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

BestMultitime.belongsTo(Multitime, {
  foreignKey: 'MultiTimeIndex',
  as: 'TimeData',
});

Multitime.belongsTo(BestMultitime, {
  foreignKey: 'MultiTimeIndex',
  as: 'TimeData',
});

SiteCup.belongsTo(Kuski, {
  foreignKey: 'Designer',
  as: 'KuskiData',
});

SiteCup.belongsTo(Level, {
  foreignKey: 'LevelIndex',
  as: 'Level',
});

SiteCup.belongsTo(SiteCupGroup, {
  foreignKey: 'CupGroupIndex',
  as: 'CupGroup',
});

SiteCup.hasMany(SiteCupTime, {
  foreignKey: 'CupIndex',
  as: 'CupTimes',
});

BattleLeague.hasMany(BattleLeagueBattle, {
  foreignKey: 'BattleLeagueIndex',
  as: 'Battles',
});

BattleLeague.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

BattleLeagueBattle.belongsTo(Battle, {
  foreignKey: 'BattleIndex',
  as: 'BattleData',
});

BattleLeagueBattle.belongsTo(Kuski, {
  foreignKey: 'Designer',
  as: 'DesignerData',
});

SiteCupTime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

SiteCupTime.belongsTo(Team, {
  foreignKey: 'TeamIndex',
  as: 'TeamData',
});

SiteCupTime.belongsTo(SiteCup, {
  foreignKey: 'CupIndex',
  as: 'CupData',
});

SiteCupBlog.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

SiteCupGroup.hasMany(SiteCupBlog, {
  foreignKey: 'CupGroupIndex',
  as: 'CupBlog',
});

SiteCupGroup.hasMany(SiteCup, {
  foreignKey: 'CupGroupIndex',
  as: 'SiteCupData',
});

SiteCupGroup.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

KuskiMap.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

SiteSetting.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Setting.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Ban.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

FlagBan.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

ActionLogs.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

ActionLogs.belongsTo(Kuski, {
  foreignKey: 'RightsKuski',
  as: 'RightsKuskiData',
});

Error.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

News.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Donate.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

LevelPackCollection.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

LevelPackCollectionPack.belongsTo(LevelPack, {
  foreignKey: 'LevelPackIndex',
  as: 'PackData',
});

Tag.belongsToMany(Replay, {
  through: ReplayTags,
  foreignKey: 'TagIndex',
  as: 'Replays',
});

Replay.belongsToMany(Tag, {
  through: ReplayTags,
  foreignKey: 'ReplayIndex',
  as: 'Tags',
});

Replay.hasMany(ReplayRating, {
  foreignKey: 'ReplayIndex',
  as: 'Rating',
});

Replay.hasMany(ReplayComment, {
  foreignKey: 'ReplayIndex',
  as: 'Comments',
});

ReplayComment.belongsTo(Replay, {
  foreignKey: 'ReplayIndex',
  as: 'Replay',
});

Crippled.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Crippled.belongsTo(Level, {
  foreignKey: 'LevelIndex',
  as: 'LevelData',
});

TimeFile.belongsTo(AllFinished, {
  foreignKey: 'TimeIndex',
  targetKey: 'TimeIndex',
  as: 'TimeData',
});

SiteCupTime.belongsTo(Time, {
  foreignKey: 'TimeIndex',
  targetKey: 'TimeIndex',
  as: 'TimeData',
});

Recap.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Recap.belongsTo(Battle, {
  foreignKey: 'OtherIndex',
  targetKey: 'BattleIndex',
  as: 'BattleData',
});

Recap.belongsTo(Replay, {
  foreignKey: 'OtherIndex',
  targetKey: 'ReplayIndex',
  as: 'ReplayData',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export {
  Battle,
  Replay,
  Level,
  Kuski,
  Battletime,
  BattleLeague,
  BattleLeagueBattle,
  Chat,
  Team,
  AllFinished,
  Besttime,
  LevelPack,
  LevelPackLevel,
  Time,
  WeeklyWRs,
  WeeklyBest,
  Ranking,
  RankingYearly,
  RankingMonthly,
  RankingWeekly,
  RankingDaily,
  RankingHistory,
  BestMultitime,
  Multitime,
  ReplayComment,
  ReplayRating,
  Country,
  SiteCupGroup,
  SiteCup,
  SiteCupTime,
  SiteCupBlog,
  KuskiMap,
  SiteSetting,
  LegacyFinished,
  LegacyBesttime,
  Ignored,
  Ban,
  FlagBan,
  ActionLogs,
  Error,
  Logs,
  News,
  Donate,
  Upload,
  LevelPackFavourite,
  LevelPackCollection,
  LevelPackCollectionPack,
  Tag,
  Notification,
  LevelStats,
  KuskiStats,
  LevelStatsUpdate,
  PlayStats,
  Setting,
  TimeFile,
  MultiTimeFile,
  Crippled,
  Recap,
  ReplayLog,
}; // add the data model here as well so it exports
