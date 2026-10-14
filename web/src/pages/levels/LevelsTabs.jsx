import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { useNavigate } from '@tanstack/react-router';

const LevelsTabs = ({ tab }) => {
  const navigate = useNavigate();
  return (
    <Tabs
      variant="scrollable"
      scrollButtons="auto"
      value={tab || ''}
      onChange={(e, value) =>
        navigate({ to: ['/levels', value].filter(Boolean).join('/') })
      }
    >
      <Tab label="Packs" value="" />
      <Tab label="Collections" value="collections" />
      <Tab label="Recent Records" value="recent-records" />
      <Tab label="Search" value="search" />
      <Tab label="Create pack" value="add" />
    </Tabs>
  );
};

export default LevelsTabs;
