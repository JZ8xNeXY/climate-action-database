'use client';

import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { dmMono, playfair } from '@/lib/fonts';

export default function SiteHeader() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'primary.main',
        borderBottom: '3px solid',
        borderBottomColor: 'secondary.main',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {/* ブランドマーク */}
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <Typography
            sx={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: '14px',
              color: 'secondary.light',
              fontWeight: 400,
            }}
          >
            CO₂
          </Typography>
        </Box>

        {/* タイトル */}
        <Box>
          <Typography
            sx={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: '9px',
              color: 'secondary.light',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              lineHeight: 1.2,
            }}
          >
            Climate Action
          </Typography>
          <Typography
            sx={{
              fontFamily: playfair.style.fontFamily,
              fontSize: '19px',
              color: 'background.default',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            実績データベース
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
