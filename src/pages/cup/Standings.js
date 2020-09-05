import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DerpTable from 'components/Table/DerpTable';
import { ListRow, ListCell } from 'styles/List';
import Grid from '@material-ui/core/Grid';
import Header from 'components/Header';
import Kuski from 'components/Kuski';
import { calculateStandings } from 'utils/cups';

const Standings = props => {
  const { events, cup } = props;
  const [standings, setStandings] = useState({});

  useEffect(() => {
    setStandings(calculateStandings(events, cup, false));
  }, []);

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} md={6}>
        <Container>
          <Header h2>Players</Header>
          {standings.player && (
            <DerpTable
              headers={['#', 'Player', 'Points']}
              length={standings.player.length}
            >
              {standings.player.map((r, no) => (
                <ListRow key={r.KuskiIndex}>
                  <ListCell>{no + 1}.</ListCell>
                  <ListCell>
                    <Kuski kuskiData={r.KuskiData} team flag />
                  </ListCell>
                  <ListCell right>
                    {r.Points} point{r.Points > 1 ? 's' : ''}
                  </ListCell>
                </ListRow>
              ))}
            </DerpTable>
          )}
        </Container>
      </Grid>
      <Grid item xs={12} md={6}>
        <Container>
          <Header h2>Teams</Header>
          {standings.team && (
            <DerpTable
              headers={['#', 'Team', 'Points']}
              length={standings.team.length}
            >
              {standings.team.map((r, no) => (
                <ListRow key={r.Team}>
                  <ListCell>{no + 1}.</ListCell>
                  <ListCell>{r.Team}</ListCell>
                  <ListCell right>
                    {r.Points} point{r.Points > 1 ? 's' : ''}
                  </ListCell>
                </ListRow>
              ))}
            </DerpTable>
          )}
          <Header h2 top>
            Nations
          </Header>
          {standings.team && (
            <DerpTable
              headers={['#', 'Nation', 'Points']}
              length={standings.nation.length}
            >
              {standings.nation.map((r, no) => (
                <ListRow key={r.Country}>
                  <ListCell>{no + 1}.</ListCell>
                  <ListCell>{r.Country}</ListCell>
                  <ListCell right>
                    {r.Points} point{r.Points > 1 ? 's' : ''}
                  </ListCell>
                </ListRow>
              ))}
            </DerpTable>
          )}
        </Container>
      </Grid>
    </Grid>
  );
};

const Container = styled.div`
  padding-left: 8px;
  padding-right: 8px;
`;

export default Standings;
