import React from 'react';
import styled from '@emotion/styled';
import { colorPool } from 'utils/misc';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
} from 'recharts';
import { camelToTitleCase } from 'utils/misc';

export const ChartPie = ({ data, label, light = false }) => {
  return (
    <ChartCon>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill={light ? '#b1b0cf' : '#4f4d7c'}
            dataKey="value"
            label={label}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCon>
  );
};

export const ChartLine = ({ data, keys = [], names = [] }) => {
  return (
    <WideChartCon>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={600}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={value => value.toLocaleString()}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value, tipName, index) => [
              value.toLocaleString(),
              names[index] ? names[index] : camelToTitleCase(tipName),
            ]}
            labelStyle={{ color: 'black' }}
          />
          <Legend
            formatter={(value, entry, index) =>
              names[index] ? names[index] : camelToTitleCase(value)
            }
          />
          {keys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              name={names[index] ? names[index] : key}
              dataKey={key}
              stroke={colorPool[index]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </WideChartCon>
  );
};

export const ChartCon = styled.div`
  height: 400px;
  width: 600px;
  z-index: 1;
  @media (max-width: 599px) {
    width: 100%;
  }
`;

export const WideChartCon = styled.div`
  height: 600px;
  width: 100%;
  z-index: 1;
`;
