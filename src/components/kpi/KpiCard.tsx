'use client';

import { Box, Typography } from '@mui/material';
import { playfair, dmMono } from '@/lib/fonts';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subText?: string;
  subColor?: 'green' | 'red' | 'muted';
  accentColor?: 'navy' | 'green' | 'gold' | 'red';
}

export default function KpiCard({
  label,
  value,
  unit,
  subText,
  subColor = 'muted',
  accentColor = 'navy',
}: KpiCardProps) {
  const getAccentColor = () => {
    switch (accentColor) {
      case 'navy': return '#1a2744';
      case 'green': return '#2d6b45';
      case 'gold': return '#b8962e';
      case 'red': return '#8b2a2a';
    }
  };

  const getSubTextColor = () => {
    switch (subColor) {
      case 'green': return '#2d6b45';
      case 'red': return '#8b2a2a';
      case 'muted': return '#6a6258';
    }
  };

  return (
    <Box
      sx={{
        p: 2.5,
        backgroundColor: 'background.paper',
        borderTop: `3px solid ${getAccentColor()}`,
        borderRight: '1px solid',
        borderRightColor: 'divider',
        '&:last-child': {
          borderRight: 'none',
        },
      }}
    >
      {/* ラベル */}
      <Typography
        sx={{
          fontFamily: dmMono.style.fontFamily,
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: 'text.secondary',
          mb: 1.5,
          '&::before': {
            content: '""',
            display: 'inline-block',
            width: '12px',
            height: '2px',
            backgroundColor: getAccentColor(),
            marginRight: '8px',
            verticalAlign: 'middle',
          },
        }}
      >
        {label}
      </Typography>

      {/* 値 */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.5 }}>
        <Typography
          sx={{
            fontFamily: playfair.style.fontFamily,
            fontSize: '36px',
            fontWeight: 700,
            color: getAccentColor(),
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
        {unit && (
          <Typography
            sx={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: '12px',
              color: 'text.secondary',
            }}
          >
            {unit}
          </Typography>
        )}
      </Box>

      {/* サブテキスト */}
      {subText && (
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '10px',
            color: getSubTextColor(),
            letterSpacing: '0.04em',
          }}
        >
          {subText}
        </Typography>
      )}
    </Box>
  );
}
