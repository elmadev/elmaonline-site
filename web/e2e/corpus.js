// Records the raw api calls of an e2e run (real ids, unnormalized) as the
// request corpus for api/compare, when E2E_CORPUS is set to a file. Each
// worker appends, the teardown dedupes and sorts. See api/compare/README.md.

import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';

const file = process.env.E2E_CORPUS;

// requests carry the token whenever someone is logged in
const who = request => {
  const auth = request.headers().authorization;
  return auth && auth !== 'undefined' ? 'user' : 'guest';
};

const body = request => {
  const data = request.postData();
  if (!data) return '';
  try {
    return ' ' + JSON.stringify(JSON.parse(data));
  } catch {
    return null;
  }
};

export const recordCorpus = request => {
  if (!file) return;
  const data = body(request);
  // uploads and other non-json bodies can't be replayed from a line
  if (data === null) return;
  const { pathname, search } = new URL(request.url());
  // logins, the compare runner logs in itself
  if (pathname === '/token') return;
  appendFileSync(
    file,
    `${who(request)} ${request.method()} ${pathname}${search}${data}\n`,
  );
};

export default () => {
  if (!file) return;
  let lines;
  try {
    lines = readFileSync(file, 'utf8').split('\n').filter(Boolean);
  } catch {
    return;
  }
  writeFileSync(file, [...new Set(lines)].sort().join('\n') + '\n');
};
