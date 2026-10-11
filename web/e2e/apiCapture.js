// Records which API calls a page makes, independent of whether they come from
// easy-peasy, tanstack-query or anything else, so the set can be snapshotted
// and compared across refactors.

import { readFileSync } from 'node:fs';

// the api the test build talks to, from the same env file vite uses for it
const apiOrigin = new URL(
  readFileSync(new URL('../.env.test', import.meta.url), 'utf8')
    .match(/^VITE_API_URL=(.*)$/m)[1]
    .trim(),
).origin;

// Calls whose presence depends on render timing (eg. level thumbnails loaded
// when scrolled into view) rather than on the data fetching code.
const ignored = [/\/api\/level\/leveldata\//];

const isWrite = request => request.method() !== 'GET';

// reads under /api/, and writes anywhere on the api host (uploads go to the
// site root, eg. /upload/file)
const isApi = request => {
  if (!['fetch', 'xhr'].includes(request.resourceType())) return false;
  const { origin, pathname } = new URL(request.url());
  if (origin !== apiOrigin) return false;
  if (ignored.some(regex => regex.test(pathname))) return false;
  return pathname.startsWith('/api/') || isWrite(request);
};

const sortKeys = value => {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map(key => [key, sortKeys(value[key])]),
    );
  }
  return value;
};

// Strip things that change between runs without the calling code changing:
// dates and unix timestamps (eg. battles of today) and numeric ids in paths
// that come from list data.
const normalizeDates = value =>
  value
    .replace(/\d{4}-\d{2}-\d{2}T[^/&"]*/g, '<datetime>')
    .replace(/\d{4}-\d{2}-\d{2}/g, '<date>')
    .replace(/\b1\d{12}\b/g, '<timestamp-ms>')
    .replace(/\b1\d{9}\b/g, '<timestamp>')
    .replace(/\b[0-9a-f]{32}\b/g, '<hash>');

// lists of ids (eg. levels of a cup) depend on data, not on the calling code
const normalizeIdList = segment => segment.replace(/^\d+(,\d+)+$/, ':ids');

const normalizeSegment = segment =>
  normalizeIdList(normalizeDates(segment)).replace(/^\d+$/, ':n');

const normalizeBody = request => {
  const data = request.postData();
  if (!data) return '';
  if ((request.headers()['content-type'] || '').includes('multipart')) {
    return ' <multipart>';
  }
  try {
    return ' ' + normalizeDates(JSON.stringify(sortKeys(JSON.parse(data))));
  } catch {
    return ' <non-json body>';
  }
};

const describePath = request =>
  new URL(request.url()).pathname
    .replace(/^\//, '')
    .replace(/^api\//, '')
    .split('/')
    .map(segment => normalizeSegment(decodeURIComponent(segment)))
    .join('/');

export const describeRequest = request => {
  const url = new URL(request.url());
  const path = describePath(request);
  const query = [...url.searchParams.entries()]
    .map(([key, value]) => `${key}=${normalizeDates(value)}`)
    .sort()
    .join('&');
  return `${request.method()} ${path}${query ? `?${query}` : ''}${normalizeBody(request)}`;
};

// mocks: { 'POST upload/file': { json: {...} } } for writes where the page
// needs a realistic response to continue, eg. upload then save. Keys use the
// normalized path, like in the snapshots.
export const captureApi = async (page, mocks = {}) => {
  const calls = new Set();
  // request -> start time
  const pending = new Map();
  const failures = [];
  const done = request => pending.delete(request);
  page.on('request', request => {
    if (!['fetch', 'xhr'].includes(request.resourceType())) return;
    pending.set(request, Date.now());
    if (isApi(request)) calls.add(describeRequest(request));
  });
  page.on('requestfinished', done);
  page.on('requestfailed', request => {
    done(request);
    if (isApi(request)) {
      failures.push(
        `${describeRequest(request)} ${request.failure()?.errorText}`,
      );
    }
  });
  page.on('response', response => {
    if (isApi(response.request()) && response.status() >= 500) {
      failures.push(
        `${describeRequest(response.request())} ${response.status()}`,
      );
    }
  });
  // never write to the test api, but still record the call
  await page.route(
    url => url.origin === apiOrigin,
    route => {
      const request = route.request();
      if (!isWrite(request)) return route.fallback();
      const mock = mocks[`${request.method()} ${describePath(request)}`];
      return route.fulfill(mock || { json: {} });
    },
  );
  return {
    // wait until no fetch/xhr is in flight, nothing new has been requested and
    // the main thread hasn't been busy for a while, so calls chained after slow
    // responses or heavy renders are included
    settle: async (quietMs = 2000, maxMs = 45000, stalledMs = 15000) => {
      const start = Date.now();
      let quietSince = Date.now();
      let count = calls.size;
      while (Date.now() - start < maxMs) {
        const tick = Date.now();
        // resolves on the next frame, so it's slow when the main thread is busy
        // (throws while navigating, which counts as busy too)
        await page
          .evaluate(
            () => new Promise(resolve => requestAnimationFrame(resolve)),
          )
          .catch(() => page.waitForTimeout(300));
        const busy = Date.now() - tick > 250;
        // requests hanging longer than the app's own 10s api timeout are
        // reported as failures instead of blocking forever
        for (const [request, started] of pending) {
          if (Date.now() - started > stalledMs) {
            pending.delete(request);
            if (isApi(request)) {
              failures.push(`${describeRequest(request)} stalled`);
            }
          }
        }
        if (busy || pending.size > 0 || calls.size !== count) {
          count = calls.size;
          quietSince = Date.now();
        } else if (Date.now() - quietSince >= quietMs) {
          return;
        }
        await page.waitForTimeout(100);
      }
    },
    // failed/5xx api calls, usually means apitest is struggling rather than a regression
    failures: () => failures,
    // sorted set of calls made so far, leaving out the ones in `exclude`
    calls: (exclude = []) =>
      [...calls].filter(c => !exclude.includes(c)).sort(),
  };
};
