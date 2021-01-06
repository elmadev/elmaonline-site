import React, { useState } from 'react';
import styled from 'styled-components';

import { ListCell, ListContainer, ListHeader, ListRow } from 'styles/List';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Loading from 'components/Loading';
import { recordsTT } from 'utils/calcs';
import LegacyIcon from 'styles/LegacyIcon';
import LevelPopup from './LevelPopup';

const Records = ({
  highlight,
  highlightWeeks,
  records,
  recordsLoading,
  showLegacyIcon,
}) => {
  const [level, selectLevel] = useState(-1);
  const [longName, setLongName] = useState('');
  const [levelName, setLevelName] = useState('');

  return (
    <>
      <h2>Levels</h2>
      <ListContainer>
        <ListHeader>
          <ListCell width={100}>Filename</ListCell>
          <ListCell width={320}>Level name</ListCell>
          <ListCell width={200}>Kuski</ListCell>
          <ListCell>Time</ListCell>
          {records.length > 0 &&
            records[0].LevelBesttime[0].Source !== undefined && <ListCell />}
        </ListHeader>
        {recordsLoading && <Loading />}
        {records.map(r => (
          <TimeRow
            key={r.LevelIndex}
            onClick={e => {
              e.preventDefault();
              selectLevel(level === r.LevelIndex ? -1 : r.LevelIndex);
              setLongName(r.Level.LongName);
              setLevelName(r.Level.LevelName);
            }}
            selected={level === r.LevelIndex}
          >
            <ListCell width={100}>{r.Level.LevelName}</ListCell>
            <ListCell width={320}>{r.Level.LongName}</ListCell>
            {r.LevelBesttime.length > 0 ? (
              <>
                <ListCell width={200}>
                  <Kuski kuskiData={r.LevelBesttime[0].KuskiData} team flag />
                </ListCell>
                <TimeSpan
                  highlight={
                    r.LevelBesttime[0].TimeIndex >= highlight[highlightWeeks]
                  }
                >
                  <Time time={r.LevelBesttime[0].Time} />
                </TimeSpan>
                {r.LevelBesttime[0].Source !== undefined && (
                  <ListCell right>
                    <LegacyIcon
                      source={r.LevelBesttime[0].Source}
                      show={showLegacyIcon}
                    />
                  </ListCell>
                )}
              </>
            ) : (
              <>
                <ListCell />
                <ListCell />
              </>
            )}
          </TimeRow>
        ))}
        <TTRow>
          <ListCell />
          <ListCell />
          <ListCell>Total Time</ListCell>
          <ListCell>
            <Time time={recordsTT(records, 'LevelBesttime')} />
          </ListCell>
          {records.length > 0 &&
            records[0].LevelBesttime[0].Source !== undefined && <ListCell />}
        </TTRow>
      </ListContainer>
      {level !== -1 && (
        <LevelPopup
          highlight={highlight[highlightWeeks]}
          levelId={level}
          longName={longName}
          levelName={levelName}
          close={() => {
            selectLevel(-1);
          }}
          showLegacyIcon={showLegacyIcon}
        />
      )}
    </>
  );
};

const TimeRow = styled(ListRow)`
  background: ${p => (p.selected ? '#219653' : 'transparent')};
  cursor: pointer;
  a {
    color: ${p => (p.selected ? 'white' : '#219653')};
  }
  span {
    color: ${p => (p.selected ? 'white' : 'inherit')};
  }
  :hover {
    background: ${p => (p.selected ? '#219653' : '#f9f9f9')};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

const TTRow = styled(ListRow)`
  background: ${p => (p.selected ? '#219653' : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? '#219653' : '#f9f9f9')};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

const TimeSpan = styled(ListCell)`
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
`;

export default Records;
