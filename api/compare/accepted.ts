// Differences between the baseline and the candidate that are intended.
// Only add one after checking that the web code using the field handles the
// new value, and say where in `checkedIn`. `yarn compare` lists entries that
// no longer match anything, remove those once the change is on dev.
import type { Kind } from './diff.ts';

export interface Accepted {
  // 'METHOD /path/:param', the same keys as the contract's *Endpoints.
  // Paths are relative to /api, other routes start with their own prefix
  // ('POST /token')
  endpoint: string;
  // where in the response, eg. 'rows[*].Added' or '[*].KuskiData.Country'.
  // [*] is any array index and * any key. Leave out to match every path
  path?: string;
  kind: Kind;
  reason: string;
  checkedIn: string;
}

export const accepted: Accepted[] = [
  {
    endpoint: 'GET /replay/byUUID/:UUID',
    path: 'Uploaded',
    kind: 'type',
    reason: 'unix seconds as a string -> number, it is used as number any way',
    checkedIn:
      'web/src/features/ReplayCommentArchive/index.jsx (Uploaded * 1000), web/src/pages/search/index.jsx (date={r.Uploaded})',
  },
  {
    endpoint: 'GET /replay/byLevelIndex/:LevelIndex',
    path: '[*].Uploaded',
    kind: 'type',
    reason: 'unix seconds as a string -> number, it is used as number any way',
    checkedIn:
      'web/src/features/ReplayCommentArchive/index.jsx (Uploaded * 1000), web/src/pages/search/index.jsx (date={r.Uploaded})',
  },
  {
    endpoint: 'GET /replay/byUUID/:UUID',
    path: 'Finished',
    kind: 'value',
    reason:
      'cup time replays sent the raw letter ("F"), now 1/0 like every other replay',
    checkedIn:
      'web never reads Finished from replay endpoints, only sends it in features/Upload/index.jsx',
  },
  {
    endpoint: 'GET /replay/byLevelIndex/:LevelIndex',
    path: '[*]',
    kind: 'missing',
    reason:
      'a non-numeric LevelIndex returns [] instead of MySQL coercing it to level 0',
    checkedIn: 'web only requests this with a numeric level index',
  },
];
