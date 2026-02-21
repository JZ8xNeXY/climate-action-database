'use client';

import { createTheme } from '@mui/material/styles';

// style.mdのカラーパレット
const colors = {
  navy: {
    main: '#1a2744',
    mid: '#243358',
    light: '#2e4070',
  },
  cream: {
    main: '#f5f0e8',
    dark: '#ede6d8',
  },
  gold: {
    main: '#b8962e',
    light: '#d4af50',
  },
  status: {
    green: '#2d6b45',
    greenLight: '#e8f5ed',
    amber: '#b87020',
    amberLight: '#fdf3e3',
    red: '#8b2a2a',
    redLight: '#f5e8e8',
  },
  border: {
    main: '#c8bfa8',
    dark: '#a09070',
  },
  text: {
    muted: '#6a6258',
  },
};

// グラフ配色
export const CHART_COLORS = {
  sector: {
    home: '#1a2744',       // 家庭
    business: '#3d5a8a',   // 業務
    transport: '#b8962e',  // 旅客
    industry: '#2d6b45',   // 製造業
    waste: '#c8bfa8',      // 廃棄物
    other: '#e0d8c8',      // その他
  },
  trajectory: {
    actual: '#b8962e',                    // 実績（ゴールド）
    required: 'rgba(26,39,68,0.25)',      // 必要軌道（薄紺）
    target2030: '#2d6b45',                // 2030目標マーカー
    target2050: 'rgba(93,196,122,0.7)',   // 2050目標マーカー
  },
  pace: {
    onTrack: '#2d6b45',
    atRisk: '#b87020',
    offTrack: '#8b2a2a',
    needed: 'rgba(26,39,68,0.15)',
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.navy.main,
      light: colors.navy.light,
      dark: colors.navy.mid,
    },
    secondary: {
      main: colors.gold.main,
      light: colors.gold.light,
    },
    background: {
      default: colors.cream.main,
      paper: '#ffffff',
    },
    success: {
      main: colors.status.green,
      light: colors.status.greenLight,
    },
    warning: {
      main: colors.status.amber,
      light: colors.status.amberLight,
    },
    error: {
      main: colors.status.red,
      light: colors.status.redLight,
    },
    divider: colors.border.main,
  },
  typography: {
    fontFamily: '"Noto Sans JP", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '32px',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '26px',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '22px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '13px',
      fontWeight: 300,
      letterSpacing: '0.04em',
    },
    body2: {
      fontSize: '12px',
      fontWeight: 300,
      letterSpacing: '0.04em',
    },
    button: {
      fontFamily: '"DM Mono", monospace',
      fontSize: '10px',
      fontWeight: 400,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: '"DM Mono", monospace',
      fontSize: '9px',
      fontWeight: 300,
      letterSpacing: '0.14em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.cream.main,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid ${colors.border.main}`,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase',
          fontFamily: '"DM Mono", monospace',
          letterSpacing: '0.18em',
        },
      },
    },
  },
});

export default theme;
