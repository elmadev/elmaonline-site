import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import history from 'utils/history';
import Kuski from 'components/Kuski';
import styled from 'styled-components';
import { BattleType } from 'components/Names';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';
import { toServerTime } from 'utils/time';
import { ListRow, ListCell, ListContainer, ListHeader } from 'styles/List';

const BattleList = ({ start, end, limit = 250 }) => {
  const { battles } = useStoreState(state => state.BattleList);
  const { getBattles } = useStoreActions(actions => actions.BattleList);
  useEffect(() => {
    getBattles({
      start: toServerTime(start).format(),
      end: toServerTime(end).format(),
      limit,
    });
  }, [start, end]);
  return (
    <Container>
      <ListContainer>
        <ListHeader>
          <ListCell width={100}>Type</ListCell>
          <ListCell width={150}>Designer</ListCell>
          <ListCell width={100}>Level</ListCell>
          <ListCell width={150}>Winner</ListCell>
          <ListCell width={60}>Time</ListCell>
          <ListCell width={80}>Started</ListCell>
          <ListCell>Players</ListCell>
        </ListHeader>
        {battles.length > 0 && (
          <>
            {battles.map(b => {
              const sorted = [...b.Results].sort(sortResults(b.BattleType));
              return (
                <ListRow
                  key={b.BattleIndex}
                  onClick={() => history.push(`battles/${b.BattleIndex}`)}
                  bg={battleStatusBgColor(b)}
                >
                  <ListCell width={100}>
                    {b.Duration} min <BattleType lower type={b.BattleType} />
                  </ListCell>
                  <ListCell width={150}>
                    <Kuski kuskiData={b.KuskiData} team flag />
                  </ListCell>
                  <ListCell width={100}>
                    {b.LevelData && b.LevelData.LevelName}
                  </ListCell>
                  <ListCell width={150}>
                    {b.Finished === 1 && b.Results.length > 0 ? (
                      <Kuski kuskiData={sorted[0].KuskiData} team flag />
                    ) : (
                      battleStatus(b)
                    )}
                  </ListCell>
                  <ListCell width={60}>
                    {b.Results.length > 0 && (
                      <Time time={sorted[0].Time} apples={sorted[0].Apples} />
                    )}
                  </ListCell>
                  <ListCell width={80}>
                    <LocalTime date={b.Started} format="HH:mm" parse="X" />
                  </ListCell>
                  <ListCell>
                    <Popularity>
                      <Popularity
                        bar
                        title={b.Results.length}
                        style={{
                          width: `${(b.Results.length / 20) * 100}%`,
                          opacity: b.Results.length / 20 + 0.1,
                        }}
                      />
                    </Popularity>
                  </ListCell>
                </ListRow>
              );
            })}
          </>
        )}
      </ListContainer>
    </Container>
  );
};

const Popularity = styled.div`
  max-width: 150px;
  overflow: hidden;
  height: ${p => (p.bar ? '5px' : 'auto')};
  background: ${p => (p.bar ? '#219653' : 'transparent')};
`;

const Container = styled.div`
  display: block;
  max-width: 100%;
  overflow: auto;
  a {
    color: black;
    display: table-row;
    :hover {
      background: #f9f9f9;
    }
    > * {
      padding: 10px;
      border-bottom: 1px solid #eaeaea;
      display: table-cell;
      vertical-align: middle;
    }
  }
`;

BattleList.propTypes = {
  start: PropTypes.shape({}).isRequired,
  end: PropTypes.shape({}).isRequired,
};

export default BattleList;
