import { Box, Container, Skeleton } from '@mui/material';
import SiteHeader from '@/components/layout/SiteHeader';

export default function MunicipalityLoading() {
  return (
    <>
      <SiteHeader />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* パンくず */}
        <Skeleton variant="text" width={300} height={24} sx={{ mb: 2 }} />

        {/* タイトル */}
        <Skeleton variant="text" width={250} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={400} height={24} sx={{ mb: 4 }} />

        {/* ペースヒーロー */}
        <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />

        {/* KPIストリップ */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, mb: 3 }}>
          <Skeleton variant="rectangular" height={140} />
          <Skeleton variant="rectangular" height={140} />
          <Skeleton variant="rectangular" height={140} />
          <Skeleton variant="rectangular" height={140} />
        </Box>

        {/* 基本情報 */}
        <Skeleton variant="rectangular" height={150} sx={{ mb: 4 }} />

        {/* 部門別グラフ */}
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    </>
  );
}
