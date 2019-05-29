import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import ui from './ui';

export default function createRootReducer() {
  return combineReducers({
    user,
    runtime,
    ui,
  });
}
