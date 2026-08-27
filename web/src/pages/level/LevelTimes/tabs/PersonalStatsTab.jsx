import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect, useState } from 'react';
import { nickId } from 'utils/nick';
import styled from '@emotion/styled';
import StatsTable from '../../StatsTable';
import LeaderHistory from 'components/LeaderHistory';
import { Row } from 'components/Containers';
import Button from 'components/Buttons';
import { TextField } from '@material-ui/core';
import TimeTable from '../../TimeTable.jsx';

const PersonalStatsTab = ({
  LevelIndex,
  openReplay,
  cripple,
  crippleData,
  crippleLoading,
}) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const loggedIn = nickId() > 0;

  const {
    timeStats,
    statsLoading,
    personalLeaderHistory,
    personalLeaderHistoryLoading,
  } = useStoreState(state => state.Level);

  const { getTimeStats, getPersonalLeaderHistory } = useStoreActions(
    actions => actions.Level,
  );

  const fetchPersonalStats = () => {
    getTimeStats({
      LevelIndex,
      from: from ? `${from} 00:00:00` : '',
      to: to ? `${to} 23:59:59` : '',
    });
    if (nickId() > 0) {
      getPersonalLeaderHistory({
        LevelIndex,
        KuskiIndex: nickId(),
        from: from ? new Date(from).getTime() / 1000 : '',
        to: to ? new Date(to).getTime() / 1000 + 86400 : '',
      });
    }
  };

  useEffect(() => {
    if (cripple) {
      return;
    }

    if (timeStats.length === 0 || statsLoading !== LevelIndex) {
      fetchPersonalStats();
    }
  }, []);

  if (!loggedIn) {
    return <Container>Log in to see personal stats.</Container>;
  }

  if (cripple) {
    return (
      <>
        <StatsTable data={crippleData.stats} loading={crippleLoading.stats} />
        <LeaderHistory
          allFinished={crippleData.leaderHistory}
          loading={crippleLoading.leaderHistory}
        />
        <TimeTable
          data={crippleData.times}
          loading={crippleLoading.times}
          height={376}
        />
      </>
    );
  }

  return (
    <>
      <Row ai="self-end" m="Large">
        <RangeField
          id="date-from"
          label="From"
          type="date"
          defaultValue={from}
          onChange={event => setFrom(event.target?.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: new Date().toISOString().split('T')[0],
          }}
        />

        <RangeField
          id="date-to"
          label="To"
          type="date"
          defaultValue={to}
          onChange={event => setTo(event.target?.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: new Date().toISOString().split('T')[0],
          }}
        />
        <Button
          secondary
          onClick={() => fetchPersonalStats()}
          disabled={!to || !from}
        >
          Submit
        </Button>
      </Row>
      <StatsTable data={timeStats} loading={statsLoading !== LevelIndex} />
      <LeaderHistory
        allFinished={personalLeaderHistory}
        loading={personalLeaderHistoryLoading !== LevelIndex}
        personal={true}
        openReplay={time => openReplay(time)}
      />
    </>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const RangeField = styled(TextField)`
  margin-right: 16px !important;
`;

export default PersonalStatsTab;
