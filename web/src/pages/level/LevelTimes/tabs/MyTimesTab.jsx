import TimeTable from '../../TimeTable';
import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { nickId } from 'utils/nick';
import styled from '@emotion/styled';

const MyTimesTab = ({
  LevelIndex,
  cripple,
  crippleData,
  crippleLoading,
  openReplay,
}) => {
  const loggedIn = nickId() > 0;

  const { myTimesLoading, myTimes } = useStoreState(state => state.Level);
  const { getMyTimes } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    if (cripple) {
      return;
    }

    if (myTimes.length === 0 || myTimesLoading !== LevelIndex) {
      getMyTimes({ LevelIndex, KuskiIndex: nickId(), limit: 10000 });
    }
  }, []);

  if (!loggedIn) {
    return <Container>Log in to see personal stats.</Container>;
  }

  if (cripple) {
    return (
      <TimeTable
        data={crippleData}
        loading={crippleLoading}
        openReplay={openReplay}
      />
    );
  }

  return (
    <TimeTable
      loading={myTimesLoading !== LevelIndex}
      data={myTimes}
      openReplay={openReplay}
    />
  );
};

const Container = styled.div`
  padding: 20px;
`;

export default MyTimesTab;
