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
