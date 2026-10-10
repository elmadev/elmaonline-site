// Records which API calls a page makes, independent of whether they come from
// easy-peasy, tanstack-query or anything else, so the set can be snapshotted
// and compared across refactors.

// Calls whose presence depends on render timing (eg. level thumbnails loaded
// when scrolled into view) rather than on the data fetching code.
const ignored = [/\/api\/level\/leveldata\//];

const isApi = request => {
  if (!['fetch', 'xhr'].includes(request.resourceType())) return false;
  const { pathname } = new URL(request.url());
  return (
    pathname.includes('/api/') && !ignored.some(regex => regex.test(pathname))
  );
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
    .replace(/\b1\d{9}\b/g, '<timestamp>');

const normalizeSegment = segment =>
  normalizeDates(segment).replace(/^\d+$/, ':n');

const normalizeBody = request => {
  const data = request.postData();
  if (!data) return '';
  try {
    return ' ' + normalizeDates(JSON.stringify(sortKeys(JSON.parse(data))));
  } catch {
    return ' <non-json body>';
  }
};

export const describeRequest = request => {
  const url = new URL(request.url());
  const path = url.pathname
    .replace(/^.*?\/api\//, '')
    .split('/')
    .map(segment => normalizeSegment(decodeURIComponent(segment)))
    .join('/');
  const query = [...url.searchParams.entries()]
    .map(([key, value]) => `${key}=${normalizeDates(value)}`)
    .sort()
    .join('&');
  return `${request.method()} ${path}${query ? `?${query}` : ''}${normalizeBody(request)}`;
};

export const captureApi = async page => {
  const calls = new Set();
  const pending = new Set();
  const failures = [];
  const done = request => pending.delete(request);
  page.on('request', request => {
    if (!['fetch', 'xhr'].includes(request.resourceType())) return;
    pending.add(request);
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
  await page.route('**/api/**', route =>
    route.request().method() === 'GET'
      ? route.fallback()
      : route.fulfill({ json: {} }),
  );
  return {
    // wait until no fetch/xhr is in flight, nothing new has been requested and
    // the main thread hasn't been busy for a while, so calls chained after slow
    // responses or heavy renders are included
    settle: async (quietMs = 2000, maxMs = 45000) => {
      const start = Date.now();
      let quietSince = Date.now();
      let count = calls.size;
      while (Date.now() - start < maxMs) {
        const tick = Date.now();
        // resolves on the next frame, so it's slow when the main thread is busy
        await page.evaluate(
          () => new Promise(resolve => requestAnimationFrame(resolve)),
        );
        const busy = Date.now() - tick > 250;
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
    snapshot: () => [...calls].sort().join('\n') + '\n',
  };
};
