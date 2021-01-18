import React from 'react';
import styled from 'styled-components';
import { Grid, Table, TableCell, TableRow } from '@material-ui/core';
import Link from 'components/Link';
import Flag from 'components/Flag';
import Header from 'components/Header';

const parseCrew = crew => {
  return {
    admins: crew.filter(c => c.RAdmin === 1),
    mods: crew.filter(c => c.RMod === 1),
    aborters: crew.filter(c => c.RStop === 1),
  };
};

const Crew = ({ crew }) => {
  const crewLists = parseCrew(crew);
  return (
    <MainDiv>
      <LeftDiv>
        <Grid container>
          <Grid item xs={12}>
            <Header h2>The moderation team</Header>
          </Grid>
          <Grid item xs={6}>
            <CrewContainer>
              <Header h3>Admins</Header>
              <Table size="small">
                {crewLists.admins.map(r => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Flag nationality={r.Country} />{' '}
                        <Link to={`/kuskis/${r.Kuski}`}>{r.Kuski}</Link>
                        {r.TeamData && (
                          <Link to={`/team/${r.TeamData.Team}`}>
                            {' '}
                            [{r.TeamData.Team}]
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Table>
            </CrewContainer>

            <CrewContainer>
              <Header h3>Moderators</Header>
              <Table size="small">
                {crewLists.mods.map(r => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Flag nationality={r.Country} />{' '}
                        <Link to={`/kuskis/${r.Kuski}`}>{r.Kuski}</Link>
                        {r.TeamData && (
                          <Link to={`/team/${r.TeamData.Team}`}>
                            {' '}
                            [{r.TeamData.Team}]
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Table>
            </CrewContainer>
          </Grid>
          <Grid item xs={6}>
            <CrewContainer>
              <Header h3>Battle aborters</Header>
              <Table size="small">
                {crewLists.aborters.map(r => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Flag nationality={r.Country} />{' '}
                        <Link to={`/kuskis/${r.Kuski}`}>{r.Kuski}</Link>
                        {r.TeamData && (
                          <Link to={`/team/${r.TeamData.Team}`}>
                            {' '}
                            [{r.TeamData.Team}]
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Table>
            </CrewContainer>
          </Grid>
        </Grid>
      </LeftDiv>
    </MainDiv>
  );
};

const MainDiv = styled.div`
  width: 600px;
  display: flex;
  padding-left: 8px;
`;

const LeftDiv = styled.div`
  float: left;
  width: 100%;
  .left: {
    padding: 8px;
    display: grid;
  }
  .right: {
    margin: 8px;
    display: grid;
  }
`;

const CrewContainer = styled.div`
  line-height: 1.5;
  padding: 8px;
  display: grid;
`;

export default Crew;
