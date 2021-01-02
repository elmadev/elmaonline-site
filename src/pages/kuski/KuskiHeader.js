import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';
import Time from 'components/Time';
import Loading from 'components/Loading';
import { recordsTT } from 'utils/calcs';

const KuskiHeader = ({ KuskiIndex, Kuski }) => {
  const { ranking, tt } = useStoreState(state => state.Kuski);
  const { getRanking, getTt } = useStoreActions(actions => actions.Kuski);
  useEffect(() => {
    getRanking(KuskiIndex);
    getTt(Kuski);
  }, [KuskiIndex]);
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
        <div>
          {tt.length === 0 ? (
            <Loading />
          ) : (
            <Time time={recordsTT(tt, 'LevelBesttime')} />
          )}
        </div>
        <StatsTitle>Int total time</StatsTitle>
      </StatsContainer>
      <StatsContainer>
        {ranking.length === 0 ? <Loading /> : <div>{playedAll}</div>}
        <StatsTitle>battles played</StatsTitle>
      </StatsContainer>
      <StatsContainer>
        {ranking.length === 0 ? <Loading /> : <div>{winsAll}</div>}
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
