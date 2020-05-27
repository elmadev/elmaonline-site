import { forEach } from 'lodash';
import moment from 'moment';

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

export const filterResults = events => {
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
    forEach(filteredResults, (result, pos) => {
      filteredResults[pos].Points = points[pos] ? points[pos] : 1;
    });
    filtered[eventIndex].CupTimes = filteredResults;
  });
  return filtered;
};

export const calculateStandings = events => {
  const standings = [];
  forEach(events, event => {
    forEach(event.CupTimes, time => {
      let existsIndex = -1;
      const exists = standings.filter((x, i) => {
        if (x.KuskiIndex === time.KuskiIndex) {
          existsIndex = i;
          return true;
        }
        return false;
      });
      if (exists.length === 0) {
        standings.push({
          KuskiIndex: time.KuskiIndex,
          Points: time.Points,
          Kuski: time.KuskiData.Kuski,
        });
      } else {
        standings[existsIndex] = {
          ...standings[existsIndex],
          Points: standings[existsIndex].Points + time.Points,
        };
      }
    });
  });
  return standings.sort((a, b) => b.Points - a.Points);
};

export const generateEvent = (event, cup, times) => {
  const insertBulk = [];
  const updateBulk = [];
  // loop times and find finished runs
  forEach(times, t => {
    if (t.Finished === 'F' || (event.AppleBugs && t.Finished === 'B')) {
      if (t.Driven > event.StartTime && t.Driven < event.EndTime) {
        const exists = event.CupTimes.filter(
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
        const exists = event.CupTimes.filter(
          c => c.KuskiIndex === t.KuskiIndex && c.Time === t.Time,
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
