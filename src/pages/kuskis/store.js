/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { Players } from 'data/api';

export default {
  playerList: [],
  setPlayerList: action((state, payload) => {
    state.playerList = payload;
  }),
  getPlayers: thunk(async actions => {
    const players = await Players();

    if (players.ok) {
      actions.setPlayerList(players.data);
    }
  }),
};
