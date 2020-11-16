import React from 'react';
import PropTypes from 'prop-types';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';
import Time from 'components/Time';
import Loading from 'components/Loading';
import LegacyIcon from 'styles/LegacyIcon';

const TimeTable = ({ data, latestBattle, loading }) => {
  if (loading) return <Loading />;
  return (
    <div>
      <ListContainer>
        <ListHeader>
          <ListCell right width={30}>
            #
          </ListCell>
          <ListCell width={200}>Kuski</ListCell>
          <ListCell right width={200}>
            Time
          </ListCell>
          <ListCell />
        </ListHeader>
        {data &&
          (!latestBattle ||
            latestBattle.Finished === 1 ||
            latestBattle.Aborted === 1) &&
          data.map((t, i) => (
            <ListRow key={`${t.TimeIndex}${t.Time}`}>
              <ListCell right width={30}>
                {i + 1}.
              </ListCell>
              <ListCell width={200}>
                {t.KuskiData.Kuski}{' '}
                {t.KuskiData.TeamData && `[${t.KuskiData.TeamData.Team}]`}
              </ListCell>
              <ListCell width={200} right>
                <Time time={t.Time} />
              </ListCell>
              <ListCell right>
                {t.Source !== undefined && <LegacyIcon source={t.Source} />}
              </ListCell>
            </ListRow>
          ))}
      </ListContainer>
    </div>
  );
};

TimeTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default TimeTable;
