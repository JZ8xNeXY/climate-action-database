'use client';

import { Box } from '@mui/material';
import KpiCard from './KpiCard';

interface KpiStripProps {
  totalEmission: number;        // 千t-CO₂
  emissionPerCapita: number;    // t-CO₂/人
  deviationScore: number;       // 偏差値
  shortfall2030: number;        // 千t-CO₂
  reductionRate: number;        // %
}

export default function KpiStrip({
  totalEmission,
  emissionPerCapita,
  deviationScore,
  shortfall2030,
  reductionRate,
}: KpiStripProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        border: '1px solid',
        borderColor: 'divider',
        mb: 3,
      }}
    >
      <KpiCard
        label="総排出量"
        value={totalEmission.toFixed(0)}
        unit="千t-CO₂"
        subText={`2013比 ${reductionRate > 0 ? '▲' : '▼'}${Math.abs(reductionRate).toFixed(1)}%`}
        subColor={reductionRate < 0 ? 'green' : 'red'}
        accentColor="navy"
      />

      <KpiCard
        label="一人あたり"
        value={emissionPerCapita.toFixed(2)}
        unit="t-CO₂"
        accentColor="gold"
      />

      <KpiCard
        label="偏差値"
        value={deviationScore.toFixed(0)}
        subText="同規模自治体内"
        accentColor={deviationScore >= 50 ? 'green' : 'red'}
      />

      <KpiCard
        label="2030年予測不足量"
        value={shortfall2030 > 0 ? shortfall2030.toFixed(0) : '0'}
        unit="千t-CO₂"
        subText={shortfall2030 > 0 ? '削減不足' : '目標達成'}
        subColor={shortfall2030 > 0 ? 'red' : 'green'}
        accentColor={shortfall2030 > 0 ? 'red' : 'green'}
      />
    </Box>
  );
}
