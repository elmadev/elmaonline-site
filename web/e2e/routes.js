// One entry per view to smoke test. Data comes from apitest.elma.online, so
// if test data disappears, swap the id/name here.
//
// name     unique test name, also used as the api snapshot file name
// path     url to visit
// anchor   optional text that should always be visible on the page
// actions  optional async (page) => {} for specific interactions the generic exploration misses
// explore  optional false to skip exploring the page, or options for explore.js ({ max, siblings, scope, text, skip })
// exploreAsGuest  also explore in the guest project (otherwise only as user), for pages that differ for guests
// mocks    optional responses for writes, eg. { 'POST upload/file': { json } }
// timeout  optional per test timeout

const battle = 155160;
const cup = 'FAE';
const kuski = 'Zero';
const level = 2;
const pack = 'Int';
const collection = 'KOPA';
const lgr = 'default';
const team = 'MiE';
const league = 'mopo';
const replay = 'qf37iupf5t';
const replayFile = 'QWQUU001_975Kop';

const tabs = (prefix, list) =>
  list.map(tab => ({ name: `${prefix}-${tab}`, tab }));

export const routes = [
  { name: 'home', path: '/' },
  { name: 'not-found', path: '/this-page-does-not-exist' },
  { name: 'error', path: '/error' },

  // battles
  { name: 'battles', path: '/battles' },
  { name: 'battles-search', path: '/battles/search' },
  { name: 'battle', path: `/battles/${battle}` },
  { name: 'chatlog', path: '/chatlog' },

  // cups
  { name: 'cups', path: '/cups' },
  { name: 'cup', path: `/cup/${cup}` },
  ...tabs('cup', ['events', 'standings', 'blog', 'rules', 'play-stats']).map(
    ({ name, tab }) => ({ name, path: `/cup/${cup}/${tab}` }),
  ),
  ...tabs('cup-event', ['results', 'leaders', 'map', 'interviews']).map(
    ({ name, tab }) => ({ name, path: `/cup/${cup}/events/1/${tab}` }),
  ),

  // battle leagues
  { name: 'battleleagues', path: '/battleleagues' },
  { name: 'battleleague', path: `/battleleagues/${league}` },

  // kuskis
  { name: 'kuskis', path: '/kuskis' },
  { name: 'kuskis-search', path: '/kuskis/search' },
  { name: 'kuski', path: `/kuskis/${kuski}` },
  ...tabs('kuski', [
    'designed-battles',
    'replays-uploaded',
    'replays-driven',
    'levels-added',
    'times',
    'records',
    'info',
  ]).map(({ name, tab }) => ({
    name,
    path: `/kuskis/${kuski}/${tab}`,
    // searching a kuski's levels for a term without matches takes ~15s on
    // apitest, longer than the app's 10s timeout
    ...(tab === 'levels-added' && { explore: { text: 'Int' } }),
  })),

  // teams
  { name: 'teams', path: '/teams' },
  { name: 'team', path: `/team/${team}` },

  // levels
  { name: 'levels', path: '/levels' },
  { name: 'levels-detailed', path: '/levels/detailed' },
  { name: 'levels-recent-records', path: '/levels/recent-records' },
  { name: 'levels-search', path: '/levels/search' },
  { name: 'levels-collections', path: '/levels/collections' },
  { name: 'levels-collection', path: `/levels/collections/${collection}` },
  { name: 'levels-add', path: '/levels/add' },
  { name: 'levels-collections-add', path: '/levels/collections/add' },
  { name: 'level', path: `/levels/${level}` },
  { name: 'levelpack', path: `/levels/packs/${pack}` },
  ...tabs('levelpack', [
    'total-times',
    'king-list',
    'record-history',
    'multi',
    'replays',
    'crippled',
    'play-stats',
  ]).map(({ name, tab }) => ({ name, path: `/levels/packs/${pack}/${tab}` })),
  {
    name: 'levelpack-personal',
    path: `/levels/packs/${pack}/personal/${kuski}`,
  },
  {
    name: 'levelpack-crippled-drunk',
    path: `/levels/packs/${pack}/crippled/drunk`,
  },

  // replays
  { name: 'replays', path: '/replays' },
  ...tabs('replays', ['battle', 'comments']).map(({ name, tab }) => ({
    name,
    path: `/replays/${tab}`,
  })),
  {
    name: 'replays-upload',
    path: '/replays/upload',
    // a successful upload response, so the page goes on to save the replay
    mocks: {
      'POST upload/replay': {
        json: {
          uuid: 'e2etest01',
          file: 'replay.rec',
          time: 12345,
          finished: 1,
          LevelIndex: 2,
          MD5: 'e2e',
        },
      },
    },
  },
  { name: 'replay', path: `/r/${replay}` },
  { name: 'replay-file', path: `/r/${replay}/${replayFile}` },
  { name: 'replay-standalone', path: '/r' },
  {
    name: 'upload',
    path: '/up',
    mocks: {
      'POST upload/file': {
        json: { uuid: 'e2etest01', file: 'replay.rec', size: 41946 },
      },
    },
  },

  // lgrs
  { name: 'lgrs', path: '/lgrs' },
  ...tabs('lgrs', ['guide', 'upload']).map(({ name, tab }) => ({
    name,
    path: `/lgrs/${tab}`,
  })),
  { name: 'lgr', path: `/lgr/${lgr}` },
  { name: 'lgr-index', path: '/lgr' },

  // misc
  { name: 'ranking', path: '/ranking' },
  { name: 'map', path: '/map' },
  { name: 'recap', path: '/recap' },
  { name: 'search', path: '/search' },
  { name: 'dat-info', path: '/dat/info' },
  // header (search bar, account menu) and sidebar are the same on every page,
  // so they're only explored here
  {
    name: 'layout-header',
    path: '/help',
    explore: { scope: 'header' },
    exploreAsGuest: true,
  },
  {
    name: 'layout-sidebar',
    path: '/help',
    // the burger collapses the menu, which would hide everything else
    explore: { scope: 'nav[aria-label="Main menu"]', skip: /^☰$/ },
  },
  { name: 'help', path: '/help' },
  { name: 'help-section', path: '/help/howtoinstall' },
  { name: 'help-subsection', path: '/help/help/programs' },
  { name: 'editor', path: '/editor' },
  { name: 'shirt', path: '/shirt' },

  // account pages, logged out
  {
    name: 'login',
    path: '/login',
    exploreAsGuest: true,
    anchor: 'Forgot password?',
    // what the api answers for a wrong password
    mocks: {
      'POST token': {
        json: { Response: { success: false, message: 'Wrong password' } },
      },
    },
  },
  { name: 'register', path: '/register', exploreAsGuest: true },
  { name: 'forgot', path: '/forgot', exploreAsGuest: true },
  { name: 'confirm', path: '/confirm/invalid-code', exploreAsGuest: true },
  { name: 'settings', path: '/settings' },
  { name: 'mod', path: '/mod' },
];

// Owned by the E2E_USER account on apitest, so the owner/admin views render.
// Writes are always mocked, so these never change.
const owned = {
  cup: 'e2e',
  pack: 'e2e',
  league: 'e2e',
  collection: 'e2e',
  lgr: 'black',
};

// admin pages have more to click through than the 20 default
const admin = { max: 50 };

// the logged in user's own profile shows more (files, latest runs etc.)
const me = process.env.E2E_USER;

const userExtras = [
  { name: 'own-kuski', path: `/kuskis/${me}` },
  ...tabs('own-kuski', ['times', 'files', 'notifications']).map(
    ({ name, tab }) => ({ name, path: `/kuskis/${me}/${tab}` }),
  ),
  ...tabs('settings', ['team', 'ignore', 'themes', 'notifications']).map(
    ({ name, tab }) => ({ name, path: `/settings/${tab}` }),
  ),
  { name: 'mod', path: '/mod', explore: admin },
  { name: 'replays-mod', path: '/replays/mod', explore: admin },
  { name: 'owned-cup', path: `/cup/${owned.cup}` },
  { name: 'owned-cup-events', path: `/cup/${owned.cup}/events` },
  { name: 'owned-cup-admin', path: `/cup/${owned.cup}/admin`, explore: admin },
  { name: 'owned-levelpack', path: `/levels/packs/${owned.pack}` },
  {
    name: 'owned-levelpack-admin',
    path: `/levels/packs/${owned.pack}/admin`,
    explore: admin,
  },
  {
    name: 'owned-battleleague',
    path: `/battleleagues/${owned.league}`,
    explore: admin,
  },
  {
    name: 'owned-collection',
    path: `/levels/collections/${owned.collection}`,
    explore: admin,
  },
  { name: 'owned-lgr', path: `/lgr/${owned.lgr}`, explore: admin },
];

// Everything again with a logged in user (only when E2E_USER/E2E_PASS are
// set), plus pages that only make sense logged in. Extras replace routes with
// the same name.
export const userRoutes = [
  ...routes.filter(route => !userExtras.some(e => e.name === route.name)),
  ...userExtras,
];
