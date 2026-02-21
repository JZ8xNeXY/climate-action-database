'use client';

import { Chip } from '@mui/material';
import { dmMono } from '@/lib/fonts';
import { PaceStatus } from '@/types';

interface StatusBadgeProps {
  status: PaceStatus;
  size?: 'small' | 'medium';
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const getStatusConfig = (status: PaceStatus) => {
    switch (status) {
      case 'on-track':
        return {
          label: 'ON TRACK',
          backgroundColor: '#e8f5ed',
          color: '#2d6b45',
          borderColor: 'rgba(45,107,69,0.3)',
        };
      case 'at-risk':
        return {
          label: 'AT RISK',
          backgroundColor: '#fdf3e3',
          color: '#b87020',
          borderColor: 'rgba(184,112,32,0.3)',
        };
      case 'off-track':
        return {
          label: 'OFF TRACK',
          backgroundColor: '#f5e8e8',
          color: '#8b2a2a',
          borderColor: 'rgba(139,42,42,0.3)',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        fontFamily: dmMono.style.fontFamily,
        fontSize: size === 'small' ? '9px' : '10px',
        fontWeight: 400,
        letterSpacing: '0.18em',
        backgroundColor: config.backgroundColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
        borderRadius: 0,
        height: size === 'small' ? '20px' : '24px',
        px: size === 'small' ? 0.5 : 1,
      }}
    />
  );
}
