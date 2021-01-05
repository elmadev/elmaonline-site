import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ListCell, ListContainer, ListHeader, ListRow } from 'styles/List';

import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Loading from 'components/Loading';
import { recordsTT } from 'utils/calcs';
import LevelPopup from './LevelPopup';

const Records = ({ highlight, highlightWeeks, name }) => {
  const [level, selectLevel] = useState(-1);
  const { multiRecords, multiRecordsLoading, lastMultiName } = useStoreState(
    state => state.LevelPack,
  );
  const { getMultiRecords } = useStoreActions(actions => actions.LevelPack);

  useEffect(() => {
    if (lastMultiName !== name) {
      getMultiRecords(name);
    }
  }, [name]);

  return (
    <>
      <h2>Levels</h2>
      <ListContainer>
        <ListHeader>
          <ListCell width={100}>Filename</ListCell>
          <ListCell width={320}>Level name</ListCell>
          <ListCell width={200}>Kuski</ListCell>
          <ListCell width={200}>Kuski</ListCell>
          <ListCell>Time</ListCell>
        </ListHeader>
        {multiRecordsLoading && <Loading />}
        {multiRecords.map(r => (
          <TimeRow
            key={r.LevelIndex}
            onClick={e => {
              e.preventDefault();
              selectLevel(level === r.LevelIndex ? -1 : r.LevelIndex);
            }}
            selected={level === r.LevelIndex}
          >
            <ListCell width={100}>{r.Level.LevelName}</ListCell>
            <ListCell width={320}>{r.Level.LongName}</ListCell>
            {r.LevelMultiBesttime.length > 0 ? (
              <>
                <ListCell width={200}>
                  <Kuski
                    kuskiData={r.LevelMultiBesttime[0].Kuski1Data}
                    team
                    flag
                  />
                </ListCell>
                <ListCell width={200}>
                  <Kuski
                    kuskiData={r.LevelMultiBesttime[0].Kuski2Data}
                    team
                    flag
                  />
                </ListCell>
                <TimeSpan
                  highlight={
                    r.LevelMultiBesttime[0].TimeIndex >=
                    highlight[highlightWeeks]
                  }
                >
                  <Time time={r.LevelMultiBesttime[0].Time} />
                </TimeSpan>
              </>
            ) : (
              <>
                <ListCell />
                <ListCell />
                <ListCell />
              </>
            )}
          </TimeRow>
        ))}
        <TTRow>
          <ListCell />
          <ListCell />
          <ListCell />
          <ListCell>Total Time</ListCell>
          <ListCell>
            <Time time={recordsTT(multiRecords, 'LevelMultiBesttime')} />
          </ListCell>
        </TTRow>
      </ListContainer>
      {level !== -1 && (
        <LevelPopup
          highlight={highlight[highlightWeeks]}
          levelId={level}
          close={() => {
            selectLevel(-1);
          }}
          multi
        />
      )}
    </>
  );
};

const TimeRow = styled(ListRow)`
  background: ${p => (p.selected ? '#219653' : 'transparent')};
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
