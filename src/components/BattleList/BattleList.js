import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LocalTime from 'components/LocalTime';
import Link from 'components/Link';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import styled from 'styled-components';
import { BattleType } from 'components/Names';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';
import { toServerTime } from 'utils/time';

const BattleList = ({ start, end }) => {
  const { battles } = useStoreState(state => state.BattleList);
  const { getBattles } = useStoreActions(actions => actions.BattleList);
  useEffect(() => {
    getBattles({
      start: toServerTime(start).format(),
      end: toServerTime(end).format(),
    });
  }, [start, end]);
  return (
    <Container>
      <Battles>
        <ListHeader>
          <Field width={100} lower>
            Type
          </Field>
          <Field width={150}>Designer</Field>
          <Field width={100}>Level</Field>
          <Field width={150}>Winner</Field>
          <Field width={60}>Time</Field>
          <Field width={80}>Started</Field>
          <span>Players</span>
        </ListHeader>
        {battles.length > 0 && (
          <>
            {battles.map(b => {
              const sorted = [...b.Results].sort(sortResults(b.BattleType));
              return (
                <Link
                  key={b.BattleIndex}
                  to={`battles/${b.BattleIndex}`}
                  style={{ backgroundColor: battleStatusBgColor(b) }}
                >
                  <Field width={100}>
                    {b.Duration} min <BattleType type={b.BattleType} />
                  </Field>
                  <Field width={150}>
                    <Kuski kuskiData={b.KuskiData} team flag />
                  </Field>
                  <Field width={100}>
                    {b.LevelData && b.LevelData.LevelName}
                  </Field>
                  <Field width={150}>
                    {b.Finished === 1 && b.Results.length > 0 ? (
                      <Kuski kuskiData={sorted[0].KuskiData} team flag />
                    ) : (
                      battleStatus(b)
                    )}
                  </Field>
                  <Field width={60}>
                    {b.Results.length > 0 && (
                      <Time time={sorted[0].Time} apples={sorted[0].Apples} />
                    )}
                  </Field>
                  <Field width={80}>
                    <LocalTime date={b.Started} format="HH:mm" parse="X" />
                  </Field>
                  <span>
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
                  </span>
                </Link>
              );
            })}
          </>
        )}
      </Battles>
    </Container>
  );
};

const Popularity = styled.div`
  max-width: 150px;
  overflow: hidden;
  height: ${p => (p.bar ? '5px' : 'auto')};
  background: ${p => (p.bar ? '#219653' : 'transparent')};
`;

const Field = styled.span`
  width: ${p => p.width}px;
  white-space: nowrap;
  text-transform: ${p => (p.lower ? 'lowercase' : 'none')};
`;

const Container = styled.div`
  display: block;
  max-width: 100%;
  overflow: auto;
  padding-bottom: 200px;
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

const Battles = styled.div`
  display: table;
  table-layout: fixed;
  min-width: 100%;
`;

const ListHeader = styled.div`
  font-weight: 500;
  display: table-row;
  > * {
    border-bottom: 1px solid #eaeaea;
    padding: 10px;
    display: table-cell;
  }
`;

BattleList.propTypes = {
  start: PropTypes.shape({}).isRequired,
  end: PropTypes.shape({}).isRequired,
};

export default BattleList;
