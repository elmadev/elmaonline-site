import sequelize from '#data/sequelize';
import { log } from '#utils/database';
import { forEach } from 'lodash-es';
import { Recap } from '#data/models';

export const types = [
  '',
  'Apples',
  'Runs',
  'TimePlayed',
  'TimePlayedBattles',
  'MaxSpeed',
  'ThrottleTime',
  'BrakeTime',
  'LeftVolts',
  'RightVolts',
  'SuperVolts',
  'Turns',
  'FinishedRuns',
  'EscapedRuns',
  'DiedRuns',
  'SpiedRuns',
  'LevelsPlayed',
  'NonBattleRuns',
  'BattleRuns',
  'OneWheelRuns',
  'DrunkRuns',
  'AmountBattles',
  'Normal',
  'FirstFinish',
  'OneLife',
  'Slowness',
  'Survivor',
  'LastCounts',
  'FlagTag',
  'Apple',
  'Speed',
  'FinishCount',
  '1HourTT',
  'SeeOthers',
  'HiddenTimes',
  'NoVolt',
  'NoTurn',
  'OneTurn',
  'NoBrake',
  'NoThrottle',
  'AlwaysThrottle',
  'Drunk',
  'OneWheel',
  'Multi',
  'TotalDuration',
  'AverageDuration',
  'TotalCountdown',
  'KuskisChatted',
  'ChatLines',
  'AverageChatLength',
  'ChatLev10s',
  'ChatRec10s',
  'ChatLols',
  'LevelsAdded',
  'UniqueLevelNames',
  'TotalApples',
  'TotalKillers',
  'TotalFlowers',
  'UniqueDesigners',
  'PlayedNormal',
  'PlayedFirstFinish',
  'PlayedOneLife',
  'PlayedSlowness',
  'PlayedSurvivor',
  'PlayedLastCounts',
  'PlayedFlagTag',
  'PlayedApple',
  'PlayedSpeed',
  'PlayedFinishCount',
  'Played1HourTT',
  'BattlesPlayed',
  'RankingEarned',
  'Players',
  'BattlesDesigned',
  'UniquePlayers',
  'UniquePlayedDesigners',
  'AveragePlayedDuration',
  'MostPlayers',
  'AverageVote',
  'AmountVotes',
  'OneVotes',
  'TenVotes',
];

const executeQuery = async (q, replacements) => {
  const [result] = await sequelize.query(q, {
    replacements,
    benchmark: true,
    logging: (query, b) => log('query', query, b),
  });
  return result;
};

const timeKuski = async () => {
  const q = `
    SELECT KuskiIndex, SUM(Apples) AS Apples, COUNT(TimeIndex) AS Runs, SUM(Time) AS TimePlayed, SUM(IF(BattleIndex != 0, Time, 0)) AS TimePlayedBattles, MAX(MaxSpeed) AS MaxSpeed,
    SUM(ThrottleTime) AS ThrottleTime, SUM(BrakeTime) AS BrakeTime, SUM(LeftVolt) AS LeftVolts, SUM(RightVolt) AS RightVolts,
    SUM(SuperVolt) AS SuperVolts, SUM(Turn) AS Turns,
    SUM(Finished = 'F') AS FinishedRuns, SUM(Finished = 'E') AS 'EscapedRuns', SUM(Finished = 'D') AS DiedRuns, SUM(Finished = 'S') AS SpiedRuns,
    COUNT(DISTINCT LevelIndex) as LevelsPlayed,
    SUM(BattleIndex = 0) AS NonBattleRuns, SUM(BattleIndex != 0) AS BattleRuns,
    SUM(OneWheel = 1) AS OneWheelRuns, SUM(Drunk = 1) AS DrunkRuns
    FROM time WHERE TimeIndex > ? AND TimeIndex < ? GROUP BY KuskiIndex;
  `;
  const result = await executeQuery(q, [201387809, 210565302]);
  return result;
};

const time = async () => {
  const q = `
    SELECT SUM(Apples) AS Apples, COUNT(TimeIndex) AS Runs, SUM(time) AS TimePlayed, SUM(IF(BattleIndex != 0, Time, 0)) AS TimePlayedBattles, MAX(MaxSpeed) AS MaxSpeed,
    SUM(ThrottleTime) AS ThrottleTime, SUM(BrakeTime) AS BrakeTime, SUM(LeftVolt) AS LeftVolts, SUM(RightVolt) AS RightVolts,
    SUM(SuperVolt) AS SuperVolts, SUM(Turn) AS Turns,
    SUM(Finished = 'F') AS FinishedRuns, SUM(Finished = 'E') AS 'EscapedRuns', SUM(Finished = 'D') AS DiedRuns, SUM(Finished = 'S') AS SpiedRuns,
    COUNT(DISTINCT LevelIndex) as LevelsPlayed,
    SUM(BattleIndex = 0) AS NonBattleRuns, SUM(BattleIndex != 0) AS BattleRuns,
    SUM(OneWheel = 1) AS OneWheelRuns, SUM(Drunk = 1) AS DrunkRuns
    FROM time WHERE TimeIndex > ? AND TimeIndex < ?;
  `;
  const result = await executeQuery(q, [201387809, 210565302]);
  return result;
};

const battle = async () => {
  const q = `
    SELECT COUNT(BattleIndex) AS AmountBattles, SUM(BattleType = 'NM') AS Normal, SUM(BattleType = 'FF') AS FirstFinish,
    SUM(BattleType = 'OL') AS OneLife, SUM(BattleType = 'SL') AS Slowness, SUM(BattleType = 'SR') AS Survivor,
    SUM(BattleType = 'LC') AS LastCounts, SUM(BattleType = 'FT') AS FlagTag, SUM(BattleType = 'AP') AS Apple,
    SUM(BattleType = 'SP') AS Speed, SUM(BattleType = 'FC') AS FinishCount, SUM(BattleType = 'HT') AS '1HourTT',
    SUM(SeeOthers = 1) AS SeeOthers, SUM(SeeTimes = 0) AS HiddenTimes, SUM(NoVolt = 1) AS NoVolt, SUM(NoTurn = 1) AS NoTurn,
    SUM(OneTurn = 1) AS OneTurn, SUM(NoBrake = 1) AS NoBrake, SUM(NoThrottle = 1) AS NoThrottle, SUM(AlwaysThrottle = 1) AS AlwaysThrottle,
    SUM(Drunk = 1) AS Drunk, SUM(OneWheel = 1) AS OneWheel, SUM(Multi = 1) AS Multi, SUM(Duration) AS TotalDuration,
    AVG(Duration) AS AverageDuration, SUM(Countdown) AS TotalCountdown
    FROM battle WHERE BattleIndex > ? AND BattleIndex < ?
  `;
  const result = await executeQuery(q, [180355, 188874]);
  return result;
};

const battleKuski = async () => {
  const q = `
    SELECT KuskiIndex, COUNT(BattleIndex) AS AmountBattles, SUM(BattleType = 'NM') AS Normal, SUM(BattleType = 'FF') AS FirstFinish,
    SUM(BattleType = 'OL') AS OneLife, SUM(BattleType = 'SL') AS Slowness, SUM(BattleType = 'SR') AS Survivor,
    SUM(BattleType = 'LC') AS LastCounts, SUM(BattleType = 'FT') AS FlagTag, SUM(BattleType = 'AP') AS Apple,
    SUM(BattleType = 'SP') AS Speed, SUM(BattleType = 'FC') AS FinishCount, SUM(BattleType = 'HT') AS '1HourTT',
    SUM(SeeOthers = 1) AS SeeOthers, SUM(SeeTimes = 0) AS HiddenTimes, SUM(NoVolt = 1) AS NoVolt, SUM(NoTurn = 1) AS NoTurn,
    SUM(OneTurn = 1) AS OneTurn, SUM(NoBrake = 1) AS NoBrake, SUM(NoThrottle = 1) AS NoThrottle, SUM(AlwaysThrottle = 1) AS AlwaysThrottle,
    SUM(Drunk = 1) AS Drunk, SUM(OneWheel = 1) AS OneWheel, SUM(Multi = 1) AS Multi, SUM(Duration) AS TotalDuration,
    AVG(Duration) AS AverageDuration, SUM(Countdown) AS TotalCountdown
    FROM battle WHERE BattleIndex > ? AND BattleIndex < ? GROUP BY KuskiIndex
  `;
  const result = await executeQuery(q, [180355, 188874]);
  return result;
};

const chat = async () => {
  const q = `
    SELECT COUNT(DISTINCT KuskiIndex) as KuskisChatted, COUNT(ChatIndex) AS ChatLines, AVG(CHAR_LENGTH(Text)) AS AverageChatLength,
    SUM(Text = '!lev 10') AS ChatLev10s, SUM(Text = '!rec 10') AS ChatRec10s, SUM(Text = 'lol') AS ChatLols
    FROM chat WHERE ChatIndex > ? AND ChatIndex < ?
  `;
  const result = await executeQuery(q, [8415755, 8673085]);
  return result;
};

const chatKuski = async () => {
  const q = `
    SELECT KuskiIndex, COUNT(DISTINCT KuskiIndex) as KuskisChatted, COUNT(ChatIndex) AS ChatLines, AVG(CHAR_LENGTH(Text)) AS AverageChatLength,
    SUM(Text = '!lev 10') AS ChatLev10s, SUM(Text = '!rec 10') AS ChatRec10s, SUM(Text = 'lol') AS ChatLols
    FROM chat WHERE ChatIndex > ? AND ChatIndex < ? GROUP BY KuskiIndex
  `;
  const result = await executeQuery(q, [8415755, 8673085]);
  return result;
};

const level = async () => {
  const q = `
    SELECT COUNT(LevelIndex) AS LevelsAdded, COUNT(DISTINCT LevelName) as UniqueLevelNames, SUM(Apples) AS TotalApples,
    SUM(Killers) AS TotalKillers, SUM(Flowers) AS TotalFlowers, COUNT(DISTINCT AddedBy) AS UniqueDesigners
    FROM level WHERE LevelIndex > ? AND LevelIndex < ?
  `;
  const result = await executeQuery(q, [521136, 566340]);
  return result;
};

const levelKuski = async () => {
  const q = `
    SELECT AddedBy as KuskiIndex, COUNT(LevelIndex) AS LevelsAdded, COUNT(DISTINCT LevelName) as UniqueLevelNames, SUM(Apples) AS TotalApples,
    SUM(Killers) AS TotalKillers, SUM(Flowers) AS TotalFlowers
    FROM level WHERE LevelIndex > ? AND LevelIndex < ? GROUP BY AddedBy
  `;
  const result = await executeQuery(q, [521136, 566340]);
  return result;
};

const rankingKuski = async () => {
  const q = `
    SELECT KuskiIndex, SUM(BattleType = 'NM') AS PlayedNormal, SUM(BattleType = 'FF') AS PlayedFirstFinish,
    SUM(BattleType = 'OL') AS PlayedOneLife, SUM(BattleType = 'SL') AS PlayedSlowness, SUM(BattleType = 'SR') AS PlayedSurvivor,
    SUM(BattleType = 'LC') AS PlayedLastCounts, SUM(BattleType = 'FT') AS PlayedFlagTag, SUM(BattleType = 'AP') AS PlayedApple,
    SUM(BattleType = 'SP') AS PlayedSpeed, SUM(BattleType = 'FC') AS PlayedFinishCount, SUM(BattleType = 'HT') AS 'Played1HourTT',
    SUM(IF(BattleType = 'All', 1, 0)) AS BattlesPlayed, SUM(IF(BattleType = 'All', Increase, 0)) AS RankingEarned
    FROM rankinghistory WHERE BattleIndex > ? AND BattleIndex < ? GROUP BY KuskiIndex
  `;
  const result = await executeQuery(q, [180355, 188874]);
  return result;
};

const battletime = async () => {
  const q = `
    SELECT COUNT(BattleIndex) AS MostPlayers, BattleIndex as OtherIndex, '0' AS KuskiIndex
    FROM battletime WHERE BattleIndex > ? AND BattleIndex < ? GROUP BY BattleIndex
    ORDER BY MostPlayers DESC LIMIT 100
  `;
  const result = await executeQuery(q, [180355, 188874]);
  return result;
};

const replayrating = async () => {
  const q = `
    SELECT ReplayIndex, AVG(Vote) AS AverageVote, COUNT(ReplayRatingIndex) AS AmountVotes,
    SUM(Vote = 1) AS OneVotes, SUM(Vote = 10) AS TenVotes
    FROM replay_rating WHERE (ReplayIndex > ? AND ReplayIndex < ?) OR (ReplayIndex > ? AND ReplayIndex < ?) GROUP BY ReplayIndex
  `;
  const result = await executeQuery(q, [4346, 4455, 13676, 16653]);
  return result;
};

const battletimeDesigner = async () => {
  const q = `
    SELECT battle.KuskiIndex, COUNT(BattleTimeIndex) AS Players, COUNT(DISTINCT battle.BattleIndex) AS BattlesDesigned,
    COUNT(DISTINCT battletime.KuskiIndex) AS UniquePlayers
    FROM battletime, battle WHERE battle.BattleIndex = battletime.BattleIndex
    AND battletime.BattleIndex > ? AND battletime.BattleIndex < ? GROUP BY battle.KuskiIndex
  `;
  const result = await executeQuery(q, [180355, 188874]);
  return result;
};

const battletimeKuski = async () => {
  const q = `
    SELECT battletime.KuskiIndex, COUNT(DISTINCT battle.KuskiIndex) AS UniquePlayedDesigners, AVG(battle.Duration) AS AveragePlayedDuration
    FROM battletime, battle WHERE battle.BattleIndex = battletime.BattleIndex AND battletime.BattleIndex > ?
    AND battletime.BattleIndex < ? GROUP BY battletime.KuskiIndex
  `;
  const result = await executeQuery(q, [180355, 188874]);
  return result;
};

export const recapGenerate = async (type, Year) => {
  const Created = Math.floor(Date.now() / 1000);
  let results;
  let personal = false;
  let recrating = false;
  let overall = false;
  if (type === 'timeKuski') {
    results = await timeKuski();
    personal = true;
  }
  if (type === 'time') {
    results = await time();
    overall = true;
  }
  if (type === 'battle') {
    results = await battle();
    overall = true;
  }
  if (type === 'battleKuski') {
    results = await battleKuski();
    personal = true;
  }
  if (type === 'chat') {
    results = await chat();
    overall = true;
  }
  if (type === 'chatKuski') {
    results = await chatKuski();
    personal = true;
  }
  if (type === 'level') {
    results = await level();
    overall = true;
  }
  if (type === 'levelKuski') {
    results = await levelKuski();
    personal = true;
  }
  if (type === 'rankingKuski') {
    results = await rankingKuski();
    personal = true;
  }
  if (type === 'battletimeDesigner') {
    results = await battletimeDesigner();
    personal = true;
  }
  if (type === 'battletimeKuski') {
    results = await battletimeKuski();
    personal = true;
  }
  if (type === 'battletime') {
    results = await battletime();
    personal = true;
  }
  if (type === 'replayrating') {
    results = await replayrating();
    recrating = true;
  }
  if (personal) {
    const inserts = [];
    results.forEach(result => {
      const KuskiIndex = result.KuskiIndex;
      forEach(result, (Value, key) => {
        const Type = types.indexOf(key);
        const OtherIndex = result.OtherIndex ? result.OtherIndex : 0;
        if (Type > -1 && Value != null) {
          inserts.push({ KuskiIndex, OtherIndex, Year, Type, Value, Created });
        }
      });
    });
    await Recap.bulkCreate(inserts);
  }
  if (overall) {
    if (results[0]) {
      const inserts = [];
      forEach(results[0], (Value, key) => {
        const Type = types.indexOf(key);
        if (Type > -1 && Value != null) {
          inserts.push({
            KuskiIndex: 0,
            OtherIndex: 0,
            Year,
            Type,
            Value,
            Created,
          });
        }
      });
      await Recap.bulkCreate(inserts);
    }
  }
  if (recrating) {
    const inserts = [];
    results.forEach(result => {
      if (result.AmountVotes > 1) {
        forEach(result, (Value, key) => {
          const Type = types.indexOf(key);
          if (Type > -1 && Value != null) {
            inserts.push({
              KuskiIndex: 0,
              OtherIndex: result.ReplayIndex,
              Year,
              Type,
              Value,
              Created,
            });
          }
        });
      }
    });
    await Recap.bulkCreate(inserts);
  }
  return;
};
