'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import SiteHeader from '@/components/layout/SiteHeader';

export default function TokyoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <SiteHeader />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 4,
            backgroundColor: 'background.paper',
            border: '2px solid',
            borderColor: 'error.main',
          }}
        >
          <Typography variant="h2" gutterBottom sx={{ color: 'error.main' }}>
            エラーが発生しました
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            データの読み込み中に問題が発生しました
          </Typography>

          {error.message && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: 'error.light',
                border: '1px solid',
                borderColor: 'error.main',
                textAlign: 'left',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'uppercase',
                  color: 'error.main',
                  display: 'block',
                  mb: 1,
                }}
              >
                エラー詳細
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: 'error.main',
                }}
              >
                {error.message}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={reset}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              再試行
            </Button>
            <Button
              variant="outlined"
              href="/"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
              }}
            >
              トップに戻る
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
