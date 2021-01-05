import React, { useEffect, useRef } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';
import Loading from 'components/Loading';
import { ListCell, ListContainer, ListHeader, ListRow } from 'styles/List';

const Kinglist = ({ highlight, highlightWeeks, levelPackIndex }) => {
  const {
    kinglist,
    totaltimesLoading,
    lastPack,
    settings: { showLegacy },
  } = useStoreState(state => state.LevelPack);
  const { getTotalTimes } = useStoreActions(actions => actions.LevelPack);
  const lastShowLegacy = useRef(showLegacy);

  useEffect(() => {
    if (lastPack !== levelPackIndex) {
      getTotalTimes({ levelPackIndex, eolOnly: showLegacy ? 0 : 1 });
    }
  }, [levelPackIndex]);

  useEffect(() => {
    if (lastShowLegacy.current !== showLegacy) {
      lastShowLegacy.current = showLegacy;
      getTotalTimes({ levelPackIndex, eolOnly: showLegacy ? 0 : 1 });
    }
  }, [showLegacy]);

  return (
    <>
      <h2>Kinglist</h2>
      <ListContainer>
        <ListHeader>
          <ListCell width={70}>#</ListCell>
          <ListCell width={320}>Player</ListCell>
          <ListCell width={200}>Points</ListCell>
          <ListCell />
        </ListHeader>
        {totaltimesLoading && <Loading />}
        {kinglist.length > 0 && (
          <>
            {kinglist
              .sort((a, b) => b.points - a.points)
              .map((r, no) => (
                <ListRow key={r.KuskiIndex}>
                  <ListCell width={70}>{no + 1}</ListCell>
                  <ListCell width={320}>{r.KuskiData.Kuski}</ListCell>
                  <TimeSpan
                    width={180}
                    highlight={r.TimeIndex >= highlight[highlightWeeks]}
                  >
                    {r.points}
                  </TimeSpan>
                  <ListCell />
                </ListRow>
              ))}
          </>
        )}
      </ListContainer>
    </>
  );
};

const TimeSpan = styled(ListCell)`
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
  width: auto !important;
`;

export default Kinglist;
