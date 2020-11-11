import React from 'react';
import PropTypes from 'prop-types';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';
import Time from 'components/Time';
import _ from 'lodash';

const finishedTypes = [
  {
    key: 'D',
    value: 'Dead',
  },
  { key: 'E', value: 'Esced' },
  { key: 'F', value: 'Finished' },
  { key: 'S', value: 'Spied' },
];

const StatsTable = ({ data }) => {
  const getTotalRunCount = () => {
    return _.sumBy(data, 'RunCount');
  };

  const getRunCountByType = type => {
    return _.sumBy(data, row => {
      if (row.Finished === type) {
        return row.RunCount;
      }
      return 0;
    });
  };

  const getRunCountPercentageByType = type => {
    return _.round((getRunCountByType(type) / getTotalRunCount()) * 100, 2);
  };

  const getTotalTimeSum = () => {
    return _.sumBy(data, row => parseInt(row.TimeSum, 10));
  };

  const getTimeSumByType = type => {
    return _.sumBy(data, row => {
      if (row.Finished === type) {
        return parseInt(row.TimeSum, 10);
      }
      return 0;
    });
  };

  const getTimeSumPercentageByType = type => {
    return _.round((getTimeSumByType(type) / getTotalTimeSum()) * 100, 2);
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
      {finishedTypes.map(type => {
        return (
          <ListRow>
            <ListCell right width={100}>
              {type.value}
            </ListCell>
            <ListCell right width={200}>
              {getRunCountByType(type.key)}
            </ListCell>
            <ListCell right width={200}>
              {getTimeSumByType(type.key) !== 0 && (
                <Time time={getTimeSumByType(type.key)} />
              )}
            </ListCell>
            <ListCell right width={200}>
              {getRunCountPercentageByType(type.key) || null}
            </ListCell>
            <ListCell right width={200}>
              {getTimeSumPercentageByType(type.key) || null}
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

export default StatsTable;
