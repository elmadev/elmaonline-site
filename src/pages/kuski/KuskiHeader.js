import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';

const KuskiHeader = ({ KuskiIndex }) => {
  const { ranking } = useStoreState(state => state.Kuski);
  const { getRanking } = useStoreActions(actions => actions.Kuski);
  useEffect(() => {
    getRanking(KuskiIndex);
  }, []);
  let playedAll = 0;
  let winsAll = 0;
  if (ranking) {
    if (ranking[0]) {
      playedAll = ranking[0].PlayedAll;
      winsAll = ranking[0].WinsAll;
    }
  }
  return (
    <Container>
      <StatsContainer>
        <div>42:31:09</div>
        <StatsTitle>total time</StatsTitle>
      </StatsContainer>
      <StatsContainer>
        <div>{playedAll}</div>
        <StatsTitle>battles played</StatsTitle>
      </StatsContainer>
      <StatsContainer>
        <div>{winsAll}</div>
        <StatsTitle>battles won</StatsTitle>
      </StatsContainer>
    </Container>
  );
};

KuskiHeader.propTypes = {
  KuskiIndex: PropTypes.number.isRequired,
};

const Container = styled.div`
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
`;

const StatsTitle = styled.div`
  color: #c3c3c3;
  font-size: 16px;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatsContainer = styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 30px;
  font-weight: 500;
  color: #219653;
  min-width: 150px;
  flex-basis: auto;
  flex-grow: 1;
  text-align: center;
`;

export default KuskiHeader;
