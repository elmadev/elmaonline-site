import { TOGGLE_SIDEBAR } from '../constants';

const initialState = {
  sidebarVisible: true,
};

export default function ui(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      return {
        ...state,
        sidebarVisible: !state.sidebarVisible,
      };
    }
    default:
      return state;
  }
}
