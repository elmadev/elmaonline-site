import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';
import Time from 'components/Time';
import Loading from 'components/Loading';
import _ from 'lodash';
import { nickId } from 'utils/nick';

const finishedTypes = {
  B: 'Finished (Apple Bug)',
  D: 'Dead',
  E: 'Esced',
  F: 'Finished',
  S: 'Spied',
  X: 'Cheated',
};

const StatsTable = ({ data, loading }) => {
  if (loading) return <Loading />;

  if (!nickId()) return <Container>Log in to see personal stats.</Container>;

  const getTotalRunCount = () => {
    return _.sumBy(data, 'RunCount');
  };

  const getRunCountPercentage = RunCount => {
    return _.round((RunCount / getTotalRunCount()) * 100, 2);
  };

  const getTotalTimeSum = () => {
    return _.sumBy(data, row => parseInt(row.TimeSum, 10));
  };

  const getTimeSumPercentage = TimeSum => {
    return _.round((TimeSum / getTotalTimeSum()) * 100, 2);
  };

  return (
    <ListContainer>
      <ListHeader>
        <ListCell right width={100}>
          Type
        </ListCell>
        <ListCell right width={200}>
          Total runs
        </ListCell>
        <ListCell right width={200}>
          Time played
        </ListCell>
        <ListCell right width={200}>
          Total runs %
        </ListCell>
        <ListCell right width={200}>
          Time played %
        </ListCell>
      </ListHeader>
      <ListRow>
        <ListCell right width={100}>
          All
        </ListCell>
        <ListCell right width={200}>
          {getTotalRunCount()}
        </ListCell>
        <ListCell right width={200}>
          {getTotalTimeSum() !== 0 && <Time time={getTotalTimeSum()} />}
        </ListCell>
        <ListCell />
        <ListCell />
      </ListRow>
      {data.map(row => {
        return (
          <ListRow>
            <ListCell right width={100}>
              {finishedTypes[row.Finished]}
            </ListCell>
            <ListCell right width={200}>
              {row.RunCount}
            </ListCell>
            <ListCell right width={200}>
              {row.TimeSum !== 0 && <Time time={row.TimeSum} />}
            </ListCell>
            <ListCell right width={200}>
              {getRunCountPercentage(row.RunCount) || null}
            </ListCell>
            <ListCell right width={200}>
              {getTimeSumPercentage(row.TimeSum) || null}
            </ListCell>
          </ListRow>
        );
      })}
    </ListContainer>
  );
};

StatsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const Container = styled.div`
  padding: 20px;
`;

export default StatsTable;
