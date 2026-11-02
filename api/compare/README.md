# Compare

Sends the same requests to two versions of the api and diffs the responses. It's for checking that a rewritten route (eg. the TypeScript migration) returns the same data as before. Intended differences are listed in `accepted.ts` after checking that the web handles them.

The baseline is apitest.elma.online by default. It runs `dev` and uses the same test database as a local api, so a local server should answer exactly like it.

## Running

Run from `api/`.

1. `git fetch && git rebase origin/dev`, so the only differences are your own
2. `TZ=UTC yarn start` in another terminal (the candidate, `localhost:3003`). apitest runs in UTC, and some getters (eg. LGR `Added`) read datetimes in the server's timezone
3. `yarn compare --area replay`

| Option | |
|---|---|
| `--area replay,player` | only paths under `/api/replay` and `/api/player` (default: everything) |
| `--baseline <url>` | default `https://apitest.elma.online` |
| `--candidate <url>` | default `http://localhost:3003` |
| `--sql` | also diff the sql each request sends (needs a local baseline, see below) |
| `--writes` | also send POST/PUT/DELETE requests (same) |
| `--concurrency <n>` | requests at a time per server, default 4 |

The output lists each endpoint with differences that aren't accepted. It shows the kind, the path in the response, an example of the baseline and candidate values, and how many requests had it. The full list is written to `compare/report.json`. The exit code is 1 if there are differences that aren't accepted, or if more than 5% of requests failed on the baseline.

User requests log in with `E2E_USER` and `E2E_PASS` from `web/.env.local`, the same account as the e2e tests.

## Kinds of differences

| Kind | |
|---|---|
| `type` | same value, different JSON type: `"12"` vs `12`, `"1"` vs `true`, a datetime string vs unix seconds for the same moment |
| `missing` / `extra` | a key or array element only the baseline / only the candidate has |
| `null` | `null` vs missing vs `0` vs `""` |
| `value` | a different value |
| `order` | the same array elements in a different order |
| `status` | a different http status |
| `sql` | a query only one side sent (`--sql`) |

If the two responses differ, the request is sent again, and only differences that are there both times count. Endpoints whose data changes too fast for that go in `volatile` in `compare.ts`: they are listed but don't fail the run.

## Accepting a difference

Add an entry to `accepted.ts`. `endpoint` uses the contract's `'METHOD /path/:param'` keys, and `path` uses `[*]` for any array index and `*` for any key. `checkedIn` says where you checked that the web handles the new value. Entries that match nothing are listed at the end of a full run. Remove them once the change has reached `dev` (and so the baseline).

## Requests

- `corpus.txt`: every api call the e2e suite makes, with real ids. Regenerate it with `yarn test:e2e:corpus` in `web/` (a full e2e run, ~15 min) when pages start calling new endpoints.
- `manual.txt`: edge cases the web rarely sends (bad ids, odd query strings). Add some for each area before converting it, since that's where parsing changes show.

Line format: `guest|user METHOD /path?query [json body]`. Logins and uploads are never sent.

## SQL and writes

Responses don't show a handler sending different sql that returns the same rows, and writes can't be sent to apitest. For those, run both sides locally in compare mode (`COMPARE=1`, `src/utils/compare.js`):

- each request runs in a transaction that is always rolled back, so nothing is saved
- the sql of each request can be fetched by the runner
- the runner refuses `--writes` if a server has email, file storage or discord keys configured, because those aren't rolled back

```sh
yarn compare:baseline                 # origin/dev in a worktree next to this repo, on port 3004
COMPARE=1 TZ=UTC yarn start           # the candidate
yarn compare --baseline http://localhost:3004 --sql --writes --area replay
```

Never set `COMPARE=1` on a shared server: every write anyone makes would be rolled back.
