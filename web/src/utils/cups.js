import { forEach } from 'lodash';
import config from 'config';
import { nickId } from 'utils/nick';
import { zeroPad } from 'utils/time';
import { createRecName } from 'utils/misc';

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
  100, 85, 75, 70, 65, 60, 56, 52, 49, 46, 44, 42, 40, 38, 36, 35, 34, 33, 32,
  31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13,
  12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
];

export const pointsSystem2 = [
  100, 85, 75, 70, 65, 60, 56, 52, 49, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37,
  36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18,
  17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6,
];

export const mopoPoints = [
  100, 80, 60, 50, 45, 40, 36, 32, 29, 26, 24, 22, 20, 18, 16, 15, 14, 13, 12,
  11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
];

export const top20points = [
  25, 20, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
];

const calcSkipStandings = (standings, forceSkip, finishedEvents, cup) => {
  return standings.map(s => {
    const totalEvents = forceSkip ? finishedEvents : cup.Events;
    if (s.Events <= totalEvents - cup.Skips) {
      return s;
    }
    let allPoints = s.AllPoints;
    let points = s.Points;
    let allPointsDetailed = s.AllPointsDetailed;
    for (let i = 0; i < s.Events - (totalEvents - cup.Skips); i += 1) {
      const min = Math.min(...allPoints);
      const removeIndex = allPoints.findIndex(ap => ap === min);
      allPoints.splice(removeIndex, 1);
      points -= min;
      const skippedLevel = allPointsDetailed.find(apd => apd.Points === min);
      allPointsDetailed = allPointsDetailed.map(apd => {
        if (apd.LevelIndex === skippedLevel.LevelIndex) {
          return { ...apd, Skipped: true };
        }
        return apd;
      });
    }
    return {
      ...s,
      AllPoints: allPoints,
      Points: points,
      AllPointsDetailed: allPointsDetailed,
    };
  });
};

const calcStandings = (standings, eventIndex) => {
  let lastPoints = 0;
  let drawPos = 0;
  return standings
    .sort((a, b) => b.Points - a.Points)
    .map((s, i) => {
      let position = i + 1;
      if (lastPoints === s.Points) {
        if (!drawPos) {
          drawPos = i;
        }
        position = drawPos;
      } else if (drawPos) {
        drawPos = 0;
      }
      lastPoints = s.Points;
      return {
        ...s,
        Position: s.Position
          ? { ...s.Position, [`${eventIndex + 1}`]: position }
          : { [`${eventIndex + 1}`]: position },
        FinalPosition: position,
      };
    });
};

export const calculateStandings = (events, cup, simple, forceSkip = false) => {
  let standings = [];
  const teamStandings = [];
  const nationStandings = [];
  let teamEntries = {};
  let nationEntries = {};
  let finishedEvents = 0;
  if (forceSkip) {
    finishedEvents = events.filter(
      e => parseInt(e.EndTime) < new Date().getTime() / 1000,
    ).length;
  }
  const isCupAdmin =
    admins(cup).length > 0 && admins(cup).indexOf(nickId()) > -1;
  const completedEvents = events.filter(
    e => e.Updated && (e.ShowResults || isCupAdmin),
  );
  forEach(completedEvents, (event, eventIndex) => {
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
        Position: time.Position ? time.Position : index + 1,
        TotalPlayers: event.CupTimes.length,
        Skipped: false,
        Event: eventIndex + 1,
      };

      if (exists.length === 0) {
        standings.push({
          KuskiIndex: time.KuskiIndex,
          Points: time.Points,
          Kuski: time.KuskiData.Kuski,
          KuskiData: cup.TeamPoints
            ? {
                Kuski: time.KuskiData.Kuski,
                TeamIndex: time.TeamIndex,
                Country: time.KuskiData.Country,
                TeamData: time.TeamData,
              }
            : time.KuskiData,
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
          KuskiData: cup.TeamPoints
            ? {
                Kuski: time.KuskiData.Kuski,
                TeamIndex: time.TeamIndex,
                Country: time.KuskiData.Country,
                TeamData: time.TeamData,
              }
            : standings[existsIndex].KuskiData,
        };
      }
      // team standings
      const teamIndex = cup.TeamPoints
        ? time.TeamIndex
        : time.KuskiData.TeamIndex;
      if (teamIndex && !simple) {
        const existsTeam = teamStandings.findIndex(
          x => x.TeamIndex === teamIndex,
        );
        if (existsTeam === -1) {
          teamStandings.push({
            TeamIndex: teamIndex,
            Points: time.Points,
            Team: cup.TeamPoints
              ? time.TeamData.Team
              : time.KuskiData.TeamData.Team,
          });
          teamEntries[teamIndex] = 1;
        } else if (teamEntries[teamIndex] < 3 || !teamEntries[teamIndex]) {
          teamStandings[existsTeam] = {
            ...teamStandings[existsTeam],
            Points: teamStandings[existsTeam].Points + time.Points,
          };
          if (teamEntries[teamIndex]) {
            teamEntries[teamIndex] += 1;
          } else {
            teamEntries[teamIndex] = 1;
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
    if (eventIndex < completedEvents.length - 1) {
      standings = calcStandings(standings, eventIndex);
    }
  });
  if (cup.Skips) {
    standings = calcSkipStandings(standings, forceSkip, finishedEvents, cup);
  }
  standings = calcStandings(standings, completedEvents.length);
  return {
    player: standings,
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
  time = 0,
) => {
  const filename = createRecName(
    `${ShortName}${zeroPad(levelNumber, 2)}`,
    Kuski,
    time,
    true,
  ).replace('.rec', '');
  return `${config.dlUrl}cupreplay/${CupTimeIndex}/${filename}/${Code}`;
};

export const pts = (points, short = false) => {
  const p = +(points / 10).toFixed(2);
  if (p === 1) {
    return `1 ${short ? 'pt' : 'point'}`;
  }
  return `${p} ${short ? 'pts' : 'points'}`;
};
