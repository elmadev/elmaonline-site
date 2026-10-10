// One entry per view to smoke test. Data comes from apitest.elma.online, so
// if test data disappears, swap the id/name here.
//
// name     unique test name, also used as the api snapshot file name
// path     url to visit
// anchor   optional text that should always be visible on the page
// actions  optional async (page) => {} to trigger calls that only happen on interaction
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
  ]).map(({ name, tab }) => ({ name, path: `/kuskis/${kuski}/${tab}` })),

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
    name: 'levelpack-crippled-drunk',
    path: `/levels/packs/${pack}/crippled/drunk`,
  },

  // replays
  { name: 'replays', path: '/replays' },
  ...tabs('replays', ['battle', 'comments', 'upload']).map(({ name, tab }) => ({
    name,
    path: `/replays/${tab}`,
  })),
  { name: 'replay', path: `/r/${replay}` },
  { name: 'replay-file', path: `/r/${replay}/${replayFile}` },
  { name: 'replay-standalone', path: '/r' },
  { name: 'upload', path: '/up' },

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
  { name: 'help', path: '/help' },
  { name: 'help-section', path: '/help/howtoinstall' },
  { name: 'help-subsection', path: '/help/help/programs' },
  { name: 'editor', path: '/editor', timeout: 120000 },
  { name: 'shirt', path: '/shirt', timeout: 120000 },

  // account pages, logged out
  { name: 'login', path: '/login', anchor: 'Forgot password?' },
  { name: 'register', path: '/register' },
  { name: 'forgot', path: '/forgot' },
  { name: 'confirm', path: '/confirm/invalid-code' },
  { name: 'settings', path: '/settings' },
  { name: 'mod', path: '/mod' },
];

// Re-run with a logged in user (only when E2E_USER/E2E_PASS are set)
export const userRoutes = [
  { name: 'home', path: '/' },
  { name: 'kuski', path: `/kuskis/${kuski}` },
  { name: 'settings', path: '/settings' },
  ...tabs('settings', ['team', 'ignore', 'themes', 'notifications']).map(
    ({ name, tab }) => ({ name, path: `/settings/${tab}` }),
  ),
  { name: 'upload', path: '/up' },
  { name: 'levels-add', path: '/levels/add' },
  { name: 'mod', path: '/mod' },
];
