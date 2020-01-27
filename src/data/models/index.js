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
import Kinglist from './Kinglist';
import KinglistYearly from './KinglistYearly';
import KinglistMonthly from './KinglistMonthly';
import KinglistWeekly from './KinglistWeekly';
import KinglistDaily from './KinglistDaily';
import RankingHistory from './RankingHistory';
import BestMultitime from './BestMultitime';
import Multitime from './Multitime';
import ReplayComment from './ReplayComment';
import ReplayRating from './ReplayRating';

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

Besttime.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
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

Besttime.belongsTo(WeeklyWRs, {
  foreignKey: 'TimeIndex',
  targetKey: 'TimeIndex',
  as: 'WeeklyWR',
});

WeeklyBest.belongsTo(WeeklyWRs, {
  foreignKey: 'TimeIndex',
  targetKey: 'TimeIndex',
  as: 'WeeklyWR',
});

Kinglist.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

KinglistYearly.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

KinglistMonthly.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

KinglistWeekly.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

KinglistDaily.belongsTo(Kuski, {
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
  Kinglist,
  KinglistYearly,
  KinglistMonthly,
  KinglistWeekly,
  KinglistDaily,
  RankingHistory,
  BestMultitime,
  Multitime,
  ReplayComment,
  ReplayRating,
}; // add the data model here as well so it exports
