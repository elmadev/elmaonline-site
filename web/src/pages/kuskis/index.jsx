import React, { useEffect } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { useNavigate } from '@tanstack/react-router';
import Layout from 'components/Layout';
import Alphabetical from './Alphabetical';
import ByCountry from './ByCountry';

import { useStoreState, useStoreActions } from 'easy-peasy';

const Kuskis = ({ tab }) => {
  const { playerList, playersByCountry } = useStoreState(state => state.Kuskis);
  const { getPlayers } = useStoreActions(actions => actions.Kuskis);
  const navigate = useNavigate();

  useEffect(() => {
    if (playerList.length === 0) {
      getPlayers();
    }
  }, []);

  return (
    <Layout edge t="Kuskis">
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) =>
          navigate({ to: ['/kuskis', value].filter(Boolean).join('/') })
        }
      >
        <Tab label="By Country" value="" />
        <Tab label="Search" value="search" />
      </Tabs>
      {!tab && <ByCountry playersByCountry={playersByCountry} />}
      {tab === 'search' && <Alphabetical playerList={playerList} />}
    </Layout>
  );
};

export default Kuskis;
