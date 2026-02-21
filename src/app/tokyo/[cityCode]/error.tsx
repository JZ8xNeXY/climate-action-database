'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import SiteHeader from '@/components/layout/SiteHeader';

export default function MunicipalityError({
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
            自治体データが見つかりません
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            指定された自治体のデータを読み込めませんでした
          </Typography>

          <Box
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: 'rgba(184,150,46,0.05)',
              border: '1px solid',
              borderColor: 'secondary.main',
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mb: 2 }}
            >
              考えられる原因:
            </Typography>
            <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mb: 1 }}
              >
                • 団体コードが正しくない
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mb: 1 }}
              >
                • Supabaseにデータが投入されていない
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • ネットワーク接続の問題
              </Typography>
            </Box>
          </Box>

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
              href="/tokyo"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
              }}
            >
              東京都ビューに戻る
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
