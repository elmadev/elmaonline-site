import React, { lazy, Suspense } from 'react';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import config from 'config';
import Home from 'pages/home';
import Battle from 'pages/battle';
import Battles from 'pages/battles';
import ChatLog from 'pages/chatlog';
import Confirm from 'pages/confirm';
import Cup from 'pages/cup';
import Cups from 'pages/cups';
import BattleLeagues from 'pages/battleleagues';
import BattleLeague from 'pages/battleleague';
import Editor from 'pages/editor';
import Error from 'pages/error';
import ForgotPassword from 'pages/forgot-password';
import Help from 'pages/help';
import Kuski from 'pages/kuski';
import Kuskis from 'pages/kuskis';
import LGRs from 'pages/lgrs';
import LGR from 'pages/lgr';
import Level from 'pages/level';
import LevelPack from 'pages/levelpack';
import Levels from 'pages/levels';
import LevelsAdd from 'pages/levels-add';
import LevelsAddCollection from 'pages/levels-add-collection';
import LevelpackCollection from 'pages/levelpack-collection';
import Login from 'pages/login';
import Map from 'pages/map';
import DatInfo from 'pages/datinfo';
import Mod from 'pages/mod';
import NotFound from 'pages/not-found';
import Ranking from 'pages/ranking';
import Register from 'pages/register';
import ReplayStandalone from 'pages/replay-standalone';
import Replay from 'pages/replay';
import Replays from 'pages/replays';
import Search from 'pages/search';
import Settings from 'pages/settings';
import Team from 'pages/team';
import Teams from 'pages/teams';
import Upload from 'pages/upload';
import Recap from 'pages/recap';
import ShirtEditor from 'pages/shirt';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { useStoreState, useStoreRehydrated } from 'easy-peasy';
import { themes, muiTheme } from './theme';
import { MuiThemeProvider } from '@material-ui/core/styles';

const TanStackRouterDevtools =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === 'production' || !config.routerDevTools
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then(res => ({
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

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <NotFound />,
});

const Routes = () => {
  const isRehydrated = useStoreRehydrated();
  const {
    settings: { siteTheme },
  } = useStoreState(state => state.Settings);
  if (!isRehydrated) return null;
  return (
    <MuiThemeProvider theme={muiTheme(siteTheme)}>
      <ThemeProvider theme={themes[siteTheme]}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default Routes;
