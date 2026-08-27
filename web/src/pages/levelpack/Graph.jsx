import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import Header from 'components/Header';
import styled from '@emotion/styled';
import { HistoricTT } from 'api';
import { formatTime } from 'components/Time';
import { format } from 'date-fns';
import Loading from 'components/Loading';
import { useQueries } from '@tanstack/react-query';

const generateTicksFromData = data => {
  if (!data || data.length === 0) return [];
  let step = 15000; // 2.5 minutes

  const minValue = Math.min(
    ...data.flatMap(d =>
      Object.entries(d)
        .filter(([key]) => key !== 'date')
        .map(([, value]) => value),
    ),
  );
  const maxValue = Math.max(
    ...data.flatMap(d =>
      Object.entries(d)
        .filter(([key]) => key !== 'date')
        .map(([, value]) => value),
    ),
  );

  if (maxValue - minValue < step) {
    step = 6000; // 1 minute
  }
  if (maxValue - minValue < step * 2) {
    step = 3000; // 30 seconds
  }

  const min = Math.floor(minValue / step) * step;
  const max = Math.ceil(maxValue / step) * step;

  const ticks = [];
  for (let t = min; t <= max; t += step) {
    ticks.push(t);
  }

  return ticks;
};

const getYearTicks = data => {
  const monthTs = 1000 * 60 * 60 * 24 * 30;
  if (!data || data.length === 0) return [];

  const years = data.map(d => new Date(d.date).getFullYear());
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  if (maxYear - minYear <= 1) {
    const ticks = [];
    for (let month = 0; month < 12; month++) {
      const date = new Date(minYear, month, 1);
      if (
        date.getTime() >= data[0].date - monthTs &&
        date.getTime() <= data[data.length - 1].date + monthTs
      ) {
        ticks.push(date.getTime());
      }
    }
    for (let month = 0; month < 12; month++) {
      const date = new Date(maxYear, month, 1);
      if (
        date.getTime() >= data[0].date - monthTs &&
        date.getTime() <= data[data.length - 1].date + monthTs
      ) {
        ticks.push(date.getTime());
      }
    }
    return [ticks, 'months'];
  }

  const ticks = [];
  for (let year = minYear; year <= maxYear; year++) {
    ticks.push(new Date(`${year}-01-01`).getTime());
  }
  return [ticks, 'years'];
};

const TotalTimeChart = ({ players, LevelPackName }) => {
  const queries = useQueries({
    queries: players.map(player => ({
      queryKey: ['historicGraph2', LevelPackName, player.KuskiIndex],
      queryFn: () =>
        HistoricTT({
          LevelPackName,
          KuskiIndex: player.KuskiIndex,
        }),
    })),
  });

  const historic = useMemo(() => {
    const dateMap = new Map();
    const addData = (playerData, key) => {
      playerData.forEach(d => {
        const date = new Date(d.timestamp * 1000).getTime();
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date)[key] = d.totalTime;
      });
    };
    queries.forEach((query, index) => {
      if (query.isSuccess) {
        addData(query.data.data, players[index].KuskiIndex);
      }
    });
    return Array.from(dateMap.values());
  }, [queries]);

  const yTicks = useMemo(() => generateTicksFromData(historic), [historic]);

  const xTicks = useMemo(() => getYearTicks(historic), [historic]);

  if (queries.some(query => query.isLoading)) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  return (
    <Container>
      <Header h3>Historical Total Time</Header>
      <ResponsiveContainer width="100%" height={600}>
        <LineChart data={historic}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={unixTime => {
              const date = new Date(unixTime);
              if (xTicks[1] === 'months') {
                return format(date, 'MMM yyyy');
              }
              if (xTicks[1] === 'years') {
                return format(date, 'yyyy');
              }
            }}
            ticks={xTicks[0]}
          />
          <YAxis
            label={{
              value: 'Total Time',
              angle: -90,
              position: 'insideLeft',
            }}
            tickFormatter={value => {
              const time = parseInt(value, 10);
              return formatTime(time);
            }}
            ticks={yTicks}
            domain={[yTicks[0], yTicks[yTicks.length - 1]]}
            width={90}
          />
          <Tooltip
            labelFormatter={value => {
              const time = parseInt(value, 10);
              return format(new Date(time), 'dd MMM yyyy');
            }}
            formatter={(value, name) => {
              const time = parseInt(value, 10);
              return [
                formatTime(time),
                players?.find(p => p.KuskiIndex === name)?.Kuski,
              ];
            }}
          />
          {players.map((p, index) => (
            <Line
              key={p.KuskiIndex}
              type="monotone"
              dataKey={p.KuskiIndex}
              stroke={`hsl(${(index * 360) / players.length}, 100%, 50%)`}
              strokeWidth={2}
              dot={false}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
};

const Container = styled.div`
  margin: 10px;
`;

export default TotalTimeChart;
