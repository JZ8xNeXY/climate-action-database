import { Box, Container, Skeleton } from '@mui/material';
import SiteHeader from '@/components/layout/SiteHeader';

export default function TokyoLoading() {
  return (
    <>
      <SiteHeader />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* パンくず */}
        <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />

        {/* タイトル */}
        <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={400} height={24} sx={{ mb: 4 }} />

        {/* ペースヒーロー */}
        <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />

        {/* 統計サマリー */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}>
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="rectangular" height={120} />
        </Box>

        {/* ランキング */}
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={600} />
      </Container>
    </>
  );
}
