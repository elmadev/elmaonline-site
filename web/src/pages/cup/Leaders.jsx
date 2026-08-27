import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import LeaderHistory from 'components/LeaderHistory';

const Leaders = ({ event }) => {
  const { leaderHistory } = useStoreState(state => state.Cup);
  const { getLeaderHistory } = useStoreActions(actions => actions.Cup);

  useEffect(() => {
    getLeaderHistory({
      LevelIndex: event.LevelIndex,
      from: event.StartTime,
      to: event.EndTime,
    });
  }, [event.LevelIndex]);

  return (
    <Container>
      {leaderHistory.length > 0 && (
        <LeaderHistory allFinished={leaderHistory} />
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 8px;
`;

export default Leaders;
