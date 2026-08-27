import { isEmpty, orderBy, partition } from 'lodash';
import memoize from 'memoizee';

/**
 *
 * @param {Array} packsRef
 * @param {Array} favs
 * @param {Array} stats
 * @param {string} sort
 * @returns {*[]|*}
 */
const sortPacks = (packsRef, favs, stats, sort) => {
  if (isEmpty(packsRef)) {
    return [];
  }

  // deep clone
  let packs = JSON.parse(JSON.stringify(packsRef));

  // set pack.Fav on all packs
  packs = packs.map(lp => {
    const Fav =
      favs.findIndex(f => f.LevelPackIndex === lp.LevelPackIndex) > -1;

    return { ...lp, Fav };
  });

  // stats object from pack object. It's possible that some packs don't have stats.
  const st = p => stats[p.LevelPackIndex] || {};

  if (sort === 'default') {
    return packs.sort((a, b) => {
      if (a.LevelPackName === 'Int') return -1;
      if (b.LevelPackName === 'Int') return 1;
      if (a.Fav !== b.Fav) {
        if (a.Fav) return -1;
        if (b.Fav) return 1;
      }
      return st(b).AvgKuskiPerLevel - st(a).AvgKuskiPerLevel;
    });
  }

  if (!stats) {
    return packs;
  }

  let sorted = [];

  const pct = (num, div) => {
    return div > 0 ? num / div : 0;
  };

  if (sort === 'alpha') {
    sorted = packs.sort((a, b) =>
      a.LevelPackName.toLowerCase().localeCompare(
        b.LevelPackName.toLowerCase(),
      ),
    );
  }

  if (sort === 'created') {
    sorted = orderBy(packs, 'LevelPackIndex', ['desc']);
  }

  if (sort === 'attempts') {
    sorted = orderBy(packs, [p => st(p).AttemptsAll], ['desc']);
  }

  if (sort === 'time') {
    sorted = orderBy(packs, [p => st(p).TimeAll], ['desc']);
  }

  if (sort === 'levels') {
    sorted = orderBy(packs, [p => st(p).LevelCountAll], ['desc']);
  }

  if (sort === 'avgKuskiCount') {
    sorted = orderBy(packs, [p => st(p).AvgKuskiPerLevel], ['desc']);
  }

  if (sort === 'topKuskiPct') {
    sorted = orderBy(
      packs,
      [
        p => {
          const s = st(p);
          return s &&
            s.TopRecordKuskis !== undefined &&
            s.TopRecordKuskis.length
            ? 1
            : 0;
        },
        p => pct(st(p).TopRecordCount, st(p).LevelCountAll),
        p => st(p).LevelCountAll,
      ],
      ['desc', 'desc', 'desc'],
    );
  }

  if (sort === 'topKuskiCount') {
    sorted = orderBy(
      packs,
      [
        p => {
          const s = st(p);
          return s &&
            s.TopRecordKuskis !== undefined &&
            s.TopRecordKuskis.length
            ? 1
            : 0;
        },
        p => st(p).TopRecordCount,
        p => st(p).LevelCountAll,
      ],
      ['desc', 'desc'],
    );
  }

  if (sort === 'attemptsPctD') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).AttemptsD, st(p).AttemptsAll), p => st(p).AttemptsAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'attemptsPctE') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).AttemptsE, st(p).AttemptsAll), p => st(p).AttemptsAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'attemptsPctF') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).AttemptsF, st(p).AttemptsAll), p => st(p).AttemptsAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'timePctD') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).TimeD, st(p).TimeAll), p => st(p).TimeAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'timePctE') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).TimeE, st(p).TimeAll), p => st(p).TimeAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'timePctF') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).TimeF, st(p).TimeAll), p => st(p).TimeAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'minTime') {
    sorted = orderBy(packs, [p => st(p).MinRecordTime], ['asc']);
  }

  if (sort === 'maxTime') {
    sorted = orderBy(
      packs,
      [
        p => {
          const t = st(p).MaxRecordTime;

          return t > 0 ? t : 0;
        },
      ],
      ['desc'],
    );
  }

  if (sort === 'avgTime') {
    sorted = orderBy(packs, [p => st(p).AvgRecordTime], ['desc']);
  }

  // move items with no stats to bottom (they often all appear at top)
  const [withStats, noStats] = partition(
    sorted,
    p => stats[p.LevelPackIndex] !== undefined,
  );

  return withStats.concat(noStats);
};

export const cachedSort = memoize(sortPacks);
