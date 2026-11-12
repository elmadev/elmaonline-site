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
  // {
  //   endpoint: 'GET /replay/byUUID/:UUID',
  //   path: 'Uploaded',
  //   kind: 'type',
  //   reason: 'datetime string -> unix seconds',
  //   checkedIn: 'web/src/pages/replay/ReplayInfo.tsx',
  // },
];
