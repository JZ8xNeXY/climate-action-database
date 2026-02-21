'use client';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { dmMono } from '@/lib/fonts';
import { PaceStatus } from '@/types';
import StatusBadge from './StatusBadge';
import PaceBar from '../pace/PaceBar';

interface RankingRowProps {
  rank: number;
  name: string;
  reductionRate: number;
  actualPace: number;
  requiredPace: number;
  status: PaceStatus;
  cityCode?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function RankingRow({
  rank,
  name,
  reductionRate,
  actualPace,
  requiredPace,
  status,
  cityCode,
  onClick,
  isSelected = false,
}: RankingRowProps) {
  const content = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '40px 1fr 80px',
          md: '40px 2fr 100px 80px 80px 1fr 100px',
        },
        gap: 2,
        alignItems: 'center',
        p: 1.5,
        borderBottom: '1px solid rgba(200,191,168,0.35)',
        backgroundColor: isSelected
          ? 'rgba(184,150,46,0.08)'
          : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        '&:hover': onClick ? {
          backgroundColor: 'rgba(26,39,68,0.03)',
        } : {},
      }}
    >
      {/* ランク */}
      <Typography
        sx={{
          fontFamily: dmMono.style.fontFamily,
          fontSize: '16px',
          fontWeight: 400,
          color: 'text.secondary',
          textAlign: 'center',
        }}
      >
        {rank}
      </Typography>

      {/* 自治体名 */}
      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: 300,
          color: 'primary.main',
        }}
      >
        {name}
      </Typography>

      {/* ステータスバッジ（モバイル以外） */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <StatusBadge status={status} size="small" />
      </Box>

      {/* 削減率（モバイル以外） */}
      <Typography
        sx={{
          display: { xs: 'none', md: 'block' },
          fontFamily: dmMono.style.fontFamily,
          fontSize: '12px',
          textAlign: 'right',
          color: reductionRate < 0 ? 'success.main' : 'error.main',
        }}
      >
        {reductionRate > 0 ? '▲' : '▼'}{Math.abs(reductionRate).toFixed(1)}%
      </Typography>

      {/* 実績ペース（モバイル以外） */}
      <Typography
        sx={{
          display: { xs: 'none', md: 'block' },
          fontFamily: dmMono.style.fontFamily,
          fontSize: '12px',
          textAlign: 'right',
          color: 'text.primary',
        }}
      >
        {actualPace.toFixed(1)}%
      </Typography>

      {/* ペースバー（モバイル以外） */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <PaceBar
          actualPace={actualPace}
          requiredPace={requiredPace}
          status={status}
        />
      </Box>

      {/* ペース達成率 */}
      <Typography
        sx={{
          fontFamily: dmMono.style.fontFamily,
          fontSize: '14px',
          fontWeight: 400,
          textAlign: 'right',
          color: status === 'on-track'
            ? 'success.main'
            : status === 'at-risk'
            ? 'warning.main'
            : 'error.main',
        }}
      >
        {((actualPace / requiredPace) * 100).toFixed(0)}%
      </Typography>
    </Box>
  );

  if (cityCode && !onClick) {
    return (
      <Link
        href={`/tokyo/${cityCode}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {content}
      </Link>
    );
  }

  return content;
}
