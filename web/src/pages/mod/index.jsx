import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Grid, Tabs, Tab } from '@material-ui/core';
import { Paper } from 'components/Paper';
import { ListRow, ListCell, ListHeader } from 'components/List';
import { mod } from 'utils/nick';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Kuski from 'components/Kuski';
import Header from 'components/Header';
import { Check, Clear } from '@material-ui/icons';
import Layout from 'components/Layout';
import Bans from './Bans';
import ErrorLog from './ErrorLog';
import ActionLog from './ActionLog';
import News from './News';

const Mod = () => {
  const { nickChanges } = useStoreState(state => state.Mod);
  const { getNickChanges, acceptNick, declineNick } = useStoreActions(
    actions => actions.Mod,
  );
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getNickChanges();
  }, []);

  return (
    <Layout edge t="Mod">
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) => setTab(value)}
      >
        <Tab label="Dashboard" />
        <Tab label="Bans" />
        <Tab label="Reports" />
        <Tab label="Error log" />
        <Tab label="Mod log" />
        <Tab label="News" />
      </Tabs>
      <Container>
        {mod() > 0 ? (
          <>
            {tab === 0 && (
              <Grid container spacing={0}>
                <Grid item xs={12} sm={6}>
                  <Header h2>Nick change requests</Header>
                  <Paper>
                    <ListHeader>
                      <ListCell>Old nick</ListCell>
                      <ListCell>New nick</ListCell>
                      <ListCell>Accept</ListCell>
                      <ListCell>Decline</ListCell>
                    </ListHeader>
                    {nickChanges.length > 0 &&
                      nickChanges.map(n => (
                        <ListRow key={n.SiteSettingIndex}>
                          <ListCell>
                            <Kuski kuskiData={n.KuskiData} />
                          </ListCell>
                          <ListCell>{n.Setting}</ListCell>
                          <ListCell>
                            <Accept onClick={() => acceptNick(n)} />
                          </ListCell>
                          <ListCell>
                            <Decline onClick={() => declineNick(n)} />
                          </ListCell>
                        </ListRow>
                      ))}
                  </Paper>
                </Grid>
              </Grid>
            )}
            {tab === 1 && <Bans />}
            {tab === 3 && <ErrorLog />}
            {tab === 4 && <ActionLog />}
            {tab === 5 && <News />}
          </>
        ) : (
          <div>You are not a mod or not logged in.</div>
        )}
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const Accept = styled(Check)`
  cursor: pointer;
`;

const Decline = styled(Clear)`
  cursor: pointer;
`;

export default Mod;
