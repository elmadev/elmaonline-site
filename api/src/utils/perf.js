import { performance } from 'perf_hooks';
import { flatMap, groupBy, mapValues, sumBy } from 'lodash-es';

// helps generate a simple array with time differences in mili-seconds.
// usage: const track = getPerfTracker(); track(1); track(2); console.log track(null);
export const getPerfTracker = (desc0 = 'start') => {
  // mili-seconds
  const t = () => {
    return Math.floor(performance.now());
  };

  const data = {
    start: t(),
    desc: desc0,
    units: 'ms',
    events: [],
  };

  // pass in desc null to only return current state.
  return function track(desc) {
    if (desc !== null) {
      const now = t();

      // timestamp at last even or at start
      const timeLast =
        data.events.length > 0
          ? data.start + data.events[data.events.length - 1].sinceStart
          : data.start;

      data.events.push({
        desc,
        sinceLast: now - timeLast,
        sinceStart: now - data.start,
      });
    }

    return data;
  };
};

// aggregate many performance trackers. useful when you
// want to track performance inside a function that gets
// called many times inside a loop. Just make sure you use
// the same description each time you call track().
export const aggregateTrackers = trackers => {
  // all events in single array
  const allEvents = flatMap(trackers, tr => tr.events);

  // ie. { desc1: [ ev1, ev2 ], desc2: ... }
  const grouped = groupBy(allEvents, ev => ev.desc);

  // the sum of sinceLast for all events with same description.
  return mapValues(grouped, evs => {
    return sumBy(evs, ev => ev.sinceLast);
  });
};
