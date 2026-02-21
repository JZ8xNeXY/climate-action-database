'use client';

import { Box, Typography } from '@mui/material';
import { dmMono } from '@/lib/fonts';

interface DeviationMeterProps {
  score: number;  // 偏差値（30-70程度）
  label?: string;
}

export default function DeviationMeter({
  score,
  label = '同規模自治体内での相対位置',
}: DeviationMeterProps) {
  // 偏差値を0-100の範囲に正規化（30-70 → 0-100）
  const normalizedScore = Math.max(0, Math.min(100, ((score - 30) / 40) * 100));

  // 色を偏差値に応じて変更
  const getColor = () => {
    if (score >= 60) return '#2d6b45';      // 緑（良い）
    if (score >= 50) return '#b8962e';      // 金（平均）
    if (score >= 40) return '#b87020';      // 琥珀（やや低い）
    return '#8b2a2a';                       // 赤（低い）
  };

  const getRank = () => {
    if (score >= 60) return '上位';
    if (score >= 55) return 'やや上位';
    if (score >= 45) return '平均的';
    if (score >= 40) return 'やや下位';
    return '下位';
  };

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: dmMono.style.fontFamily,
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: 'text.secondary',
          mb: 1,
        }}
      >
        偏差値
      </Typography>

      <Box sx={{ mb: 1 }}>
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '10px',
            color: 'text.secondary',
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            sx={{
              fontFamily: 'Playfair Display',
              fontSize: '32px',
              fontWeight: 700,
              color: getColor(),
              lineHeight: 1,
            }}
          >
            {score.toFixed(1)}
          </Typography>
          <Typography
            sx={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: '11px',
              color: getColor(),
              ml: 1,
            }}
          >
            ({getRank()})
          </Typography>
        </Box>
      </Box>

      {/* スケールバー */}
      <Box
        sx={{
          position: 'relative',
          height: '24px',
          backgroundColor: '#ede6d8',
          border: '1px solid #c8bfa8',
        }}
      >
        {/* 平均線（偏差値50） */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: 'rgba(26,39,68,0.3)',
            zIndex: 1,
          }}
        />

        {/* 現在位置インジケーター */}
        <Box
          sx={{
            position: 'absolute',
            left: `${normalizedScore}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: getColor(),
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 2,
          }}
        />

        {/* グラデーション背景 */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, rgba(139,42,42,0.1) 0%, rgba(45,107,69,0.1) 100%)',
          }}
        />
      </Box>

      {/* ラベル */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 0.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '8px',
            color: 'text.secondary',
          }}
        >
          30（低い）
        </Typography>
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '8px',
            color: 'text.secondary',
          }}
        >
          50（平均）
        </Typography>
        <Typography
          sx={{
            fontFamily: dmMono.style.fontFamily,
            fontSize: '8px',
            color: 'text.secondary',
          }}
        >
          70（高い）
        </Typography>
      </Box>
    </Box>
  );
}
