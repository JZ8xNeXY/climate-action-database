'use client';

import { Box, Typography } from '@mui/material';
import { dmMono } from '@/lib/fonts';
import { PaceStatus } from '@/types';
import RankingRow from './RankingRow';

// Database response type (snake_case from Supabase)
interface MunicipalityKpiDb {
  city_code: string;
  pref_rank: number | null;
  municipalities?: {
    name: string;
    population: number;
    zero_carbon_declared: boolean;
  } | null;
  reduction_rate: string | number;
  actual_pace: string | number;
  required_pace: string | number;
  status: PaceStatus;
}

interface RankingListProps {
  municipalities: MunicipalityKpiDb[];
  onMunicipalityClick?: (cityCode: string) => void;
  selectedCityCode?: string;
  title?: string;
}

export default function RankingList({
  municipalities,
  onMunicipalityClick,
  selectedCityCode,
  title = '自治体ランキング',
}: RankingListProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* ヘッダー */}
      <Box
        sx={{
          p: 2,
          borderBottom: '2px solid',
          borderBottomColor: 'divider',
        }}
      >
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'text.secondary',
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
      </Box>

      {/* テーブルヘッダー（デスクトップ） */}
      <Box
        sx={{
          display: { xs: 'none', md: 'grid' },
          gridTemplateColumns: '40px 2fr 100px 80px 80px 1fr 100px',
          gap: 2,
          p: 1.5,
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          backgroundColor: 'rgba(26,39,68,0.02)',
        }}
      >
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          順位
        </Typography>
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'text.secondary',
          }}
        >
          自治体名
        </Typography>
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'text.secondary',
          }}
        >
          ステータス
        </Typography>
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'text.secondary',
            textAlign: 'right',
          }}
        >
          削減率
        </Typography>
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'text.secondary',
            textAlign: 'right',
          }}
        >
          実績ペース
        </Typography>
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'text.secondary',
          }}
        >
          ペースバー
        </Typography>
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'text.secondary',
            textAlign: 'right',
          }}
        >
          達成率
        </Typography>
      </Box>

      {/* ランキング行 */}
      <Box>
        {municipalities.map((municipality, index) => (
          <RankingRow
            key={municipality.city_code}
            rank={municipality.pref_rank || index + 1}
            name={municipality.municipalities?.name || '不明'}
            reductionRate={Number(municipality.reduction_rate)}
            actualPace={Number(municipality.actual_pace)}
            requiredPace={Number(municipality.required_pace)}
            status={municipality.status}
            cityCode={municipality.city_code}
            onClick={
              onMunicipalityClick
                ? () => onMunicipalityClick(municipality.city_code)
                : undefined
            }
            isSelected={municipality.city_code === selectedCityCode}
          />
        ))}
      </Box>
    </Box>
  );
}
