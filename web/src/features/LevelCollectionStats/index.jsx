import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from '@emotion/styled';
import Popularity from 'components/Popularity';
import {
  ListContainer,
  ListCell,
  ListHeader,
  ListRow,
} from '../../components/List';
import Link from 'components/Link';
import { keyBy, mapValues, maxBy } from 'lodash';
import { formatTimeSpent, formatPct, formatAttempts } from 'utils/format';
import { shiftedLogisticWithIntersects } from 'utils/calcs';

const LevelCollectionStats = ({ levelIds }) => {
  const { stats } = useStoreState(store => store.LevelCollectionStats);
  const { fetchStats } = useStoreActions(store => store.LevelCollectionStats);
  let indexedStats = keyBy(stats, 'LevelIndex');
  const type = 'ids';

  const levelStatsForEachLevel = stats.map(s => s?.LevelStatsData || {});

  const maxes = mapValues(stats?.[0]?.LevelStatsData || {}, (value, key) => {
    const rowWithMax = maxBy(levelStatsForEachLevel, key);
    return rowWithMax?.[key];
  });

  const perMinute = (count, seconds) => {
    const per = seconds > 0 ? count / (seconds / 6000) : 0;
    return per.toFixed(2);
  };

  useEffect(() => {
    fetchStats(['ids', levelIds]);
  }, [type, levelIds.join(',')]);

  return (
    <Root>
      <TableWrapper>
        <StyledListContainer>
          <ListHeader>
            <ListCell>Filename</ListCell>
            <ListCell>Level Name</ListCell>
            <ListCell>Playtime</ListCell>
            <ListCell>Kuski's Played</ListCell>
            <ListCell>Kuski Finish %</ListCell>
            <ListCell>Finish %</ListCell>
            <ListCell>Death %</ListCell>
            <ListCell title="Average left volts per minute on finished runs">
              Left Volt /min
            </ListCell>
            <ListCell title="Average right volts per minute on finished runs">
              Right Volt /min
            </ListCell>
            <ListCell title="Average alot volts per minute on finished runs">
              Alo Volt /min
            </ListCell>
            <ListCell title="Average turns per minute on finished runs">
              Turns /min
            </ListCell>
          </ListHeader>

          {levelIds.map((LevelIndex, index) => {
            const level = indexedStats?.[LevelIndex] || [];
            const levelStats = level?.LevelStatsData;
            const timePlayed = formatTimeSpent(levelStats?.TimeAll);
            const kuskisPlayed = formatAttempts(levelStats?.KuskiCountAll);
            const kuskiFinishPct = formatPct(
              levelStats?.KuskiCountF,
              levelStats?.KuskiCountAll,
            );
            const finishPct = formatPct(
              levelStats?.AttemptsF,
              levelStats?.AttemptsAll,
            );
            const deathPct = formatPct(
              levelStats?.AttemptsD,
              levelStats?.AttemptsAll,
            );
            const leftVoltsPerMin = perMinute(
              levelStats?.LeftVoltF,
              levelStats?.TimeF,
            );
            const rightVoltsPerMin = perMinute(
              levelStats?.RightVoltF,
              levelStats?.TimeF,
            );
            const aloVoltsPerMin = perMinute(
              levelStats?.SuperVoltF,
              levelStats?.TimeF,
            );
            const turnsPerMin = perMinute(levelStats?.TurnF, levelStats?.TimeF);

            return (
              <ListRow key={index}>
                <ListCell>
                  <Link to={`/levels/${level.LevelIndex}`}>
                    {level.LevelName}
                  </Link>
                </ListCell>
                <ListCell>{level.LongName}</ListCell>
                <ListCell>
                  {timePlayed} <br />
                  <Popularity
                    bordered={true}
                    widthPct={formatPct(levelStats?.TimeAll, maxes?.TimeAll)}
                  />
                </ListCell>
                <ListCell>
                  {kuskisPlayed} <br />
                  <Popularity
                    bordered={true}
                    widthPct={formatPct(
                      levelStats?.KuskiCountAll,
                      maxes?.KuskiCountAll,
                    )}
                  />
                </ListCell>
                <ListCell>
                  {kuskiFinishPct}% <br />
                  <Popularity bordered={true} widthPct={kuskiFinishPct} />
                </ListCell>
                <ListCell>
                  {finishPct}% <br />
                  <Popularity bordered={true} widthPct={finishPct} />
                </ListCell>
                <ListCell>
                  {deathPct}% <br />
                  <Popularity bordered={true} widthPct={deathPct} />
                </ListCell>
                <ListCell>
                  {leftVoltsPerMin} &lt;-
                  <br />
                  <Popularity
                    bordered={true}
                    widthPct={
                      100 *
                      shiftedLogisticWithIntersects(
                        [14, 0.25],
                        [25, 0.65],
                        leftVoltsPerMin,
                      )
                    }
                  />
                </ListCell>
                <ListCell>
                  {rightVoltsPerMin} -&gt;
                  <br />
                  <Popularity
                    bordered={true}
                    widthPct={
                      100 *
                      shiftedLogisticWithIntersects(
                        [14, 0.25],
                        [25, 0.65],
                        rightVoltsPerMin,
                      )
                    }
                  />
                </ListCell>
                <ListCell>
                  {aloVoltsPerMin} --&gt;
                  <br />
                  <Popularity
                    bordered={true}
                    widthPct={
                      100 *
                      shiftedLogisticWithIntersects(
                        [14, 0.25],
                        [25, 0.65],
                        aloVoltsPerMin,
                      )
                    }
                  />
                </ListCell>
                <ListCell>
                  {turnsPerMin} t<br />
                  <Popularity
                    bordered={true}
                    widthPct={
                      100 *
                      shiftedLogisticWithIntersects(
                        [14, 0.25],
                        [25, 0.65],
                        turnsPerMin,
                      )
                    }
                  />
                </ListCell>
              </ListRow>
            );
          })}
        </StyledListContainer>
      </TableWrapper>
    </Root>
  );
};

const Root = styled.div`
  background: ${p => p.theme.paperBackground};
`;

const TableWrapper = styled.div`
  overflow-x: scroll;
`;

const StyledListContainer = styled(ListContainer)`
  min-width: 980px;
`;

export default LevelCollectionStats;
