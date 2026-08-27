import { action, persist } from 'easy-peasy';
import ReplayComments from 'features/ReplayComments/store';
import ReplayRating from 'features/ReplayRating/store';
import ChatView from 'features/ChatView/store';
import RecList from 'features/RecList/store';
import LevelMap from 'features/LevelMap/store';
import Register from 'pages/register/store';
import Login from 'pages/login/store';
import RankingTable from 'features/RankingTable/store';
import BattleList from 'features/BattleList/store';
import BattleLeagues from 'pages/battleleagues/store';
import BattleLeague from 'pages/battleleague/store';
import Upload from 'features/Upload/store';
import Cups from 'pages/cups/store';
import Cup from 'pages/cup/store';
import KuskiMap from 'pages/map/store';
import LevelPack from 'pages/levelpack/store';
import Search from 'pages/search/store';
import Kuski from 'pages/kuski/store';
import LGR from 'pages/lgr/store';
import LGRList from 'features/LGRList/store';
import LGRUpload from 'features/LGRUpload/store';
import LGRComments from 'features/LGRComments/store';
import LevelsAdd from 'pages/levels-add/store';
import LevelsAddCollection from 'pages/levels-add-collection/store';
import LevelpackCollection from 'pages/levelpack-collection/store';
import LevelPackList from 'features/LevelPackList/store';
import Settings from 'pages/settings/store';
import ReplayByUUID from 'pages/replay/store';
import Teams from 'pages/teams/store';
import Kuskis from 'pages/kuskis/store';
import Help from 'pages/help/store';
import Level from 'pages/level/store';
import Mod from 'pages/mod/store';
import Replays from 'pages/replays/store';
import Battle from 'pages/battle/store';
import Levels from 'pages/levels/store';
import News from 'features/News/store';
import FileUpload from 'pages/upload/store';
import ReplayList from 'features/ReplayList/store';
import LevelList from 'features/LevelList/store';
import ReplaySettings from 'features/ReplaySettings/store';
import Notifications from 'features/Notifications/store';
import ReplayCommentArchive from 'features/ReplayCommentArchive/store';
import Recap from 'pages/recap/store';
import DatInfo from 'pages/datinfo/store';
import LevelCollectionStats from 'features/LevelCollectionStats/store';
import GenericUpload from 'features/GenericUpload/store';

export default {
  LevelCollectionStats,
  ReplayCommentArchive,
  ReplayComments,
  ReplayRating,
  Register,
  BattleList,
  BattleLeagues,
  BattleLeague,
  ChatView,
  Cups,
  Cup,
  KuskiMap,
  Kuskis,
  LevelMap,
  LevelPack,
  Search,
  Kuski,
  Help,
  LevelList,
  LGR,
  LGRList,
  LGRUpload,
  LGRComments,
  LevelsAdd,
  LevelsAddCollection,
  LevelpackCollection,
  Levels,
  LevelPackList,
  Settings,
  Upload,
  Mod,
  News,
  Teams,
  DatInfo,
  ReplayByUUID,
  RecList,
  RankingTable,
  ReplaySettings,
  Level,
  Battle,
  Login,
  ReplayList,
  FileUpload,
  Replays,
  Notifications,
  Recap,
  GenericUpload,
  Page: {
    sideBarVisible: true,
    showSideBar: action(state => {
      state.sideBarVisible = true;
    }),
    hideSideBar: action(state => {
      state.sideBarVisible = false;
    }),
    toggleSideBar: action(state => {
      state.sideBarVisible = !state.sideBarVisible;
    }),
    sideBar: persist(
      {
        menu: [
          {
            header: 'Playing',
            expanded: true,
          },
          {
            header: 'Community',
            expanded: true,
          },
          {
            header: 'Competitions',
            expanded: true,
          },
          {
            header: 'Tools',
            expanded: true,
          },
        ],
      },
      { storage: 'localStorage' },
    ),
    setExpanded: action((state, payload) => {
      const index = state.sideBar.menu.findIndex(m => m.header === payload);
      state.sideBar.menu[index].expanded = !state.sideBar.menu[index].expanded;
    }),
    extras: persist(
      {
        extrasTab: 'install',
        setExtrasTab: action((state, payload) => {
          state.extrasTab = payload;
        }),
      },
      { storage: 'localStorage' },
    ),
    cards: persist(
      {
        hidden: {
          battles: false,
          replays: false,
          ranking: false,
          events: false,
          levelpacks: false,
          news: false,
          extras: false,
        },
        setHidden: action((state, payload) => {
          state.hidden[payload] = true;
        }),
        setShown: action((state, payload) => {
          state.hidden[payload] = false;
        }),
      },
      { storage: 'localStorage' },
    ),
  },
  test: {
    derp: 'hi',
  },
};
