/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { Teams, TeamMembers } from 'data/api';

export default {
  teams: [],
  setTeams: action((state, payload) => {
    state.teams = payload;
  }),
  getTeams: thunk(async actions => {
    const get = await Teams();
    if (get.ok) {
      actions.setTeams(get.data);
    }
  }),
  teamMembers: [],
  setTeamMembers: action((state, payload) => {
    state.teamMembers = payload;
  }),
  getTeamMembers: thunk(async (actions, payload) => {
    const members = await TeamMembers(payload);
    if (members.ok) {
      actions.setTeamMembers(members.data.Members);
    }
  }),
};
