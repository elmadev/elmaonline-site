/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { ChatLinesInRange } from 'data/api';

export default {
  chatLines: [],
  setChatLines: action((state, payload) => {
    state.chatLines = payload;
  }),
  getChatLinesInRange: thunk(async (actions, payload) => {
    const chatLines = await ChatLinesInRange(payload);

    if (chatLines.ok) {
      actions.setChatLines(chatLines.data);
    }
  }),
};
