import sequelize from '../sequelize';
import Battle from './Battle'; // add the data model here to import
import Replay from './Replay';
import Level from './Level';
import Kuski from './Kuski';
import Battletime from './Battletime';
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

WeeklyBest.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

Time.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
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

LevelPack.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

LevelPack.hasMany(LevelPackLevel, {
  foreignKey: 'LevelPackIndex',
  as: 'Levels',
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

LevelPackLevel.hasMany(BestMultitime, {
  foreignKey: 'LevelIndex',
  sourceKey: 'LevelIndex',
  as: 'LevelMultiBesttime',
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

SiteCup.hasMany(SiteCupTime, {
  foreignKey: 'CupIndex',
  as: 'CupTimes',
});

SiteCupTime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
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

SiteCupGroup.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

KuskiMap.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
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
}; // add the data model here as well so it exports
