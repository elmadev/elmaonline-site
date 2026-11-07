import React, { lazy, Suspense, useMemo } from 'react';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  lazyRouteComponent,
} from '@tanstack/react-router';
import config from 'config';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { useStoreState, useStoreRehydrated } from 'easy-peasy';
import { themes, muiTheme } from './theme';
import {
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from '@mui/material/styles';
import DefaultPropsProvider from '@mui/material/DefaultPropsProvider';

const Home = lazyRouteComponent(() => import('pages/home'));
const Battle = lazyRouteComponent(() => import('pages/battle'));
const Battles = lazyRouteComponent(() => import('pages/battles'));
const ChatLog = lazyRouteComponent(() => import('pages/chatlog'));
const Confirm = lazyRouteComponent(() => import('pages/confirm'));
const Cup = lazyRouteComponent(() => import('pages/cup'));
const Cups = lazyRouteComponent(() => import('pages/cups'));
const BattleLeagues = lazyRouteComponent(() => import('pages/battleleagues'));
const BattleLeague = lazyRouteComponent(() => import('pages/battleleague'));
const Editor = lazyRouteComponent(() => import('pages/editor'));
const Error = lazyRouteComponent(() => import('pages/error'));
const ForgotPassword = lazyRouteComponent(
  () => import('pages/forgot-password'),
);
const Help = lazyRouteComponent(() => import('pages/help'));
const Kuski = lazyRouteComponent(() => import('pages/kuski'));
const Kuskis = lazyRouteComponent(() => import('pages/kuskis'));
const LGRs = lazyRouteComponent(() => import('pages/lgrs'));
const LGR = lazyRouteComponent(() => import('pages/lgr'));
const Level = lazyRouteComponent(() => import('pages/level'));
const LevelPack = lazyRouteComponent(() => import('pages/levelpack'));
const Levels = lazyRouteComponent(() => import('pages/levels'));
const LevelsAdd = lazyRouteComponent(() => import('pages/levels-add'));
const LevelsAddCollection = lazyRouteComponent(
  () => import('pages/levels-add-collection'),
);
const LevelpackCollection = lazyRouteComponent(
  () => import('pages/levelpack-collection'),
);
const Login = lazyRouteComponent(() => import('pages/login'));
const Map = lazyRouteComponent(() => import('pages/map'));
const Message = lazyRouteComponent(() => import('pages/message'));
const DatInfo = lazyRouteComponent(() => import('pages/datinfo'));
const Mod = lazyRouteComponent(() => import('pages/mod'));
const NotFound = lazyRouteComponent(() => import('pages/not-found'));
const Ranking = lazyRouteComponent(() => import('pages/ranking'));
const Register = lazyRouteComponent(() => import('pages/register'));
const ReplayStandalone = lazyRouteComponent(
  () => import('pages/replay-standalone'),
);
const Replay = lazyRouteComponent(() => import('pages/replay'));
const Replays = lazyRouteComponent(() => import('pages/replays'));
const Search = lazyRouteComponent(() => import('pages/search'));
const Settings = lazyRouteComponent(() => import('pages/settings'));
const Team = lazyRouteComponent(() => import('pages/team'));
const Teams = lazyRouteComponent(() => import('pages/teams'));
const Upload = lazyRouteComponent(() => import('pages/upload'));
const Recap = lazyRouteComponent(() => import('pages/recap'));
const ShirtEditor = lazyRouteComponent(() => import('pages/shirt'));

const TanStackRouterDevtools =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === 'production' || !config.routerDevTools
    ? () => null
    : lazy(() =>
        import('@tanstack/react-router-devtools').then(res => ({
          default: res.TanStackRouterDevtools,
        })),
      );

const Height100 = styled.div`
  height: 100%;
`;

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Height100>
        <Outlet />
      </Height100>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const battleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'battles/$BattleId',
  component: Battle,
});

const battlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'battles',
  component: function BattlesComp() {
    return <Battles tab="" />;
  },
});

const battlesSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'battles/search',
  component: function BattlesSearchComp() {
    return <Battles tab="search" />;
  },
});

const chatLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chatlog',
  component: ChatLog,
});

const confirmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirm/$confirmCode',
  component: Confirm,
});

const cupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cup/$ShortName',
  component: function CupComp() {
    return <Cup />;
  },
});

const cupTabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cup/$ShortName/$tab',
  component: function CupTabComp() {
    return <Cup />;
  },
});

const cupTabEventTabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cup/$ShortName/$tab/$eventNumber/$eventTab',
  component: function CupTabEventTabComp() {
    return <Cup />;
  },
});

const cupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cups',
  component: Cups,
});

const battleLeagueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/battleleagues/$ShortName',
  component: BattleLeague,
});

const battleLeaguesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/battleleagues',
  component: BattleLeagues,
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor',
  component: Editor,
});

const errorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/error',
  component: Error,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot',
  component: ForgotPassword,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: Help,
});

const helpSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help/$section',
  component: Help,
});

const helpSubSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help/$section/$subsection',
  component: Help,
});

const kuskiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kuskis/$name',
  component: function KuskiComp() {
    return <Kuski />;
  },
});

const kuskiTabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kuskis/$name/$tab',
  component: function KuskiTabComp() {
    return <Kuski />;
  },
});

const kuskiRecordsSortRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kuskis/$name/$tab/$recordSort',
  component: function KuskiRecordsSortComp() {
    return <Kuski />;
  },
});

const kuskisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kuskis',
  component: function KuskisComp() {
    return <Kuskis tab="" />;
  },
});

const kuskisSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kuskis/search',
  component: function KuskisSearchComp() {
    return <Kuskis tab="search" />;
  },
});

const lgrNoneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lgr',
  component: LGR,
});

const lgrRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lgr/$LGRName',
  component: LGR,
});

const lgrsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lgrs',
  component: LGRs,
});

const lgrsTabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lgrs/$tab',
  component: LGRs,
});

const levelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels',
  component: Levels,
});

const levelIdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/$LevelId',
  component: Level,
});

const levelPackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/packs/$name',
  component: function LevelPackComp() {
    return <LevelPack />;
  },
});

const levelPackTabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/packs/$name/$tab',
  component: function LevelPackTabComp() {
    return <LevelPack />;
  },
});

const levelPackSubTabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/packs/$name/$tab/$subTab',
  component: function LevelPackTabComp() {
    return <LevelPack />;
  },
});

const levelsCollectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/collections',
  component: function LevelsCollectionsComp() {
    return <Levels tab="collections" />;
  },
});

const levelsDetailedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/detailed',
  component: function LevelsDetailsComp() {
    return <Levels tab="" detailed={1} />;
  },
});

const levelsRecentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/recent-records',
  component: function LevelsRecentComp() {
    return <Levels tab="recent-records" />;
  },
});

const levelsSearch = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/search',
  component: function LevelsSearchComp() {
    return <Levels tab="search" />;
  },
});

const levelsAddRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/add',
  component: LevelsAdd,
});

const levelsAddCollectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/collections/add',
  component: LevelsAddCollection,
});

const levelpackCollectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/levels/collections/$name',
  component: LevelpackCollection,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const messageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/message',
  component: function MessageComp() {
    return <Message />;
  },
});

const messageConversationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/message/$ConversationIndex',
  component: function MessageComp() {
    return <Message />;
  },
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/map',
  component: Map,
});

const modRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mod',
  component: Mod,
});

const rankingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ranking',
  component: Ranking,
});

const recapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recap',
  component: Recap,
});

const shirtRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shirt',
  component: ShirtEditor,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});

const standaloneReplayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/r',
  component: ReplayStandalone,
});

const replayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/r/$ReplayUuid',
  component: Replay,
});

const replayNameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/r/$ReplayUuid/$RecFileName',
  component: Replay,
});

const replaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/replays',
  component: Replays,
});

const replaysTabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/replays/$tab',
  component: Replays,
});

const datInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dat/info',
  component: DatInfo,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: Search,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: function SettingsComp() {
    return <Settings />;
  },
});

const settingsTabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings/$tab',
  component: function SettingsComp() {
    return <Settings />;
  },
});

const teamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/team/$TeamName',
  component: Team,
});

const teamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teams',
  component: Teams,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/up',
  component: Upload,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  battleRoute,
  battlesRoute,
  battlesSearchRoute,
  chatLogRoute,
  confirmRoute,
  cupRoute,
  cupTabRoute,
  cupTabEventTabRoute,
  cupsRoute,
  battleLeagueRoute,
  battleLeaguesRoute,
  editorRoute,
  errorRoute,
  forgotPasswordRoute,
  helpRoute,
  helpSectionRoute,
  helpSubSectionRoute,
  kuskiRoute,
  kuskiTabRoute,
  kuskiRecordsSortRoute,
  kuskisRoute,
  kuskisSearchRoute,
  lgrNoneRoute,
  lgrRoute,
  lgrsRoute,
  lgrsTabRoute,
  levelsRoute,
  levelIdRoute,
  levelPackRoute,
  levelPackTabRoute,
  levelPackSubTabRoute,
  levelsCollectionsRoute,
  levelsDetailedRoute,
  levelsRecentRoute,
  levelsSearch,
  levelsAddRoute,
  levelsAddCollectionRoute,
  levelpackCollectionRoute,
  loginRoute,
  mapRoute,
  messageRoute,
  messageConversationRoute,
  modRoute,
  rankingRoute,
  recapRoute,
  shirtRoute,
  registerRoute,
  standaloneReplayRoute,
  replayRoute,
  replayNameRoute,
  replaysRoute,
  replaysTabRoute,
  datInfoRoute,
  searchRoute,
  settingsRoute,
  settingsTabRoute,
  teamRoute,
  teamsRoute,
  uploadRoute,
]);

export const router = createRouter({
  routeTree,
  // A page's code starts downloading when a link to it is hovered or touched
  defaultPreload: 'intent',
  defaultNotFoundComponent: () => <NotFound />,
});

const Routes = () => {
  const isRehydrated = useStoreRehydrated();
  const {
    settings: { siteTheme },
  } = useStoreState(state => state.Settings);
  const theme = useMemo(() => muiTheme(siteTheme), [siteTheme]);
  if (!isRehydrated) return null;
  return (
    <MuiThemeProvider theme={{ [THEME_ID]: theme }}>
      {/* mui v5 skips theme defaultProps when the theme is scoped with THEME_ID */}
      <DefaultPropsProvider value={theme.components}>
        <ThemeProvider theme={themes[siteTheme]}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </DefaultPropsProvider>
    </MuiThemeProvider>
  );
};

export default Routes;
