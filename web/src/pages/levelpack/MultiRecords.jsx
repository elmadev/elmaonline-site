import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Header from 'components/Header';
import { Level } from 'components/Names';
import Loading from 'components/Loading';
import { recordsTT } from 'utils/calcs';
import LevelPopup from './LevelPopup';

const Records = ({ highlight, highlightWeeks, name }) => {
  const [level, selectLevel] = useState(-1);
  const [longName, setLongName] = useState('');
  const [levelName, setLevelName] = useState('');
  const { multiRecords, multiRecordsLoading, levelPackInfo } = useStoreState(
    state => state.LevelPack,
  );
  const { getMultiRecords } = useStoreActions(actions => actions.LevelPack);

  useEffect(() => {
    getMultiRecords(name);
  }, [name]);

  const enhancedMultiRecords = useMemo(() => {
    if (!levelPackInfo?.levels || !multiRecords.length) {
      return multiRecords;
    }

    return multiRecords.map(record => {
      const levelInfo = levelPackInfo.levels.find(
        l => l.LevelIndex === record.LevelIndex,
      );
      return {
        ...record,
        Level: {
          ...record.Level,
          ExcludeFromTotal: levelInfo?.ExcludeFromTotal || 0,
        },
      };
    });
  }, [multiRecords, levelPackInfo]);

  if (multiRecordsLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header h2 mLeft>
        Levels
      </Header>
      <ListContainer>
        <ListHeader>
          <ListCell width={100}>Filename</ListCell>
          <ListCell width={320}>Level name</ListCell>
          <ListCell width={200}>Kuski</ListCell>
          <ListCell width={200}>Kuski</ListCell>
          <ListCell>Time</ListCell>
        </ListHeader>
        {enhancedMultiRecords.map(r => (
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
            <ListCell width={100}>
              <Level LevelIndex={r.LevelIndex} LevelData={r.Level} />
            </ListCell>
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
                <ListCell
                  highlight={
                    r.LevelMultiBesttime[0].MultiTimeIndex >=
                    highlight[highlightWeeks]
                  }
                >
                  <Time time={r.LevelMultiBesttime[0].Time} />
                </ListCell>
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
            <Time
              time={recordsTT(enhancedMultiRecords, 'LevelMultiBesttime')}
            />
          </ListCell>
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
          multi
        />
      )}
    </>
  );
};

const TimeRow = styled(ListRow)`
  background: ${p => (p.selected ? p.theme.primary : 'transparent')};
  a {
    color: ${p => (p.selected ? 'white' : p.theme.linkColor)};
  }
  span {
    color: ${p => (p.selected ? 'white' : 'inherit')};
  }
  :hover {
    background: ${p => (p.selected ? p.theme.primary : p.theme.hoverColor)};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

const TTRow = styled(ListRow)`
  background: ${p => (p.selected ? p.theme.primary : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? p.theme.primary : p.theme.hoverColor)};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

export default Records;
