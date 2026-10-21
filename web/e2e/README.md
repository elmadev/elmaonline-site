# Smoke tests

Playwright tests that build the site in test mode and visit every route in `routes.js` against apitest.elma.online. Each page must:

- render without uncaught errors or the router's "Something went wrong" screen
- make the same api calls as the snapshot in `__snapshots__`
- make the same calls after exploring (`explore.js`), saved in a separate `*.explore.api.txt` snapshot

The tests don't import app code, so refactors that keep pages working (React upgrades, TypeScript, tanstack-query) need no test changes. If an api change is intended, review the snapshot diff and run `yarn test:e2e:update`.

## Running

Run from `web/`. Run `npx playwright install chromium` once first.

| Command | What |
|---|---|
| `yarn test:e2e` | guest and user projects (~15 min) |
| `yarn test:e2e:guest` | guest project only |
| `yarn test:e2e:user` | user project only (logs in first) |
| `yarn test:e2e:quick` | both projects, load checks only, no exploring (a few min) |
| `yarn test:e2e:ui` | Playwright UI to step through pages |
| `yarn test:e2e:update` | rewrite the snapshots |
| `yarn test:e2e:coverage` | which endpoints in `src/api.js` appear in the snapshots |

The config is `playwright.config.js` in this folder. The built site is served on port 4173 and reused if already running, so rebuild (`yarn build --mode test`) or stop the server after changing app code.

## Projects

- **guest**: every route, logged out. Routes marked `exploreAsGuest` (login, register etc.) are explored; the rest are only load-checked.
- **user**: every route again, logged in, plus user-only routes (own profile, settings, mod and admin pages). All are explored.

The user project only runs when `E2E_USER` and `E2E_PASS` are set in `web/.env.local` (gitignored). The apitest account needs mod rights and must own the test data used by the admin routes (see `owned` in `routes.js`): cup `e2e`, level pack `e2e`, battle league `e2e`, collection `e2e` and LGR `black`.

## Exploring

`explore.js` uses a page like a user would, with no page-specific code:

- fills empty fields with plausible values (by type and name); file inputs get a file from `fixtures/`
- clicks buttons, tabs, checkboxes, radios, selects and clickable rows, and submits text inputs with enter
- explores dialogs, menus and overlays before closing them
- visits look-alike elements (eg. one per table row) once
- goes back when a click navigates away

Elements are visited in DOM order so runs are reproducible. The header and sidebar are only explored in the `layout-header` and `layout-sidebar` routes.

## Writes are never sent

All POST/PUT/DELETE requests to the api host are intercepted and answered with `{}` (or a route's `mocks`), so nothing is written to apitest. The request and its body still end up in the snapshot.

## Adding and tuning routes

Add new pages to `routes.js` (the comment at the top lists all options):

- `explore: false` skips interactions; `explore: { max, siblings, scope, text, skip }` tunes them
- `exploreAsGuest: true` also explores the page logged out
- `mocks` gives a realistic response to a write when the page needs one to continue (eg. an upload before saving)
- `actions` adds interactions the explorer can't find on its own

Other settings:

- `ignoredPageErrors` in `smokeTest.js`: known harmless page errors
- `skipWithin` in `explore.js`: widgets the explorer stays out of (eg. the replay player)
- `ignored` in `apiCapture.js`: calls left out of snapshots because their timing varies

## Coverage

`yarn test:e2e:coverage` lists which endpoints in `src/api.js` appear in the snapshots. Add `--uncovered` to show only the missing ones. Exports that nothing imports are listed separately and not counted. Use it to find flows that need `actions`, a `mocks` entry or test data on apitest.
