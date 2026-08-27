import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { ListContainer, ListHeader, ListRow, ListCell } from 'components/List';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import { Paper } from 'components/Paper';
import { getSortedResultsWithPoints } from './utils';

const getLevelName = battle =>
  battle.BattleData ? battle.BattleData.LevelData?.LevelName : battle.LevelName;

const Detailed = ({
  battles,
  standings,
  pointSystem,
  pointsEnum,
  referenceResultCount,
}) => {
  const sortedStandings = [...standings].sort((a, b) => b.Points - a.Points);

  const battleResults = useMemo(
    () =>
      battles.map(b =>
        b.BattleData?.Results?.length
          ? getSortedResultsWithPoints({
              results: b.BattleData.Results,
              battleType: b.BattleType,
              pointSystem,
              pointsEnum,
              referenceResultCount,
            })
          : [],
      ),
    [battles, pointSystem, pointsEnum, referenceResultCount],
  );

  return (
    <Paper>
      <Scroll>
        <ListContainer>
          <ListHeader>
            <ListCell right width={30}>
              #
            </ListCell>
            <ListCell width={200}>Kuski</ListCell>
            <ListCell width={80}>Points</ListCell>
            {battles.map((b, i) => (
              <ListCell key={`${b.BattleIndex}${i}`} width={140}>
                {`Round ${i + 1}`}
                <RoundLevel>{getLevelName(b)}</RoundLevel>
              </ListCell>
            ))}
          </ListHeader>
          {sortedStandings.map((s, i) => (
            <ListRow key={s.KuskiIndex}>
              <ListCell right width={30}>
                {i + 1}.
              </ListCell>
              <ListCell width={200}>
                <Kuski kuskiData={s.KuskiData} flag team />
              </ListCell>
              <ListCell width={80}>{s.Points} pts.</ListCell>
              {battles.map((b, bi) => {
                const playerResult = battleResults[bi].find(
                  r => r.KuskiIndex === s.KuskiIndex,
                );
                return (
                  <RoundCell
                    key={`${b.BattleIndex}${bi}`}
                    place={playerResult?.Position}
                  >
                    {playerResult && (
                      <ResultCell>
                        {playerResult.Time === 0 || playerResult.DNF ? (
                          'DNF'
                        ) : (
                          <Time
                            time={playerResult.Time}
                            apples={playerResult.Apples}
                          />
                        )}
                        <Position>{playerResult.Points}</Position>
                      </ResultCell>
                    )}
                  </RoundCell>
                );
              })}
            </ListRow>
          ))}
        </ListContainer>
      </Scroll>
    </Paper>
  );
};

const Scroll = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;

const RoundLevel = styled.div`
  font-weight: 400;
  font-size: 11px;
  opacity: 0.7;
`;

const placeColor = place => {
  if (place === 1) return '#d4af37';
  if (place === 2) return '#a8a9ad';
  if (place === 3) return '#cd7f32';
  return null;
};

const RoundCell = styled.span`
  display: table-cell;
  color: ${p => p.theme.fontColor};
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  width: 140px;
  vertical-align: baseline;
  background: ${p => placeColor(p.place) || 'transparent'};
`;

const ResultCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Position = styled.span`
  display: inline-block;
  min-width: 18px;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  color: #fff;
  background: #2e7d32;
`;

Detailed.propTypes = {
  battles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  standings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  pointSystem: PropTypes.number,
  pointsEnum: PropTypes.arrayOf(PropTypes.number),
  referenceResultCount: PropTypes.number,
};

export default Detailed;
