/* eslint-disable no-console */
// Lists which endpoints in src/api.ts show up in the api snapshots, to find
// calls the smoke tests don't reach yet. Run with `yarn test:e2e:coverage`,
// add --uncovered to only list the missing ones.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'src/api.ts'), 'utf8');
const snapshotDir = join(root, 'e2e/__snapshots__');

const WILDCARD = '<<param>>';

// Reads the string or template literal starting at `start`, turning every
// ${...} (which may itself contain nested braces) into a wildcard marker.
const readLiteral = (text, start) => {
  const quote = text[start];
  let result = '';
  let i = start + 1;
  while (i < text.length && text[i] !== quote) {
    if (quote === '`' && text[i] === '$' && text[i + 1] === '{') {
      let depth = 1;
      i += 2;
      while (depth > 0 && i < text.length) {
        if (text[i] === '{') depth += 1;
        if (text[i] === '}') depth -= 1;
        i += 1;
      }
      result += WILDCARD;
    } else {
      result += text[i];
      i += 1;
    }
  }
  return result;
};

const parseEndpoints = () => {
  const endpoints = [];
  const exportRegex = /export const (\w+)\s*=/g;
  const exports = [...source.matchAll(exportRegex)];
  exports.forEach((match, index) => {
    const body = source
      .slice(match.index, exports[index + 1]?.index ?? source.length)
      // usage examples in comments aren't calls
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    // typed calls name the endpoint, ie. get('GET /replay/byUUID/:UUID', ...)
    const keyed = body.match(
      /\b(?:get|post|put|delete|patch)\(\s*'([A-Z]+) \/([^']*)'/,
    );
    const call = body.match(
      // optional type argument, ie. api.get<EndpointResponse<'GET /x'>>(
      /\b(api|apiUpload)\.(get|post|put|delete|patch)(?:<[^(]*>)?\(\s*/,
    );
    if (!keyed && !call) return;
    let method;
    let path;
    if (keyed) {
      method = keyed[1];
      path = keyed[2].replace(/:\w+/g, WILDCARD);
    } else {
      const literalStart = call.index + call[0].length;
      if (!['`', "'", '"'].includes(body[literalStart])) return;
      method = call[2].toUpperCase();
      path = readLiteral(body, literalStart)
        .split('?')[0]
        .replace(/^\/+/, '')
        // apiUpload is based on the site root, normalize to the same form as api
        .replace(/^api\//, '');
    }
    const escaped = path
      .split(WILDCARD)
      .map(part =>
        part
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          // snapshots normalize numeric path segments to :n
          .replace(/(^|\/)\d+(?=\/|$)/g, '$1(?:\\d+|:n)'),
      )
      .join('[^/]+');
    endpoints.push({
      name: match[1],
      method,
      path: path.split(WILDCARD).join('*'),
      regex: new RegExp(`^${escaped}/?$`),
    });
  });
  return endpoints;
};

const readCalls = () => {
  const calls = new Set();
  for (const file of readdirSync(snapshotDir)) {
    if (!file.endsWith('.txt')) continue;
    for (const line of readFileSync(join(snapshotDir, file), 'utf8').split(
      '\n',
    )) {
      const [method, rest] = line.split(/ (.*)/s);
      if (!rest) continue;
      calls.add(`${method} ${rest.split(' ')[0].split('?')[0]}`);
    }
  }
  return [...calls].map(call => call.split(' '));
};

// exports nothing imports, they can't be covered (and could be removed)
const isUsed = name => {
  const usage = new RegExp(`\\b${name}\\b`);
  const walk = dir =>
    readdirSync(dir, { withFileTypes: true }).some(entry => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return walk(path);
      return (
        /\.(js|jsx|ts|tsx)$/.test(entry.name) &&
        path !== join(root, 'src/api.ts') &&
        usage.test(readFileSync(path, 'utf8'))
      );
    });
  return walk(join(root, 'src'));
};

const all = parseEndpoints();
const unused = all.filter(endpoint => !isUsed(endpoint.name));
const endpoints = all.filter(endpoint => !unused.includes(endpoint));
const calls = readCalls();
const isCovered = endpoint =>
  calls.some(
    ([method, path]) => method === endpoint.method && endpoint.regex.test(path),
  );

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const covered = endpoints.filter(isCovered);
const uncovered = endpoints.filter(endpoint => !isCovered(endpoint));
const onlyUncovered = process.argv.includes('--uncovered');

for (const method of methods) {
  const all = endpoints.filter(e => e.method === method);
  if (!all.length) continue;
  const list = onlyUncovered ? uncovered : endpoints;
  console.log(`\n${method}`);
  for (const endpoint of list.filter(e => e.method === method)) {
    const mark = isCovered(endpoint) ? '✓' : '✗';
    console.log(`  ${mark} ${endpoint.path.padEnd(60)} ${endpoint.name}`);
  }
}

if (unused.length) {
  console.log('\nNot used anywhere in src (not counted)');
  for (const endpoint of unused) {
    console.log(`  - ${endpoint.path.padEnd(60)} ${endpoint.name}`);
  }
}

console.log('\nCoverage');
for (const method of methods) {
  const all = endpoints.filter(e => e.method === method);
  if (!all.length) continue;
  const hit = covered.filter(e => e.method === method).length;
  console.log(`  ${method.padEnd(7)} ${hit}/${all.length}`);
}
console.log(`  ${'total'.padEnd(7)} ${covered.length}/${endpoints.length}`);
