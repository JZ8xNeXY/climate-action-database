'use client';

import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { playfair, dmMono } from '@/lib/fonts';
import { PaceStatus, TrajectoryDataPoint } from '@/types';
import StatusBadge from '../ranking/StatusBadge';
import TrajectoryChart from './TrajectoryChart';

interface PaceHeroProps {
  actualPace: number;        // ▼2.4
  requiredPace: number;      // ▼3.2
  paceAchievementRate: number; // 75
  shortfall2030: number;     // 146 千t
  status: PaceStatus;
  trajectoryData: TrajectoryDataPoint[];
  dark?: boolean;
}

export default function PaceHero({
  actualPace,
  requiredPace,
  paceAchievementRate,
  shortfall2030,
  status,
  trajectoryData,
  dark = false,
}: PaceHeroProps) {
  const getBorderColor = (status: PaceStatus) => {
    switch (status) {
      case 'on-track': return '#2d6b45';
      case 'at-risk': return '#b87020';
      case 'off-track': return '#8b2a2a';
    }
  };

  return (
    <Card
      sx={{
        borderTop: `4px solid ${getBorderColor(status)}`,
        backgroundColor: dark ? 'primary.main' : 'background.paper',
        mb: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* ステータスバッジ */}
        <Box sx={{ mb: 2 }}>
          <StatusBadge status={status} />
        </Box>

        <Grid container spacing={4}>
          {/* 左側: ペース比較 */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                fontFamily: dmMono.style.fontFamily,
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: dark ? '#ffffff' : 'text.secondary',
                opacity: dark ? 0.9 : 1,
                mb: 2,
              }}
            >
              削減ペース分析
            </Box>

            {/* 実績ペース */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontFamily: dmMono.style.fontFamily,
                  fontSize: '11px',
                  color: dark ? '#ffffff' : 'text.secondary',
                opacity: dark ? 0.9 : 1,
                  mb: 0.5,
                }}
              >
                実績ペース（2013-2022）
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography
                  sx={{
                    fontFamily: playfair.style.fontFamily,
                    fontSize: '48px',
                    fontWeight: 700,
                    color: dark ? 'secondary.light' : 'secondary.main',
                    lineHeight: 1,
                  }}
                >
                  {actualPace.toFixed(1)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: dmMono.style.fontFamily,
                    fontSize: '14px',
                    color: dark ? '#ffffff' : 'text.secondary',
                opacity: dark ? 0.9 : 1,
                  }}
                >
                  %/年
                </Typography>
              </Box>
            </Box>

            {/* 必要ペース */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontFamily: dmMono.style.fontFamily,
                  fontSize: '11px',
                  color: dark ? '#ffffff' : 'text.secondary',
                  mb: 0.5,
                  opacity: dark ? 0.9 : 1,
                }}
              >
                必要ペース（2030目標▼46%達成）
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography
                  sx={{
                    fontFamily: playfair.style.fontFamily,
                    fontSize: '36px',
                    fontWeight: 700,
                    color: dark ? '#f5f0e8' : 'primary.main',
                    lineHeight: 1,
                  }}
                >
                  {requiredPace.toFixed(1)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: dmMono.style.fontFamily,
                    fontSize: '14px',
                    color: dark ? '#ffffff' : 'text.secondary',
                    opacity: dark ? 0.8 : 1,
                  }}
                >
                  %/年
                </Typography>
              </Box>
            </Box>

            {/* ペース達成率 */}
            <Box
              sx={{
                p: 2,
                backgroundColor: dark
                  ? 'rgba(245,240,232,0.1)'
                  : 'rgba(26,39,68,0.03)',
                borderLeft: `3px solid ${getBorderColor(status)}`,
              }}
            >
              <Typography
                sx={{
                  fontFamily: dmMono.style.fontFamily,
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: dark ? '#ffffff' : 'text.secondary',
                  opacity: dark ? 0.9 : 1,
                  mb: 1,
                }}
              >
                ペース達成率
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography
                  sx={{
                    fontFamily: playfair.style.fontFamily,
                    fontSize: '32px',
                    fontWeight: 700,
                    color: dark ? '#ffffff' : getBorderColor(status),
                    lineHeight: 1,
                  }}
                >
                  {paceAchievementRate.toFixed(0)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: dmMono.style.fontFamily,
                    fontSize: '14px',
                    color: dark ? '#ffffff' : 'text.secondary',
                    opacity: dark ? 0.8 : 1,
                  }}
                >
                  %
                </Typography>
              </Box>
              {shortfall2030 > 0 && (
                <Typography
                  sx={{
                    fontFamily: dmMono.style.fontFamily,
                    fontSize: '10px',
                    color: dark ? '#ffffff' : 'text.secondary',
                opacity: dark ? 0.9 : 1,
                    mt: 1,
                  }}
                >
                  2030年予測不足量: {shortfall2030.toFixed(0)} 千t-CO₂
                </Typography>
              )}
            </Box>
          </Grid>

          {/* 右側: 軌道グラフ */}
          <Grid item xs={12} md={6}>
            <TrajectoryChart data={trajectoryData} dark={dark} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
