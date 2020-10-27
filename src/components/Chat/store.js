/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { ChatLines, ChatLinesBy } from 'data/api';

export default {
  chatLines: [],
  setChatLines: action((state, payload) => {
    state.chatLines = payload;
  }),
  getChatLines: thunk(async (actions, payload) => {
    const chatLines = await ChatLines(payload);
    if (chatLines.ok) {
      actions.setChatLines(chatLines.data);
    }
  }),
  getChatLinesBy: thunk(async (actions, payload) => {
    const chatLines = await ChatLinesBy(payload);
    if (chatLines.ok) {
      actions.setChatLines(chatLines.data);
    }
  }),
};
