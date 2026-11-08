// Deep diff of two api responses, sorting each difference into a kind so
// intended changes can be accepted by kind (see accepted.ts).

export type Kind =
  // same value, different JSON type ("12" vs 12, datetime string vs unix seconds)
  | 'type'
  // key only in the baseline / only in the candidate
  | 'missing'
  | 'extra'
  // null vs missing vs 0 vs ""
  | 'null'
  | 'value'
  // same elements in a different order
  | 'order'
  | 'status'
  | 'sql';

export interface Difference {
  path: string;
  kind: Kind;
  baseline?: unknown;
  candidate?: unknown;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === 0 || value === '';

// key order doesn't matter in JSON objects
const canonical = (value: unknown): string =>
  JSON.stringify(value, (_key, v: unknown) =>
    isObject(v)
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map(k => [k, v[k]]),
        )
      : v,
  );

// a datetime string and unix seconds for the same instant. Strings without a
// zone are read as both UTC and local time, since that depends on the server
const sameInstant = (text: string, seconds: number) => {
  if (!/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(text)) return false;
  const local = Date.parse(text.replace(' ', 'T'));
  const utc = /[zZ]|[+-]\d{2}:?\d{2}$/.test(text)
    ? local
    : Date.parse(`${text.replace(' ', 'T')}Z`);
  return [local, utc].some(ms => Math.abs(ms / 1000 - seconds) < 1);
};

const sameValueOtherType = (a: unknown, b: unknown) => {
  if (typeof a === 'string' && typeof b === 'number') return sameInstant(a, b);
  if (typeof b === 'string' && typeof a === 'number') return sameInstant(b, a);
  if (typeof a === 'boolean' || typeof b === 'boolean') {
    return Number(a) === Number(b) && String(a) !== '' && String(b) !== '';
  }
  return false;
};

const primitiveKind = (a: unknown, b: unknown): Kind | null => {
  if (a === b) return null;
  if (isEmpty(a) && isEmpty(b)) return 'null';
  if (typeof a !== 'object' && typeof b !== 'object') {
    if (String(a) === String(b) || sameValueOtherType(a, b)) return 'type';
  }
  return 'value';
};

const join = (path: string, key: string) =>
  /^[A-Za-z_$][\w$]*$/.test(key)
    ? path
      ? `${path}.${key}`
      : key
    : `${path}[${JSON.stringify(key)}]`;

export const diff = (
  baseline: unknown,
  candidate: unknown,
  path = '',
): Difference[] => {
  if (Array.isArray(baseline) && Array.isArray(candidate)) {
    const a = baseline.map(canonical);
    const b = candidate.map(canonical);
    if (a.join('\n') === b.join('\n')) return [];
    if (
      a.length === b.length &&
      [...a].sort().join('\n') === [...b].sort().join('\n')
    ) {
      return [{ path, kind: 'order' }];
    }
    const differences: Difference[] = [];
    for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
      const itemPath = `${path}[${i}]`;
      if (i >= b.length) {
        differences.push({
          path: itemPath,
          kind: 'missing',
          baseline: baseline[i],
        });
      } else if (i >= a.length) {
        differences.push({
          path: itemPath,
          kind: 'extra',
          candidate: candidate[i],
        });
      } else {
        differences.push(...diff(baseline[i], candidate[i], itemPath));
      }
    }
    return differences;
  }
  if (isObject(baseline) && isObject(candidate)) {
    const keys = [
      ...new Set([...Object.keys(baseline), ...Object.keys(candidate)]),
    ].sort();
    return keys.flatMap(key => {
      const keyPath = join(path, key);
      const inBaseline = key in baseline;
      const inCandidate = key in candidate;
      if (inBaseline && inCandidate) {
        return diff(baseline[key], candidate[key], keyPath);
      }
      const value = inBaseline ? baseline[key] : candidate[key];
      if (isEmpty(value)) {
        return [
          {
            path: keyPath,
            kind: 'null',
            baseline: baseline[key],
            candidate: candidate[key],
          },
        ];
      }
      return inBaseline
        ? [{ path: keyPath, kind: 'missing', baseline: value }]
        : [{ path: keyPath, kind: 'extra', candidate: value }];
    });
  }
  const kind = primitiveKind(baseline, candidate);
  return kind ? [{ path, kind, baseline, candidate }] : [];
};

const normalizeSql = (sql: string) => sql.replace(/\s+/g, ' ').trim();

// queries a handler runs in parallel arrive in any order, so this compares
// them as a set: each query only one side sent is a difference
//
// newIds are the ids a write created on each side (baseline, candidate).
// They differ because rolling back doesn't give auto increment values back.
// Queries are matched as they are first. Only the ones left over are tried
// again with the baseline's ids swapped for the candidate's, so an id that
// happens to equal some other number (eg. a kuski's) can't hide a difference
export const diffSql = (
  baseline: string[],
  candidate: string[],
  newIds: [number, number][] = [],
): Difference[] => {
  const remaining = candidate.map(normalizeSql);
  const unmatched: string[] = [];
  for (const query of baseline.map(normalizeSql)) {
    const index = remaining.indexOf(query);
    if (index === -1) {
      unmatched.push(query);
    } else {
      remaining.splice(index, 1);
    }
  }
  const differences: Difference[] = [];
  for (const query of unmatched) {
    const swapped = newIds.reduce(
      (text, [from, to]) =>
        text.replace(new RegExp(`\\b${from}\\b`, 'g'), String(to)),
      query,
    );
    const index = remaining.indexOf(swapped);
    if (index === -1) {
      differences.push({
        path: 'only in baseline',
        kind: 'sql',
        baseline: query,
      });
    } else {
      remaining.splice(index, 1);
    }
  }
  for (const query of remaining) {
    differences.push({
      path: 'only in candidate',
      kind: 'sql',
      candidate: query,
    });
  }
  return differences;
};
