import { action, thunk } from 'easy-peasy';
import { Teams, TeamMembers } from 'api';
import { omit } from 'lodash';

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
  teamData: null,
  setTeamMembers: action((state, payload) => {
    state.teamMembers = payload;
  }),
  setTeamData: action((state, payload) => {
    state.teamData = payload;
  }),
  getTeamMembers: thunk(async (actions, payload) => {
    const members = await TeamMembers(payload);
    if (members.ok) {
      actions.setTeamMembers(members.data.Members);
      actions.setTeamData(omit(members.data, ['Members']));
    }
  }),
};
