// Sends the same requests to two api versions and diffs the responses, so a
// rewrite of a route can be checked against the old one. See README.md.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { diff, diffSql, type Difference } from './diff.ts';
import { accepted } from './accepted.ts';

// endpoints whose data changes so often that even the second try differs.
// Their differences are listed but don't fail the run. Same keys as accepted.ts
const volatile: string[] = ['GET /replay/random'];

const { values: options } = parseArgs({
  options: {
    baseline: { type: 'string', default: 'https://apitest.elma.online' },
    candidate: { type: 'string', default: 'http://localhost:3003' },
    // only requests under these paths, eg. --area replay,player
    area: { type: 'string' },
    // also diff the sql each request sends (both servers in compare mode)
    sql: { type: 'boolean', default: false },
    // also send writes (both servers in compare mode, implies --sql)
    writes: { type: 'boolean', default: false },
    concurrency: { type: 'string', default: '4' },
  },
});

const baseline = options.baseline.replace(/\/$/, '');
const candidate = options.candidate.replace(/\/$/, '');
const withSql = options.sql || options.writes;

interface Request {
  line: string;
  who: 'guest' | 'user';
  method: string;
  path: string;
  body?: string;
}

interface Response {
  status: number;
  body: unknown;
}

const fail = (message: string): never => {
  console.error(message);
  process.exit(2);
};

// ---------------------------------------------------------------------------
// requests

const readCorpus = (file: string): Request[] => {
  const url = new URL(file, import.meta.url);
  if (!existsSync(url)) return [];
  return readFileSync(url, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const match = line.match(/^(guest|user) ([A-Z]+) (\S+)(?: (.+))?$/);
      if (!match) return fail(`${file}: can't parse "${line}"`);
      const [, who, method, path, body] = match;
      return { line, who: who as Request['who'], method, path, body };
    });
};

// writes that leave the database (file storage, uploads) or that the runner
// makes itself
const neverSent = [
  /^POST (\/api)?\/token([?]|$)/,
  /^\w+ (\/api)?\/upload([/?]|$)/,
];

const inArea = (request: Request) => {
  if (!options.area) return true;
  const { pathname } = new URL(request.path, 'http://x');
  return options.area
    .split(',')
    .some(area => new RegExp(`^(/api)?/${area}([/?]|$)`).test(pathname));
};

const requests = [
  ...new Map(
    [...readCorpus('corpus.txt'), ...readCorpus('manual.txt')].map(r => [
      r.line,
      r,
    ]),
  ).values(),
]
  .filter(inArea)
  .filter(r => r.method === 'GET' || options.writes)
  .filter(r => !neverSent.some(regex => regex.test(`${r.method} ${r.path}`)));

if (!requests.length) fail('No requests to send, check --area.');

// ---------------------------------------------------------------------------
// endpoints and accepted differences

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// the request's path relative to /api, like the contract's keys
const route = (request: Request) => {
  const { pathname } = new URL(request.path, 'http://x');
  return pathname.startsWith('/api/') ? pathname.slice(4) : pathname;
};

const endpointMatches = (endpoint: string, request: Request) => {
  const [method, path] = endpoint.split(' ');
  const regex = new RegExp(
    `^${path
      .split(/(:\w+)/)
      .map(part => (part.startsWith(':') ? '[^/]+' : escape(part)))
      .join('')}/?$`,
  );
  return method === request.method && regex.test(route(request));
};

const pathMatches = (pattern: string | undefined, path: string) =>
  pattern === undefined ||
  new RegExp(
    `^${pattern
      .split(/(\[\*\]|\*)/)
      .map(part =>
        part === '[*]' ? '\\[\\d+\\]' : part === '*' ? '[^.[]+' : escape(part),
      )
      .join('')}$`,
  ).test(path);

const usedAccepted = new Set<number>();

const isAccepted = (request: Request, difference: Difference) => {
  const index = accepted.findIndex(
    a =>
      a.kind === difference.kind &&
      endpointMatches(a.endpoint, request) &&
      pathMatches(a.path, difference.path),
  );
  if (index === -1) return false;
  usedAccepted.add(index);
  return true;
};

const isVolatile = (request: Request) =>
  volatile.some(endpoint => endpointMatches(endpoint, request));

// requests to the same endpoint with other ids are grouped in the output
const shape = (request: Request) =>
  `${request.method} ${new URL(request.path, 'http://x').pathname
    .split('/')
    .map(segment => (/^\d+(,\d+)*$/.test(segment) ? ':n' : segment))
    .join('/')}`;

// ---------------------------------------------------------------------------
// servers

// GET /__compare/status, see src/utils/compare.js
interface CompareStatus {
  compare: boolean;
  external: boolean;
}

const checkCompareMode = async (server: string) => {
  const status = await fetch(`${server}/__compare/status`)
    .then(r => (r.ok ? (r.json() as Promise<CompareStatus>) : null))
    .catch(() => null);
  if (!status?.compare) {
    return fail(`${server} isn't in compare mode, start it with COMPARE=1.`);
  }
  if (options.writes && status.external) {
    fail(
      `${server} has email, file storage or discord configured, writes could reach them. Remove the keys from config.local.js.`,
    );
  }
};

const checkUp = async (server: string) => {
  await fetch(server, { signal: AbortSignal.timeout(10000) }).catch(() =>
    fail(`Can't reach ${server}.`),
  );
};

const login = async (server: string) => {
  const response = await fetch(`${server}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kuski: process.env.E2E_USER,
      password: process.env.E2E_PASS,
    }),
  })
    .then(r => r.json() as Promise<{ Response?: { token?: string } }>)
    .catch(() => null);
  const token = response?.Response?.token;
  if (!token) fail(`Login as ${process.env.E2E_USER} failed on ${server}.`);
  return token as string;
};

const send = async (
  server: string,
  token: string | undefined,
  request: Request,
  compareId?: string,
): Promise<Response> => {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (request.who === 'user' && token) headers.Authorization = token;
  if (request.body) headers['Content-Type'] = 'application/json';
  if (compareId) headers['x-compare-id'] = compareId;
  try {
    const response = await fetch(`${server}${request.path}`, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'manual',
      signal: AbortSignal.timeout(30000),
    });
    const text = await response.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {
      // not json, compare the text
    }
    return { status: response.status, body };
  } catch (error) {
    return { status: 0, body: String(error) };
  }
};

const sentSql = (server: string, compareId: string) =>
  fetch(`${server}/__compare/sql/${compareId}`)
    .then(r => r.json() as Promise<string[] | null>)
    .catch(() => null);

// ---------------------------------------------------------------------------
// run

const userRequests = requests.some(r => r.who === 'user');
if (userRequests) {
  try {
    process.loadEnvFile(new URL('../../web/.env.local', import.meta.url));
  } catch {
    // no .env.local
  }
  if (!process.env.E2E_USER || !process.env.E2E_PASS) {
    fail(
      'Set E2E_USER and E2E_PASS in web/.env.local, they are used for user requests.',
    );
  }
}

try {
  execFileSync('git', ['merge-base', '--is-ancestor', 'origin/dev', 'HEAD'], {
    stdio: 'ignore',
  });
} catch {
  console.warn(
    "Warning: this branch doesn't contain origin/dev, changes merged since it was branched show up as differences. Run git fetch && git rebase origin/dev.\n",
  );
}

await Promise.all([checkUp(baseline), checkUp(candidate)]);
if (withSql) {
  await Promise.all([checkCompareMode(baseline), checkCompareMode(candidate)]);
}
const [baselineToken, candidateToken] = userRequests
  ? await Promise.all([login(baseline), login(candidate)])
  : [];

interface Result {
  request: Request;
  differences: Difference[];
  baselineError?: string;
}

const compareOnce = async (request: Request): Promise<Result> => {
  const ids = withSql ? [randomUUID(), randomUUID()] : [];
  const [a, b] = await Promise.all([
    send(baseline, baselineToken, request, ids[0]),
    send(candidate, candidateToken, request, ids[1]),
  ]);
  if (a.status === 0 || a.status >= 500) {
    return {
      request,
      differences: [],
      baselineError: `${a.status} ${String(a.body).slice(0, 100)}`,
    };
  }
  const bodyDifferences = a.status === b.status ? diff(a.body, b.body) : [];
  const newIds = bodyDifferences
    .filter(d => isNewId(request, d))
    .map(d => [d.baseline, d.candidate] as [number, number]);
  const differences =
    a.status === b.status
      ? bodyDifferences.filter(d => !isNewId(request, d))
      : [
          {
            path: '',
            kind: 'status' as const,
            baseline: a.status,
            candidate: b.status,
          },
        ];
  if (withSql) {
    const [sqlA, sqlB] = await Promise.all([
      sentSql(baseline, ids[0]),
      sentSql(candidate, ids[1]),
    ]);
    differences.push(...diffSql(sqlA ?? [], sqlB ?? [], newIds));
  }
  return { request, differences };
};

// rows inserted by a write get a different id on each side, because rolling
// back doesn't give auto increment values back
const isNewId = (request: Request, difference: Difference) =>
  request.method !== 'GET' &&
  difference.kind === 'value' &&
  /Index$/.test(difference.path) &&
  typeof difference.baseline === 'number' &&
  typeof difference.candidate === 'number';

// data can change between the two calls (chat, battles of today), so a
// difference only counts if it's there the second time too
const compare = async (request: Request) => {
  const first = await compareOnce(request);
  if (!first.differences.length && !first.baselineError) return first;
  return compareOnce(request);
};

const results: Result[] = [];
const queue = [...requests];
const progress = () => {
  if (process.stderr.isTTY) {
    process.stderr.write(`\r${results.length}/${requests.length}`);
  }
};
await Promise.all(
  Array.from({ length: Number(options.concurrency) }, async () => {
    for (let request = queue.shift(); request; request = queue.shift()) {
      results.push(await compare(request));
      progress();
    }
  }),
);
if (process.stderr.isTTY) process.stderr.write('\r\x1b[K');

// ---------------------------------------------------------------------------
// report

const show = (value: unknown) => {
  if (value === undefined) return '(none)';
  const text = JSON.stringify(value) ?? String(value);
  return text.length > 60 ? `${text.slice(0, 57)}...` : text;
};

interface Group {
  shape: string;
  path: string;
  kind: string;
  count: number;
  example: Request;
  difference: Difference;
  volatile: boolean;
}

const groups = new Map<string, Group>();
const failing: { request: string; differences: Difference[] }[] = [];
for (const { request, differences } of results) {
  const open = differences.filter(d => !isAccepted(request, d));
  if (!open.length) continue;
  failing.push({ request: request.line, differences: open });
  for (const difference of open) {
    const path = difference.path.replace(/\[\d+\]/g, '[*]');
    const key = `${shape(request)}|${path}|${difference.kind}`;
    const group = groups.get(key);
    if (group) {
      group.count += 1;
    } else {
      groups.set(key, {
        shape: shape(request),
        path,
        kind: difference.kind,
        count: 1,
        example: request,
        difference,
        volatile: isVolatile(request),
      });
    }
  }
}

const byShape = Map.groupBy(groups.values(), g => g.shape);
for (const [endpoint, list] of [...byShape].sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  if (list[0].volatile) {
    console.log(
      `${endpoint} (volatile, ${list.length} differences, not counted)\n`,
    );
    continue;
  }
  console.log(endpoint);
  for (const g of list) {
    const values = `${show(g.difference.baseline)} -> ${show(g.difference.candidate)}`;
    console.log(
      `  ${g.kind.padEnd(7)} ${(g.path || '(root)').padEnd(30)} ${values}  x${g.count}`,
    );
  }
  console.log(`  eg. ${list[0].example.line}\n`);
}

const baselineErrors = results.filter(r => r.baselineError);
for (const r of baselineErrors) {
  console.log(`baseline error: ${r.request.line} ${r.baselineError}`);
}

const unused = options.area
  ? []
  : accepted.filter((_a, index) => !usedAccepted.has(index));
for (const a of unused) {
  console.log(`unused accepted entry: ${a.endpoint} ${a.path ?? ''} ${a.kind}`);
}

writeFileSync(
  new URL('report.json', import.meta.url),
  JSON.stringify(
    {
      baseline,
      candidate,
      requests: requests.length,
      failing,
      baselineErrors: baselineErrors.map(r => ({
        request: r.request.line,
        error: r.baselineError,
      })),
      unusedAccepted: unused,
    },
    null,
    2,
  ),
);

const failingEndpoints = new Set(
  [...groups.values()].filter(g => !g.volatile).map(g => g.shape),
);
console.log(
  `${requests.length} requests, ${failing.length} with differences on ${byShape.size} endpoints, ${baselineErrors.length} baseline errors. Details in compare/report.json`,
);
// a few baseline errors are apitest having a bad moment, many mean the run
// says little
const tooManyErrors = baselineErrors.length > requests.length * 0.05;
process.exit(failingEndpoints.size || tooManyErrors ? 1 : 0);
