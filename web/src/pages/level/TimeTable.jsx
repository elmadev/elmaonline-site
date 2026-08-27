import React from 'react';
import PropTypes from 'prop-types';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';
import Time from 'components/Time';
import Loading from 'components/Loading';
import LegacyIcon from 'components/LegacyIcon';
import LocalTime from 'components/LocalTime';
import { FixedSizeList as List } from 'react-window';
import { PlayArrow } from '@material-ui/icons';
import { Button } from '@material-ui/core';

const TimeTable = ({ data, latestBattle, loading, height, openReplay }) => {
  if (loading) return <Loading />;

  const replayAvailable = t => {
    if (!openReplay) {
      return false;
    }

    return t?.TimeFileData?.UUID && t?.TimeFileData?.MD5;
  };

  return (
    <div>
      <ListContainer>
        <ListHeader>
          <ListCell textAlign="right" width={30}>
            #
          </ListCell>
          <ListCell width={200}>Kuski</ListCell>
          <ListCell width={140}>Time</ListCell>
          <ListCell>Driven</ListCell>
          <ListCell />
        </ListHeader>
      </ListContainer>
      {data &&
        (!latestBattle ||
          latestBattle.Finished === 1 ||
          latestBattle.Aborted === 1) && (
          <ListContainer flex>
            <List
              className="List"
              height={height || 600}
              itemCount={data.length}
              itemSize={40}
            >
              {({ index, style }) => {
                const t = data[index];
                return (
                  <div style={style} key={`${t.TimeIndex}${t.Time}`}>
                    <ListRow>
                      <ListCell right width={30}>
                        {index + 1}.
                      </ListCell>
                      <ListCell whiteSpace="nowrap" width={200}>
                        {t.KuskiData.Kuski}{' '}
                        {t.KuskiData.TeamData &&
                          `[${t.KuskiData.TeamData.Team}]`}
                      </ListCell>
                      <ListCell width={140}>
                        <Time time={t.Time} />
                      </ListCell>
                      <ListCell width={200}>
                        <LocalTime
                          date={t.Driven}
                          format="d MMM yyyy"
                          parse="X"
                        />
                      </ListCell>
                      <ListCell right>
                        {t.Source !== undefined && (
                          <LegacyIcon source={t.Source} />
                        )}
                        {replayAvailable(t) && (
                          <Button onClick={() => openReplay(t)}>
                            <PlayArrow title="View" />
                          </Button>
                        )}
                      </ListCell>
                    </ListRow>
                  </div>
                );
              }}
            </List>
          </ListContainer>
        )}
    </div>
  );
};

TimeTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()),
};

export default TimeTable;
