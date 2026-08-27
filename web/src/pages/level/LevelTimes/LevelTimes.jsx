import { Tab, Tabs } from '@material-ui/core';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Paper } from 'components/Paper';
import Loading from 'components/Loading';
import { useStoreState } from 'easy-peasy';
import { nickId } from 'utils/nick';

import {
  CrippledTimes,
  CrippledPersonal,
  CrippledTimeStats,
  useQueryAlt,
} from 'api';
import CrippledSelect from './CrippledSelect.jsx';
import BestTimesTab from './tabs/BestTimesTab.jsx';
import AllTimesTab from './tabs/AllTimesTab.jsx';
import PersonalStatsTab from './tabs/PersonalStatsTab.jsx';
import LeaderHistoryTab from './tabs/LeaderHistoryTab';
import EolTimesTab from './tabs/EolTimesTab.jsx';
import MyTimesTab from './tabs/MyTimesTab.jsx';

const LevelTimes = ({ LevelIndex, openReplay }) => {
  const [tab, setTab] = useState('best-times');
  const [cripple, setCripple] = useState('');

  const kuskiIndex = nickId();

  const { level, loading } = useStoreState(state => state.Level);

  // crippled best times, all times, leader history
  const { data: crippledTimesData, isLoading: crippledTimesDataLoading } =
    useQueryAlt(
      ['CrippledTimes', LevelIndex, cripple],
      async () => CrippledTimes(LevelIndex, cripple, 1000, 1, 10000),
      { enabled: cripple !== '' && tab !== 'personal-stats', retry: 0 },
    );

  const {
    allTimes: crippledAllTimes,
    bestTimes: crippledBestTimes,
    leaderHistory: crippledLeaderHistory,
  } = crippledTimesData || {};

  // crippled personal times and record history
  const { data: crippledPersonalData, isLoading: crippledPersonalDataLoading } =
    useQueryAlt(
      ['CrippledPersonal', LevelIndex, kuskiIndex, cripple],
      async () => CrippledPersonal(LevelIndex, kuskiIndex, cripple, 1000),
      {
        enabled:
          cripple !== '' &&
          kuskiIndex > 0 &&
          ['personal-stats', 'my-times'].includes(tab),
        retry: 0,
      },
    );

  const {
    kuskiTimes: crippledKuskiTimes,
    kuskiLeaderHistory: crippledKuskiLeaderHistory,
  } = crippledPersonalData || {};

  // crippled personal stats table data
  const {
    data: crippledKuskiTimeStats,
    isLoading: crippledKuskiTimeStatsLoading,
  } = useQueryAlt(
    ['CrippledTimeStats', LevelIndex, kuskiIndex, cripple],
    async () => CrippledTimeStats(LevelIndex, kuskiIndex, cripple),
    {
      enabled: cripple !== '' && kuskiIndex > 0 && tab === 'personal-stats',
      retry: 0,
    },
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <CrippledSelect
        level={level}
        cripple={cripple}
        setCripple={setCripple}
        tab={tab}
        setTab={setTab}
      />
      <Paper>
        <StyledTabs
          variant="scrollable"
          scrollButtons="auto"
          value={tab}
          onChange={(e, value) => setTab(value)}
        >
          <Tab label="Best times" value="best-times" />
          <Tab label="All times" value="all-times" />
          <Tab label="Personal stats" value="personal-stats" />
          <Tab label="My times" value="my-times" />
          <Tab label="Leaders" value="leaders" />
          {!cripple && level.Legacy && (
            <Tab label="EOL times" value="eol-times" />
          )}
        </StyledTabs>

        {tab === 'best-times' && (
          <BestTimesTab
            LevelIndex={LevelIndex}
            cripple={cripple}
            crippleData={crippledBestTimes}
            crippleLoading={crippledTimesDataLoading}
          />
        )}
        {tab === 'all-times' && (
          <AllTimesTab
            LevelIndex={LevelIndex}
            cripple={cripple}
            crippleData={crippledAllTimes}
            crippleLoading={crippledTimesDataLoading}
          />
        )}
        {tab === 'personal-stats' && (
          <PersonalStatsTab
            LevelIndex={LevelIndex}
            openReplay={openReplay}
            cripple={cripple}
            crippleData={{
              stats: crippledKuskiTimeStats,
              leaderHistory: crippledKuskiLeaderHistory,
            }}
            crippleLoading={{
              stats: crippledKuskiTimeStatsLoading,
              leaderHistory: crippledPersonalDataLoading,
            }}
          />
        )}
        {tab === 'my-times' && (
          <MyTimesTab
            LevelIndex={LevelIndex}
            cripple={cripple}
            openReplay={openReplay}
            crippleData={crippledKuskiTimes}
            crippleLoading={crippledPersonalDataLoading}
          />
        )}
        {tab === 'leaders' && (
          <LeaderHistoryTab
            LevelIndex={LevelIndex}
            cripple={cripple}
            crippleData={crippledLeaderHistory}
            crippleLoading={crippledTimesDataLoading}
          />
        )}
        {tab === 'eol-times' && <EolTimesTab LevelIndex={LevelIndex} />}
      </Paper>
    </>
  );
};

const StyledTabs = styled(Tabs)`
  .MuiTab-root {
    min-width: 125px;
    @media screen and (max-width: 1440px) {
      min-width: 100px;
    }
  }
`;

export default LevelTimes;
