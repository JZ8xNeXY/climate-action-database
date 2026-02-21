'use client';

import { Box, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { dmMono } from '@/lib/fonts';
import { CHART_COLORS } from '@/lib/theme';
import { TrendDataPoint } from '@/types';

interface SectorTrendChartProps {
  data: TrendDataPoint[];
  title?: string;
}

export default function SectorTrendChart({
  data,
  title = '部門別排出量推移',
}: SectorTrendChartProps) {
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

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,191,168,0.3)" />
          <XAxis
            dataKey="year"
            tick={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: 9,
              fill: '#6a6258',
            }}
            stroke="#c8bfa8"
          />
          <YAxis
            tick={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: 9,
              fill: '#6a6258',
            }}
            stroke="#c8bfa8"
            label={{
              value: '千t-CO₂',
              angle: -90,
              position: 'insideLeft',
              style: {
                fontFamily: dmMono.style.fontFamily,
                fontSize: 9,
                fill: '#6a6258',
              },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #c8bfa8',
              borderRadius: 0,
              fontFamily: dmMono.style.fontFamily,
              fontSize: 10,
            }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: 9,
            }}
          />

          <Bar
            dataKey="home"
            stackId="a"
            fill={CHART_COLORS.sector.home}
            name="家庭"
          />
          <Bar
            dataKey="business"
            stackId="a"
            fill={CHART_COLORS.sector.business}
            name="業務その他"
          />
          <Bar
            dataKey="transport"
            stackId="a"
            fill={CHART_COLORS.sector.transport}
            name="旅客"
          />
          <Bar
            dataKey="industry"
            stackId="a"
            fill={CHART_COLORS.sector.industry}
            name="製造業"
          />
          <Bar
            dataKey="waste"
            stackId="a"
            fill={CHART_COLORS.sector.waste}
            name="廃棄物"
          />
          <Bar
            dataKey="other"
            stackId="a"
            fill={CHART_COLORS.sector.other}
            name="その他"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
