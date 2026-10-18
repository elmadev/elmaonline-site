import config from 'config';

const ID = '[1-9]\\d*';

const LEV_PATTERNS = [
  { base: config.url, path: new RegExp(`^dl/level/${ID}$`) },
];

const REC_PATTERNS = [
  { base: config.url, path: new RegExp(`^dl/battlereplay/${ID}$`) },
  { base: config.url, path: new RegExp(`^dl/cupreplay/${ID}/[^/]+(/[^/]+)?$`) },
  { base: config.url, path: /^temp\/local[^/]+$/ },
  { base: config.s3Url, path: /^replays\/[\w-]+\/[^/]+\.rec$/i },
  {
    base: config.s3Url,
    path: new RegExp(`^time/[\\w-]+-[0-9a-f]+/${ID}\\.rec$`, 'i'),
  },
];

const parseUrl = url => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed : null;
  } catch {
    return null;
  }
};

const internalBases = [config.url, config.s3Url].map(parseUrl).filter(Boolean);

const isInternal = parsed =>
  internalBases.some(b => b.origin === parsed.origin);

const matchesPattern = (parsed, patterns) =>
  patterns.some(({ base, path }) => {
    const b = parseUrl(base);
    if (!b || b.origin !== parsed.origin) return false;
    if (!parsed.pathname.startsWith(b.pathname)) return false;
    return path.test(parsed.pathname.slice(b.pathname.length));
  });

const isValidQuery = (parsed, allowed = {}) => {
  if (parsed.hash) return false;
  return [...parsed.searchParams.entries()].every(
    ([key, value]) => allowed[key] && allowed[key].test(value),
  );
};

export const isValidLevUrl = url => {
  const parsed = parseUrl(url);
  if (!parsed) return false;
  if (!isInternal(parsed)) return true;
  return (
    matchesPattern(parsed, LEV_PATTERNS) &&
    isValidQuery(parsed, { UUID: /^[\w-]+$/ })
  );
};

export const isValidRecUrl = url => {
  const parsed = parseUrl(url);
  if (!parsed) return false;
  if (!isInternal(parsed)) return true;
  return (
    matchesPattern(parsed, REC_PATTERNS) && isValidQuery(parsed, { v: /^\d+$/ })
  );
};
