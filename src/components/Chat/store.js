/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { SearchChat } from 'data/api';

export default {
  chatLines: [],
  chatLineCount: 0,
  chatPage: 1,
  setChatLines: action((state, payload) => {
    state.chatLines = payload;
  }),
  setChatLineCount: action((state, payload) => {
    state.chatLineCount = payload;
  }),
  setChatPage: action((state, payload) => {
    state.chatPage = payload;
  }),
  searchChat: thunk(async (actions, payload) => {
    const chatLines = await SearchChat(payload);
    if (chatLines.ok) {
      actions.setChatLines(chatLines.data.rows);
      actions.setChatLineCount(chatLines.data.count);
    }
  }),
};
