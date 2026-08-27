import React from 'react';
import Layout from 'components/Layout';
import { useNavigate } from '@tanstack/react-router';
import { Tabs, Tab } from '@material-ui/core';
import ByDate from './ByDate';
import Search from './Search';
import Paper from '@material-ui/core/Paper';

const Battles = ({ tab = '' }) => {
  const navigate = useNavigate();

  return (
    <Layout edge t={`Battles`}>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) => {
          navigate({ to: ['/battles', value].filter(Boolean).join('/') });
        }}
      >
        <Tab label="By Date" value="" />
        <Tab label="Search" value="search" />
      </Tabs>
      <Paper>
        {tab === '' && <ByDate />}
        {tab === 'search' && <Search />}
      </Paper>
    </Layout>
  );
};

export default Battles;
