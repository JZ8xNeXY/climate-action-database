'use client';

import { Box } from '@mui/material';
import { PaceStatus } from '@/types';

interface PaceBarProps {
  actualPace: number;
  requiredPace: number;
  status: PaceStatus;
  maxPace?: number;
}

export default function PaceBar({
  actualPace,
  requiredPace,
  status,
  maxPace = 5, // デフォルト最大ペース5%/年
}: PaceBarProps) {
  const actualPercentage = Math.min((actualPace / maxPace) * 100, 100);
  const requiredPercentage = Math.min((requiredPace / maxPace) * 100, 100);

  const getBarColor = (status: PaceStatus) => {
    switch (status) {
      case 'on-track': return '#2d6b45';
      case 'at-risk': return '#b87020';
      case 'off-track': return '#8b2a2a';
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '6px',
        backgroundColor: '#ede6d8',
        width: '100%',
      }}
    >
      {/* 実績バー */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${actualPercentage}%`,
          backgroundColor: getBarColor(status),
          transition: 'width 0.6s ease',
        }}
      />

      {/* 必要ペースマーカー */}
      <Box
        sx={{
          position: 'absolute',
          left: `${requiredPercentage}%`,
          top: 0,
          width: '2px',
          height: '100%',
          backgroundColor: 'rgba(26,39,68,0.5)',
        }}
      />
    </Box>
  );
}
