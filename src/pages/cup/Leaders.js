import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import LeaderHistory from 'components/LeaderHistory';

const Leaders = ({ event }) => {
  const { allFinished } = useStoreState(state => state.Cup);
  const { getAllFinishedInRange } = useStoreActions(actions => actions.Cup);

  useEffect(() => {
    getAllFinishedInRange({
      LevelIndex: event.LevelIndex,
      from: event.StartTime,
      to: event.EndTime,
    });
  }, [event.LevelIndex]);

  return (
    <Container>
      {allFinished.length > 0 && <LeaderHistory allFinished={allFinished} />}
    </Container>
  );
};

const Container = styled.div`
  padding: 8px;
`;

export default Leaders;
