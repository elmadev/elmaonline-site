/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Grid, Tabs, Tab } from '@material-ui/core';
import { Paper } from 'styles/Paper';
import { ListRow, ListCell } from 'styles/List';
import { mod } from 'utils/nick';
import { useStoreState, useStoreActions } from 'easy-peasy';

const Mod = () => {
  const { nickChanges } = useStoreState(state => state.Mod);
  const { getNickChanges } = useStoreActions(actions => actions.Mod);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getNickChanges();
  }, []);

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) => setTab(value)}
      >
        <Tab label="Dashboard" />
        <Tab label="Ban" />
        <Tab label="Reports" />
        <Tab label="Error log" />
        <Tab label="Mod log" />
        <Tab label="Level locking" />
      </Tabs>
      <Container>
        {mod() > 0 ? (
          <>
            {tab === 0 && (
              <Grid container spacing={0}>
                <Grid item xs={12} sm={6}>
                  <Paper>
                    {nickChanges.length > 0 &&
                      nickChanges.map(n => (
                        <ListRow>
                          <ListCell>{n.KuskiIndex}</ListCell>
                          <ListCell>{n.Setting}</ListCell>
                        </ListRow>
                      ))}
                  </Paper>
                </Grid>
              </Grid>
            )}
          </>
        ) : (
          <div>You are not a mod or not logged in.</div>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  padding: 20px;
`;

export default Mod;
