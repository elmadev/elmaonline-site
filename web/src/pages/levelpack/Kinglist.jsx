import React from 'react';
import { useStoreState } from 'easy-peasy';
import Loading from 'components/Loading';
import Header from 'components/Header';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import Kuski from 'components/Kuski';
import { Text } from 'components/Containers';
import styled from '@emotion/styled';

// must match pointList in api/src/api/levelpack.js
const pointList = [
  40, 30, 25, 22, 20, 18, 16, 14, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
];

const Kinglist = ({ highlight, highlightWeeks, name }) => {
  const { kinglist, recordsLoading } = useStoreState(state => state.LevelPack);

  if (recordsLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header h2 mLeft>
        Kinglist
      </Header>
      <ListContainer>
        <ListHeader>
          <ListCell width={70}>#</ListCell>
          <ListCell width={320}>Player</ListCell>
          <ListCell width={200}>Points</ListCell>
          <ListCell width={100}>Records</ListCell>
          <ListCell />
        </ListHeader>
        {kinglist.length > 0 && (
          <>
            {kinglist
              .sort((a, b) => b.points - a.points)
              .map((r, no) => (
                <ListRow key={r.KuskiIndex}>
                  <ListCell width={70}>{no + 1}</ListCell>
                  <ListCell width={320}>
                    <Kuski
                      kuskiData={r.KuskiData}
                      team
                      flag
                      customUrl={`/levels/packs/${name}/personal/${r.KuskiData.Kuski}`}
                    />
                  </ListCell>
                  <ListCell
                    width={180}
                    highlight={r.TimeIndex >= highlight[highlightWeeks]}
                  >
                    {r.points}
                  </ListCell>
                  <ListCell width={100}>{r.records}</ListCell>
                  <ListCell />
                </ListRow>
              ))}
          </>
        )}
      </ListContainer>
      <Text small light t="Medium" l="Medium" r="Medium">
        Points are awarded for the top 20 times on each level (levels excluded
        from total times are not counted):
        <br />
        <PointsTable>
          {pointList.map((p, i) => {
            const n = i + 1;
            const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[n] || 'th';
            return (
              <PointsItem key={n}>
                <span>
                  {n}
                  {suffix}:
                </span>
                <span>{p} pts</span>
              </PointsItem>
            );
          })}
        </PointsTable>
        <br />
        Records = number of 1st places.
      </Text>
    </>
  );
};

const PointsTable = styled.div`
  display: grid;
  grid-template-rows: repeat(5, auto);
  grid-auto-flow: column;
  column-gap: 2.5vw;
  width: fit-content;
`;

const PointsItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: 75px;
`;

export default Kinglist;
