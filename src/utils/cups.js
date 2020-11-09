import { forEach, has } from 'lodash';
import moment from 'moment';
import { zeroPad } from 'utils/time';

export const admins = cup => {
  let a = [cup.KuskiIndex];
  if (cup.ReadAccess) {
    a = [
      cup.KuskiIndex,
      ...cup.ReadAccess.split('-').map(r => parseInt(r, 10)),
    ];
  }
  return a;
};

export const points = [
  100,
  85,
  75,
  70,
  65,
  60,
  56,
  52,
  49,
  46,
  44,
  42,
  40,
  38,
  36,
  35,
  34,
  33,
  32,
  31,
  30,
  29,
  28,
  27,
  26,
  25,
  24,
  23,
  22,
  21,
  20,
  19,
  18,
  17,
  16,
  15,
  14,
  13,
  12,
  11,
  10,
  9,
  8,
  7,
  6,
  5,
  4,
  3,
  2,
  1,
];

export const filterResults = (events, ownerId = [], loggedId = 0) => {
  const filtered = [];
  // loop events
  forEach(events, (eventValues, eventIndex) => {
    const event = eventValues.dataValues;
    filtered.push(event);
    filtered[eventIndex].StartTime = moment(
      filtered[eventIndex].StartTime,
    ).format('X');
    filtered[eventIndex].EndTime = moment(filtered[eventIndex].EndTime).format(
      'X',
    );
    const sortedTimes = event.CupTimes.sort((a, b) => {
      if (a.dataValues.Time === b.dataValues.Time) {
        return a.dataValues.TimeIndex - b.dataValues.TimeIndex;
      }
      return a.dataValues.Time - b.dataValues.Time;
    });
    const kuskisIn = [];
    const filteredResults = [];
    // loop results and insert best result from each kuski
    forEach(sortedTimes, timeValues => {
      const time = timeValues.dataValues;
      if (time.TimeExists) {
        if (kuskisIn.indexOf(time.KuskiIndex) === -1) {
          filteredResults.push(time);
          kuskisIn.push(time.KuskiIndex);
        }
      }
    });
    // iterate results to assign points
    const drawResults = {};
    forEach(filteredResults, (result, pos) => {
      // check for draw results
      const draws = filteredResults.filter(r => r.Time === result.Time);
      if (draws.length > 1) {
        if (!has(drawResults, result.Time)) {
          drawResults[result.Time] = pos;
        }
        let combinedPoints = 0;
        for (let p = 0; p < draws.length; p += 1) {
          const drawPos = drawResults[result.Time] + p;
          combinedPoints += points[drawPos] ? points[drawPos] : 1;
        }
        const drawPoints = combinedPoints / draws.length;
        filteredResults[pos].Points = drawPoints;
      } else {
        // otherwise assign points normally
        filteredResults[pos].Points = points[pos] ? points[pos] : 1;
      }
    });
    filtered[eventIndex].CupTimes = [];
    if (filtered[eventIndex].EndTime < moment().format('X')) {
      if (filtered[eventIndex].Updated) {
        if (filtered[eventIndex].ShowResults) {
          filtered[eventIndex].CupTimes = filteredResults;
        } else if (ownerId.length > 0 && ownerId.indexOf(loggedId) > -1) {
          filtered[eventIndex].CupTimes = filteredResults;
        }
      }
    }
  });
  return filtered;
};

export const calculateStandings = (events, cup, simple) => {
  let standings = [];
  let skipStandings = [];
  const teamStandings = [];
  const nationStandings = [];
  let teamEntries = {};
  let nationEntries = {};
  forEach(events, event => {
    teamEntries = {};
    nationEntries = {};
    forEach(event.CupTimes, (time, index) => {
      // player standings
      let existsIndex = -1;
      const exists = standings.filter((x, i) => {
        if (x.KuskiIndex === time.KuskiIndex) {
          existsIndex = i;
          return true;
        }
        return false;
      });

      const pointsDetailed = {
        Points: time.Points,
        LevelIndex: event.LevelIndex,
        Position: index + 1,
        TotalPlayers: event.CupTimes.length,
        Skipped: false,
      };

      if (exists.length === 0) {
        standings.push({
          KuskiIndex: time.KuskiIndex,
          Points: time.Points,
          Kuski: time.KuskiData.Kuski,
          KuskiData: time.KuskiData,
          Events: 1,
          AllPoints: [time.Points],
          AllPointsDetailed: [pointsDetailed],
        });
      } else {
        standings[existsIndex] = {
          ...standings[existsIndex],
          Points: standings[existsIndex].Points + time.Points,
          Events: standings[existsIndex].Events + 1,
          AllPoints: [...standings[existsIndex].AllPoints, time.Points],
          AllPointsDetailed: [
            ...standings[existsIndex].AllPointsDetailed,
            pointsDetailed,
          ],
        };
      }
      // team standings
      if (time.KuskiData.TeamIndex && !simple) {
        const existsTeam = teamStandings.findIndex(
          x => x.TeamIndex === time.KuskiData.TeamIndex,
        );
        if (existsTeam === -1) {
          teamStandings.push({
            TeamIndex: time.KuskiData.TeamIndex,
            Points: time.Points,
            Team: time.KuskiData.TeamData.Team,
          });
          teamEntries[time.KuskiData.TeamIndex] = 1;
        } else if (
          teamEntries[time.KuskiData.TeamIndex] < 3 ||
          !teamEntries[time.KuskiData.TeamIndex]
        ) {
          teamStandings[existsTeam] = {
            ...teamStandings[existsTeam],
            Points: teamStandings[existsTeam].Points + time.Points,
          };
          if (teamEntries[time.KuskiData.TeamIndex]) {
            teamEntries[time.KuskiData.TeamIndex] += 1;
          } else {
            teamEntries[time.KuskiData.TeamIndex] = 1;
          }
        }
      }
      // nation standings
      if (!simple) {
        const existsNation = nationStandings.findIndex(
          x => x.Country === time.KuskiData.Country,
        );
        if (existsNation === -1) {
          nationStandings.push({
            Country: time.KuskiData.Country,
            Points: time.Points,
          });
          nationEntries[time.KuskiData.Country] = 1;
        } else if (
          nationEntries[time.KuskiData.Country] < 3 ||
          !nationEntries[time.KuskiData.Country]
        ) {
          nationStandings[existsNation] = {
            ...nationStandings[existsNation],
            Points: nationStandings[existsNation].Points + time.Points,
          };
          if (nationEntries[time.KuskiData.Country]) {
            nationEntries[time.KuskiData.Country] += 1;
          } else {
            nationEntries[time.KuskiData.Country] = 1;
          }
        }
      }
    });
  });
  if (cup.Skips) {
    skipStandings = standings.map(s => {
      if (s.Events <= cup.Events - cup.Skips) {
        return s;
      }
      const { AllPoints } = s;
      let { Points, AllPointsDetailed } = s;
      for (let i = 0; i < s.Events - (cup.Events - cup.Skips); i += 1) {
        const min = Math.min(...AllPoints);
        const removeIndex = AllPoints.findIndex(ap => ap === min);
        AllPoints.splice(removeIndex, 1);
        Points -= min;

        const skippedLevel = AllPointsDetailed.find(apd => apd.Points === min);
        AllPointsDetailed = AllPointsDetailed.map(apd => {
          if (apd.LevelIndex === skippedLevel.LevelIndex) {
            return { ...apd, Skipped: true };
          }
          return apd;
        });
      }
      return { ...s, AllPoints, Points, AllPointsDetailed };
    });
    standings = skipStandings;
  }
  return {
    player: standings.sort((a, b) => b.Points - a.Points),
    team: teamStandings.sort((a, b) => b.Points - a.Points),
    nation: nationStandings.sort((a, b) => b.Points - a.Points),
  };
};

export const generateEvent = (event, cup, times, cuptimes) => {
  const insertBulk = [];
  const updateBulk = [];
  // loop times and find finished runs
  forEach(times, t => {
    if (t.Finished === 'F' || (event.AppleBugs && t.Finished === 'B')) {
      if (t.Driven > event.StartTime && t.Driven < event.EndTime) {
        const exists = cuptimes.filter(
          c => c.KuskiIndex === t.KuskiIndex && c.Time === t.Time,
        );
        // update cup times if replay is uploaded
        if (exists.length > 0) {
          updateBulk.push({
            TimeIndex: t.TimeIndex,
            TimeExists: 1,
            CupTimeIndex: exists[0].CupTimeIndex,
          });
          // add to cup times if not uploaded and replay not required
        } else if (!cup.ReplayRequired) {
          insertBulk.push({
            CupIndex: event.CupIndex,
            KuskiIndex: t.KuskiIndex,
            TimeIndex: t.TimeIndex,
            Time: t.Time,
            TimeExists: 1,
            RecData: null,
          });
        }
      }
      // find apple results
    } else if (cup.AppleResults && (t.Finished === 'D' || t.Finished === 'E')) {
      if (t.Driven > event.StartTime && t.Driven < event.EndTime) {
        const exists = cuptimes.filter(
          c =>
            c.KuskiIndex === t.KuskiIndex &&
            c.Time === 9999000 + (1000 - t.Apples),
        );
        // insert only if replay uploaded
        if (exists.length > 0) {
          updateBulk.push({
            TimeIndex: t.TimeIndex,
            TimeExists: 1,
            CupTimeIndex: exists[0].CupTimeIndex,
          });
        }
      }
    }
  });
  return { insertBulk, updateBulk };
};

export const getPrivateCupRecUri = (
  CupTimeIndex,
  ShortName,
  Kuski,
  Code,
  levelNumber,
) => {
  return `/dl/cupreplay/${CupTimeIndex}/${ShortName}${zeroPad(
    levelNumber,
    2,
  )}${Kuski.substring(0, 6)}/${Code}`;
};
