import React, { useEffect, useMemo } from 'react';
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
import { keyBy, mapValues, maxBy, sumBy } from 'lodash';
import { formatTimeSpent, formatPct, formatAttempts } from 'utils/format';
import { shiftedLogisticWithIntersects } from 'utils/calcs';

const TOTAL_KEYS = [
  'TimeAll',
  'KuskiCountAll',
  'KuskiCountF',
  'AttemptsAll',
  'AttemptsF',
  'AttemptsD',
  'TimeF',
  'LeftVoltF',
  'RightVoltF',
  'SuperVoltF',
  'TurnF',
];

const perMinute = (count, seconds) => {
  const per = seconds > 0 ? count / (seconds / 6000) : 0;
  return per.toFixed(2);
};

const perMinuteBarPct = value =>
  100 * shiftedLogisticWithIntersects([14, 0.25], [25, 0.65], value);

const perMinuteTitle =
  'Average per minute across finished runs on all included levels';

const LevelCollectionStats = ({ levelIds, excludeFromTotalIds = [] }) => {
  const { stats } = useStoreState(store => store.LevelCollectionStats);
  const { fetchStats } = useStoreActions(store => store.LevelCollectionStats);
  const type = 'ids';
  // parents pass new arrays on every render, so memoize on their contents
  const levelIdsKey = levelIds.join(',');
  const excludeKey = excludeFromTotalIds.join(',');

  const indexedStats = useMemo(() => keyBy(stats, 'LevelIndex'), [stats]);

  const maxes = useMemo(() => {
    const levelStatsForEachLevel = stats.map(s => s?.LevelStatsData || {});
    return mapValues(stats?.[0]?.LevelStatsData || {}, (value, key) => {
      const rowWithMax = maxBy(levelStatsForEachLevel, key);
      return rowWithMax?.[key];
    });
  }, [stats]);

  const {
    totalCount,
    excludedCount,
    totalTimeAll,
    totalKuskiCountAll,
    totalKuskiFinishPct,
    totalFinishPct,
    totalDeathPct,
    totalLeftVoltsPerMin,
    totalRightVoltsPerMin,
    totalAloVoltsPerMin,
    totalTurnsPerMin,
  } = useMemo(() => {
    const excluded = new Set(excludeFromTotalIds);
    const includedStats = levelIds
      .filter(id => !excluded.has(id))
      .map(id => indexedStats?.[id]?.LevelStatsData)
      .filter(Boolean);
    const total = {};
    TOTAL_KEYS.forEach(key => {
      total[key] = sumBy(includedStats, s => s[key] || 0);
    });
    return {
      totalCount: includedStats.length,
      excludedCount: levelIds.filter(id => excluded.has(id)).length,
      totalTimeAll: total.TimeAll,
      totalKuskiCountAll: total.KuskiCountAll,
      totalKuskiFinishPct: formatPct(total.KuskiCountF, total.KuskiCountAll),
      totalFinishPct: formatPct(total.AttemptsF, total.AttemptsAll),
      totalDeathPct: formatPct(total.AttemptsD, total.AttemptsAll),
      totalLeftVoltsPerMin: perMinute(total.LeftVoltF, total.TimeF),
      totalRightVoltsPerMin: perMinute(total.RightVoltF, total.TimeF),
      totalAloVoltsPerMin: perMinute(total.SuperVoltF, total.TimeF),
      totalTurnsPerMin: perMinute(total.TurnF, total.TimeF),
    };
  }, [indexedStats, levelIdsKey, excludeKey]);

  useEffect(() => {
    fetchStats(['ids', levelIds]);
  }, [type, levelIdsKey]);

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

          {totalCount > 0 && (
            <TotalRow>
              <ListCell>Total</ListCell>
              <ListCell
                title={
                  excludedCount > 0
                    ? 'Levels marked as ExcludeFromTotal are not counted'
                    : ''
                }
              >
                {totalCount} levels
                {excludedCount > 0 && ` (${excludedCount} excluded)`}
              </ListCell>
              <ListCell title="Total playtime across all included levels">
                {formatTimeSpent(totalTimeAll)}
              </ListCell>
              <ListCell title="Average number of kuskis played per level">
                {formatAttempts(Math.round(totalKuskiCountAll / totalCount))}{' '}
                avg
              </ListCell>
              <ListCell title="Average across all included levels, weighted by kuskis played">
                {totalKuskiFinishPct}% <br />
                <Popularity bordered={true} widthPct={totalKuskiFinishPct} />
              </ListCell>
              <ListCell title="Average across all included levels, weighted by attempts">
                {totalFinishPct}% <br />
                <Popularity bordered={true} widthPct={totalFinishPct} />
              </ListCell>
              <ListCell title="Average across all included levels, weighted by attempts">
                {totalDeathPct}% <br />
                <Popularity bordered={true} widthPct={totalDeathPct} />
              </ListCell>
              <ListCell title={perMinuteTitle}>
                {totalLeftVoltsPerMin} &lt;-
                <br />
                <Popularity
                  bordered={true}
                  widthPct={perMinuteBarPct(totalLeftVoltsPerMin)}
                />
              </ListCell>
              <ListCell title={perMinuteTitle}>
                {totalRightVoltsPerMin} -&gt;
                <br />
                <Popularity
                  bordered={true}
                  widthPct={perMinuteBarPct(totalRightVoltsPerMin)}
                />
              </ListCell>
              <ListCell title={perMinuteTitle}>
                {totalAloVoltsPerMin} --&gt;
                <br />
                <Popularity
                  bordered={true}
                  widthPct={perMinuteBarPct(totalAloVoltsPerMin)}
                />
              </ListCell>
              <ListCell title={perMinuteTitle}>
                {totalTurnsPerMin} t<br />
                <Popularity
                  bordered={true}
                  widthPct={perMinuteBarPct(totalTurnsPerMin)}
                />
              </ListCell>
            </TotalRow>
          )}
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

const TotalRow = styled(ListRow)`
  font-weight: 600;
`;

const StyledListContainer = styled(ListContainer)`
  min-width: 980px;
`;

export default LevelCollectionStats;
