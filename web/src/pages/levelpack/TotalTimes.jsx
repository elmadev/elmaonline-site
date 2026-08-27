import React, { useMemo } from 'react';
import { useStoreState } from 'easy-peasy';
import Header from 'components/Header';
import Time from 'components/Time';
import Loading from 'components/Loading';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import { FixedSizeList as List } from 'react-window';
import useElementSize from 'utils/useWindowSize';
import Link from 'components/Link';

const TotalTimes = ({ highlight, highlightWeeks, name }) => {
  const { totaltimes, recordsLoading } = useStoreState(
    state => state.LevelPack,
  );

  // calculate height for react-window
  const windowSize = useElementSize();
  const listHeight = windowSize.height - 319;

  const tts = useMemo(
    () => totaltimes.sort((a, b) => a.tt - b.tt),
    [totaltimes],
  );

  if (recordsLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header h2 mLeft>
        Total Times
      </Header>
      <ListContainer>
        <ListHeader>
          <ListCell width={70}>#</ListCell>
          <ListCell width={320}>Player</ListCell>
          <ListCell width={200}>Total Time</ListCell>
          <ListCell />
        </ListHeader>
      </ListContainer>
      <ListContainer flex>
        {tts.length > 0 && (
          <List
            height={!isNaN(listHeight) ? listHeight : 0}
            itemCount={tts.length}
            itemSize={40}
          >
            {({ index, style }) => {
              const r = tts[index];
              return (
                <div style={style} key={r.KuskiIndex}>
                  <ListRow>
                    <ListCell width={70}>{index + 1}</ListCell>
                    <ListCell width={320}>
                      <Link
                        to={`/levels/packs/${name}/personal/${r.KuskiData.Kuski}`}
                      >
                        {r.KuskiData.Kuski}
                      </Link>
                    </ListCell>
                    <ListCell
                      highlight={r.TimeIndex >= highlight[highlightWeeks]}
                    >
                      <Time time={r.tt} />
                    </ListCell>
                    <ListCell />
                  </ListRow>
                </div>
              );
            }}
          </List>
        )}
      </ListContainer>
    </>
  );
};

export default TotalTimes;
