import { forEach, has } from 'lodash-es';
import moment from 'moment';

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

const getPoints = (pos, pointSystem, double) => {
  const multiplier = double ? 2 : 1;
  let pts = points;
  if (pointSystem === 1) {
    pts = pointsSystem2;
  }
  if (pts[pos]) {
    return pts[pos] * 10 * multiplier;
  }
  if (pointSystem === 1) {
    if (pos > 49 && pos < 100) {
      return 109 - pos * multiplier;
    }
  }
  return 10 * multiplier;
};

export const filterResults = (events, ownerId = [], loggedId = 0, cupGroup) => {
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
        let firstDrawPos = 0;
        for (let p = 0; p < draws.length; p += 1) {
          const drawPos = drawResults[result.Time] + p;
          if (!firstDrawPos) {
            firstDrawPos = drawPos + 1;
          }
          combinedPoints += getPoints(
            drawPos,
            cupGroup?.PointSystem,
            event.Double,
          );
        }
        const drawPoints = combinedPoints / draws.length;
        filteredResults[pos].Points = drawPoints;
        filteredResults[pos].Position = firstDrawPos;
      } else {
        // otherwise assign points normally
        filteredResults[pos].Points = getPoints(
          pos,
          cupGroup?.PointSystem,
          event.Double,
        );
        filteredResults[pos].Position = pos + 1;
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

export const generateEvent = (event, cup, times, cuptimes) => {
  const insertBulk = [];
  const updateBulk = [];
  const isAppleResults =
    event.AppleResults === null ? cup.AppleResults : event.AppleResults;
  // loop times and find finished runs
  forEach(times, t => {
    if (t.Finished === 'F' || (event.AppleBugs && t.Finished === 'B')) {
      const exists = cuptimes.filter(
        c => c.KuskiIndex === t.KuskiIndex && c.Time === t.Time,
      );
      const data = {
        TimeIndex: t.TimeIndex,
        TimeExists: 1,
      };
      if (t.UUID && t.MD5) {
        data.UUID = t.UUID;
        data.MD5 = t.MD5;
      }
      data.TeamIndex = t.TeamIndex;
      // update cup times if replay is uploaded
      if (exists.length > 0) {
        data.CupTimeIndex = exists[0].CupTimeIndex;
        updateBulk.push(data);
        // otherwise add to cup times if not uploaded
      } else {
        data.CupIndex = event.CupIndex;
        data.KuskiIndex = t.KuskiIndex;
        data.Time = t.Time;
        data.RecData = null;
        insertBulk.push(data);
      }
      // find apple results
    } else if (
      isAppleResults &&
      (t.Finished === 'D' || t.Finished === 'E' || t.Finished === 'B')
    ) {
      const appleTime = 9999000 + (1000 - t.Apples);
      const exists = cuptimes.filter(
        c => c.KuskiIndex === t.KuskiIndex && c.Time === appleTime,
      );
      const data = {
        TimeIndex: t.TimeIndex,
        TimeExists: 1,
      };
      if (t.UUID && t.MD5) {
        data.UUID = t.UUID;
        data.MD5 = t.MD5;
      }
      data.TeamIndex = t.TeamIndex;
      // update cup times if replay is uploaded
      if (exists.length > 0) {
        data.CupTimeIndex = exists[0].CupTimeIndex;
        updateBulk.push(data);
        // otherwise add to cup times if not uploaded
      } else {
        data.CupIndex = event.CupIndex;
        data.KuskiIndex = t.KuskiIndex;
        data.Time = appleTime;
        data.RecData = null;
        insertBulk.push(data);
      }
    }
  });
  return { insertBulk, updateBulk };
};
