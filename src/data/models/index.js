import sequelize from '../sequelize.js';
import Battle from './Battle.js';
import Replay from './Replay.js';
import Level from './Level.js';
import LevelTags from './LevelTags.js';
import LevelPackTags from './LevelPackTags.js';
import Kuski from './Kuski.js';
import Battletime from './Battletime.js';
import BattleLeague from './BattleLeague.js';
import BattleLeagueBattle from './BattleLeagueBattle.js';
import Chat from './Chat.js';
import Team from './Team.js';
import AllFinished from './AllFinished.js';
import Besttime from './Besttime.js';
import LevelPack from './LevelPack.js';
import LevelPackLevel from './LevelPackLevel.js';
import Time from './Time.js';
import Ranking from './Ranking.js';
import RankingYearly from './RankingYearly.js';
import RankingMonthly from './RankingMonthly.js';
import RankingWeekly from './RankingWeekly.js';
import RankingDaily from './RankingDaily.js';
import RankingHistory from './RankingHistory.js';
import BestMultitime from './BestMultitime.js';
import Multitime from './Multitime.js';
import ReplayComment from './ReplayComment.js';
import ReplayRating from './ReplayRating.js';
import Country from './Country.js';
import SiteCupGroup from './SiteCupGroup.js';
import SiteCup from './SiteCup.js';
import SiteCupTime from './SiteCupTime.js';
import SiteCupBlog from './SiteCupBlog.js';
import KuskiMap from './KuskiMap.js';
import SiteSetting from './SiteSetting.js';
import LegacyFinished from './LegacyFinished.js';
import LegacyBesttime from './LegacyBesttime.js';
import Ignored from './Ignored.js';
import Ban from './Ban.js';
import FlagBan from './FlagBan.js';
import ActionLogs from './ActionLogs.js';
import Error from './Error.js';
import Logs from './Logs.js';
import News from './News.js';
import Donate from './Donate.js';
import Upload from './Upload.js';
import LevelPackFavourite from './LevelPackFavourite.js';
import LevelPackCollection from './LevelPackCollection.js';
import LevelPackCollectionPack from './LevelPackCollectionPack.js';
import Tag from './Tag.js';
import ReplayTags from './ReplayTags.js';
import Notification from './Notification.js';
import LevelStats from './LevelStats.js';
import KuskiStats from './KuskiStats.js';
import * as PlayStats from './PlayStats.js';
import LevelStatsUpdate from './LevelStatsUpdate.js';
import Setting from './Setting.js';
import TimeFile from './TimeFile.js';
import MultiTimeFile from './MultiTimeFile.js';
import Crippled from './Crippled.js';
import Recap from './Recap.js';
import ReplayLog from './ReplayLog.js';
import LGR from './LGR.js';
import LGRTags from './LGRTags.js';
import LGRComment from './LGRComment.js';

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

Level.hasOne(Besttime, { foreignKey: 'LevelIndex', as: 'Besttime' });

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

BestMultitime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex1',
  as: 'Kuski1Data',
});

BestMultitime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex2',
  as: 'Kuski2Data',
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

LGR.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Tag.belongsToMany(LGR, {
  through: LGRTags,
  foreignKey: 'TagIndex',
  as: 'LGRs',
});

LGR.belongsToMany(Tag, {
  through: LGRTags,
  foreignKey: 'LGRIndex',
  as: 'Tags',
});

LGR.hasMany(LGRComment, {
  foreignKey: 'LGRIndex',
  as: 'Comments',
});

LGRComment.belongsTo(LGR, {
  foreignKey: 'LGRIndex',
  as: 'LGR',
});

LGRComment.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
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

Crippled.hasOne(TimeFile, {
  foreignKey: 'TimeIndex',
  sourceKey: 'TimeIndex',
  as: 'TimeFileData',
});

TimeFile.belongsTo(AllFinished, {
  foreignKey: 'TimeIndex',
  targetKey: 'TimeIndex',
  as: 'TimeData',
});

TimeFile.hasOne(Time, {
  foreignKey: 'TimeIndex',
  sourceKey: 'TimeIndex',
  as: 'Time',
});

TimeFile.hasOne(Battletime, {
  foreignKey: 'TimeIndex',
  sourceKey: 'TimeIndex',
  as: 'Battletime',
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
  LGR,
  LGRComment,
  LGRTags,
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
};
