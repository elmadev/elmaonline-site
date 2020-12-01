/* eslint-disable no-param-reassign */
import { action } from 'easy-peasy';
import ReplayComments from 'components/ReplayComments/store';
import ReplayRating from 'components/ReplayRating/store';
import ReplaysBy from 'components/ReplaysBy/store';
import Register from 'components/Register/store';
import ChatView from 'components/ChatView/store';
import RecList from 'components/RecList/store';
import Cups from 'pages/cups/store';
import Cup from 'pages/cup/store';
import KuskiMap from 'pages/map/store';
import LevelPack from 'pages/levelpack/store';
import Search from 'pages/search/store';
import Kuski from 'pages/kuski/store';
import LevelsAdd from 'pages/levels-add/store';
import Settings from 'pages/settings/store';
import Replay from 'pages/cupreplay/store';
import Teams from 'pages/teams/store';
import Kuskis from 'pages/kuskis/store';
import Level from 'pages/level/store';
import Mod from 'pages/mod/store';

export default {
  ReplayComments,
  ReplayRating,
  ReplaysBy,
  Register,
  ChatView,
  Cups,
  Cup,
  KuskiMap,
  Kuskis,
  LevelPack,
  Search,
  Kuski,
  LevelsAdd,
  Settings,
  Mod,
  Teams,
  Replay,
  RecList,
  Level,
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
