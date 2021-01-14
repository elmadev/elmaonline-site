/* eslint-disable no-param-reassign */
import { action } from 'easy-peasy';
import ReplayComments from 'components/ReplayComments/store';
import ReplayRating from 'components/ReplayRating/store';
import ReplaysBy from 'components/ReplaysBy/store';
import ChatView from 'components/ChatView/store';
import RecList from 'components/RecList/store';
import LevelMap from 'components/LevelMap/store';
import Register from 'pages/register/store';
import Login from 'pages/login/store';
import RankingTable from 'components/RankingTable/store';
import BattleList from 'components/BattleList/store';
import Upload from 'components/Upload/store';
import Cups from 'pages/cups/store';
import Cup from 'pages/cup/store';
import KuskiMap from 'pages/map/store';
import LevelPack from 'pages/levelpack/store';
import Search from 'pages/search/store';
import Kuski from 'pages/kuski/store';
import LevelsAdd from 'pages/levels-add/store';
import Settings from 'pages/settings/store';
import Replay from 'pages/cupreplay/store';
import ReplayByUUID from 'pages/replay/store';
import Teams from 'pages/teams/store';
import Kuskis from 'pages/kuskis/store';
import Level from 'pages/level/store';
import Mod from 'pages/mod/store';
import Battle from 'pages/battle/store';
import Levels from 'pages/levels/store';
import News from 'components/News/store';
import ReplayList from 'components/ReplayList/store';

export default {
  ReplayComments,
  ReplayRating,
  ReplaysBy,
  Register,
  BattleList,
  ChatView,
  Cups,
  Cup,
  KuskiMap,
  Kuskis,
  LevelMap,
  LevelPack,
  Search,
  Kuski,
  LevelsAdd,
  Levels,
  Settings,
  Upload,
  Mod,
  News,
  Teams,
  Replay,
  ReplayByUUID,
  RecList,
  RankingTable,
  Level,
  Battle,
  Login,
  ReplayList,
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
  },
  test: {
    derp: 'hi',
  },
};
