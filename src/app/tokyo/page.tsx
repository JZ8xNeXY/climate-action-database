import { Box, Container, Typography, Grid } from '@mui/material';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/layout/SiteHeader';
import PaceHero from '@/components/pace/PaceHero';
import RankingList from '@/components/ranking/RankingList';
import { getPrefectureWithMunicipalities } from '@/lib/queries';
import { sampleTrajectory } from '@/data/sampleData';

export const metadata = {
  title: '東京都 - 気候変動対策 実績データベース',
  description: '東京都の自治体別CO₂削減実績とペース分析',
};

export default async function TokyoPage() {
  try {
    // Supabaseからデータ取得
    const { prefecture, municipalities } = await getPrefectureWithMunicipalities('13');

    return (
      <>
        <SiteHeader />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* パンくず */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >
              <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                トップ
              </a>
              {' / '}
              <span style={{ color: '#1a2744' }}>東京都</span>
            </Typography>
          </Box>

          {/* タイトル */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h1" gutterBottom>
              東京都
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {prefecture.municipality_count}自治体のCO₂削減実績とペース分析
            </Typography>
          </Box>

          {/* ペースヒーロー */}
          <PaceHero
            actualPace={Number(prefecture.actual_pace)}
            requiredPace={Number(prefecture.required_pace)}
            paceAchievementRate={Number(prefecture.pace_achievement_rate)}
            shortfall2030={Number(prefecture.shortfall_2030_mt) * 1000}  // 百万t → 千t
            status={prefecture.status}
            trajectoryData={sampleTrajectory}
          />

          {/* 統計サマリー */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  p: 2.5,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    display: 'block',
                    mb: 1,
                  }}
                >
                  総排出量（2022）
                </Typography>
                <Typography variant="h3" sx={{ color: 'primary.main' }}>
                  {Number(prefecture.latest_emission_mt).toFixed(2)}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ ml: 0.5, color: 'text.secondary' }}
                  >
                    百万t-CO₂
                  </Typography>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  p: 2.5,
                  backgroundColor: 'success.light',
                  border: '1px solid',
                  borderColor: 'success.main',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'uppercase',
                    color: 'success.main',
                    display: 'block',
                    mb: 1,
                  }}
                >
                  ON TRACK
                </Typography>
                <Typography variant="h3" sx={{ color: 'success.main' }}>
                  {prefecture.on_track_count}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ ml: 0.5 }}
                  >
                    自治体
                  </Typography>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  p: 2.5,
                  backgroundColor: 'warning.light',
                  border: '1px solid',
                  borderColor: 'warning.main',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'uppercase',
                    color: 'warning.main',
                    display: 'block',
                    mb: 1,
                  }}
                >
                  AT RISK
                </Typography>
                <Typography variant="h3" sx={{ color: 'warning.main' }}>
                  {prefecture.at_risk_count}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ ml: 0.5 }}
                  >
                    自治体
                  </Typography>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  p: 2.5,
                  backgroundColor: 'error.light',
                  border: '1px solid',
                  borderColor: 'error.main',
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
                  OFF TRACK
                </Typography>
                <Typography variant="h3" sx={{ color: 'error.main' }}>
                  {prefecture.off_track_count}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ ml: 0.5 }}
                  >
                    自治体
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* 自治体ランキング */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h2" gutterBottom>
              自治体ランキング
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
              ペース達成率順
            </Typography>

            {municipalities.length > 0 ? (
              <RankingList
                municipalities={municipalities}
                title="都内62自治体"
              />
            ) : (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  データを読み込み中...
                  <br />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Supabaseにデータを投入してください
                  </Typography>
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </>
    );
  } catch (error) {
    console.error('Error loading Tokyo page:', error);
    notFound();
  }
}
