import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Grid } from '@material-ui/core';
import styled from 'styled-components';
import Header from 'components/Header';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { nickId } from 'utils/nick';
import { admins } from 'utils/cups';
import Events from './Events';
import Standings from './Standings';
import RulesInfo from './RulesInfo';
import Blog from './Blog';
import Admin from './Admin';
import Dashboard from './Dashboard';
import Personal from './Personal';
import Team from './Team';

const Cups = props => {
  const { ShortName } = props;
  const [tab, setTab] = useState(0);
  const [openEvent, setOpenEvent] = useState(-1);
  const { cup, lastCupShortName, events } = useStoreState(state => state.Cup);
  const { getCup, update, addNewBlog } = useStoreActions(
    actions => actions.Cup,
  );

  useEffect(() => {
    if (lastCupShortName !== ShortName) {
      getCup(ShortName);
    }
  }, []);

  if (!cup) {
    return null;
  }

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) => setTab(value)}
      >
        <Tab label="Dashboard" />
        <Tab label="Events" />
        <Tab label="Standings" />
        <Tab label="Rules & Info" />
        <Tab label="Blog" />
        {nickId() > 0 && <Tab label="Personal" />}
        {nickId() > 0 && <Tab label="Team" />}
        {admins(cup).length > 0 && admins(cup).indexOf(nickId()) > -1 && (
          <Tab label="Admin" />
        )}
      </Tabs>
      <CupName>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Header h1>{cup.CupName}</Header>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Description
              dangerouslySetInnerHTML={{ __html: cup.Description }}
            />
          </Grid>
        </Grid>
      </CupName>
      {tab === 0 && (
        <Dashboard
          cup={cup}
          events={events}
          openStandings={() => setTab(2)}
          openEvent={e => {
            setTab(1);
            setOpenEvent(e);
          }}
        />
      )}
      {tab === 1 && <Events cup={cup} events={events} setEvent={openEvent} />}
      {tab === 2 && <Standings events={events} cup={cup} />}
      {tab === 3 && (
        <RulesInfo
          description={cup.Description}
          owner={admins(cup)}
          updateDesc={newDesc => {
            update({
              CupGroupIndex: cup.CupGroupIndex,
              shortName: cup.ShortName,
              data: { Description: newDesc },
            });
          }}
        />
      )}
      {tab === 4 && (
        <Blog
          cup={cup}
          owner={admins(cup)}
          items={cup.CupBlog}
          addEntry={newBlog => {
            addNewBlog({ data: newBlog, shortName: cup.ShortName });
          }}
        />
      )}
      {tab === 5 && <Personal />}
      {tab === 6 && <Team />}
      {tab === 7 && <Admin />}
    </>
  );
};

const CupName = styled.div`
  padding: 8px;
`;

const Description = styled.div`
  padding-bottom: 8px;
  padding-top: 8px;
`;

export default Cups;
