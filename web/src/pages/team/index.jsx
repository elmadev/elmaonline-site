import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import Header from 'components/Header';
import Kuski from 'components/Kuski';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ListCell, ListContainer, ListRow } from 'components/List';
import Layout from 'components/Layout';
import { useParams } from '@tanstack/react-router';

const Team = () => {
  const { TeamName } = useParams({ strict: false });
  const { teamMembers, teamData } = useStoreState(state => state.Teams);
  const { getTeamMembers } = useStoreActions(actions => actions.Teams);

  useEffect(() => {
    getTeamMembers(TeamName);
  }, []);

  return (
    <Layout t={`Team - ${TeamName}`}>
      <Header>{TeamName}</Header>
      <Rows>
        <Paper>
          <ListContainer>
            {teamMembers.map(m => (
              <ListRow key={m.KuskiIndex}>
                <ListCell to={`/kuskis/${m.Kuski}`}>
                  <Kuski noLink kuskiData={m} />
                </ListCell>
              </ListRow>
            ))}
          </ListContainer>
        </Paper>
        {teamData ? (
          <Paper pad>
            <div>Team Name: {teamData.Team}</div>
            <div>Members: {teamMembers.length}</div>
            <div>
              Team Logo:
              {teamData?.Logo ? (
                <LogoImg src={teamData.Logo} alt="Team logo" />
              ) : (
                ' No logo'
              )}
            </div>
            <div>Index: {teamData.TeamIndex}</div>
          </Paper>
        ) : null}
      </Rows>
    </Layout>
  );
};

const LogoImg = styled.img`
  margin-left: ${p => p.theme.padSmall};
  height: 20px;
  max-width: 40px;
  object-fit: contain;
`;

const Rows = styled.div`
  display: flex;
  gap: ${p => p.theme.padLarge};
  align-items: flex-start;
`;

const Paper = styled.div`
  width: 100%;
  background-color: ${p => p.theme.paperBackground};
  border: 1px solid ${p => p.theme.borderColor};
  border-radius: 4px;
  ${p => p.pad && `padding: ${p.theme.padSmall};`}
`;

export default Team;
