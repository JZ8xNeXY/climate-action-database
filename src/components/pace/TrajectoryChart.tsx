'use client';

import { Box, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { dmMono } from '@/lib/fonts';
import { TrajectoryDataPoint } from '@/types';
import { CHART_COLORS } from '@/lib/theme';

interface TrajectoryChartProps {
  data: TrajectoryDataPoint[];
  dark?: boolean;
}

export default function TrajectoryChart({ data, dark = false }: TrajectoryChartProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: dmMono.style.fontFamily,
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: dark ? 'background.default' : 'text.secondary',
          mb: 2,
        }}
      >
        排出量軌道
      </Typography>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,191,168,0.3)" />
          <XAxis
            dataKey="year"
            tick={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: 9,
              fill: dark ? '#f5f0e8' : '#6a6258',
            }}
            stroke={dark ? '#f5f0e8' : '#c8bfa8'}
          />
          <YAxis
            tick={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: 9,
              fill: dark ? '#f5f0e8' : '#6a6258',
            }}
            stroke={dark ? '#f5f0e8' : '#c8bfa8'}
            label={{
              value: '千t-CO₂',
              angle: -90,
              position: 'insideLeft',
              style: {
                fontFamily: dmMono.style.fontFamily,
                fontSize: 9,
                fill: dark ? '#f5f0e8' : '#6a6258',
              },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: dark ? '#1a2744' : '#ffffff',
              border: '1px solid #c8bfa8',
              borderRadius: 0,
              fontFamily: dmMono.style.fontFamily,
              fontSize: 10,
            }}
            labelStyle={{
              color: dark ? '#f5f0e8' : '#1a2744',
            }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: 9,
            }}
          />

          {/* 実績軌道 */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke={CHART_COLORS.trajectory.actual}
            strokeWidth={3}
            dot={{ r: 3 }}
            name="実績"
            connectNulls
          />

          {/* 必要軌道 */}
          <Line
            type="monotone"
            dataKey="required"
            stroke={dark ? '#f5f0e8' : '#1a2744'}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="必要軌道"
            connectNulls
          />

          {/* 2030目標 */}
          <Line
            type="monotone"
            dataKey="target2030"
            stroke={CHART_COLORS.trajectory.target2030}
            strokeWidth={2}
            dot={{ r: 5 }}
            name="2030目標"
            connectNulls
          />

          {/* 2050目標 */}
          <Line
            type="monotone"
            dataKey="target2050"
            stroke={CHART_COLORS.trajectory.target2050}
            strokeWidth={2}
            dot={{ r: 5 }}
            name="2050目標"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
