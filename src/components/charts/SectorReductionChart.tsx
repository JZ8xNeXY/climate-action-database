'use client';

import { Box, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { dmMono } from '@/lib/fonts';

interface SectorReduction {
  sector: string;
  rate: number;  // 削減率（負の値 = 削減）
}

interface SectorReductionChartProps {
  data: SectorReduction[];
  title?: string;
}

export default function SectorReductionChart({
  data,
  title = '部門別削減率（2013年度比）',
}: SectorReductionChartProps) {
  // データを削減率順にソート
  const sortedData = [...data].sort((a, b) => a.rate - b.rate);

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: dmMono.style.fontFamily,
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: 'text.secondary',
          mb: 2,
          '&::before': {
            content: '""',
            display: 'inline-block',
            width: '12px',
            height: '2px',
            backgroundColor: 'primary.main',
            marginRight: '8px',
            verticalAlign: 'middle',
          },
        }}
      >
        {title}
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,191,168,0.3)" />
          <XAxis
            type="number"
            tick={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: 9,
              fill: '#6a6258',
            }}
            stroke="#c8bfa8"
            label={{
              value: '削減率 (%)',
              position: 'insideBottom',
              offset: -5,
              style: {
                fontFamily: dmMono.style.fontFamily,
                fontSize: 9,
                fill: '#6a6258',
              },
            }}
          />
          <YAxis
            type="category"
            dataKey="sector"
            tick={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: 10,
              fill: '#1a2744',
            }}
            stroke="#c8bfa8"
            width={75}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #c8bfa8',
              borderRadius: 0,
              fontFamily: dmMono.style.fontFamily,
              fontSize: 10,
            }}
            formatter={(value: number) => [
              `${value > 0 ? '+' : ''}${value.toFixed(1)}%`,
              '削減率',
            ]}
          />

          <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.rate < 0 ? '#2d6b45' : '#8b2a2a'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Box sx={{ mt: 2, display: 'flex', gap: 3, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              backgroundColor: '#2d6b45',
            }}
          />
          <Typography
            sx={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: '9px',
              color: 'text.secondary',
            }}
          >
            削減（マイナス）
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              backgroundColor: '#8b2a2a',
            }}
          />
          <Typography
            sx={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: '9px',
              color: 'text.secondary',
            }}
          >
            増加（プラス）
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
