import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import { dmMono } from '@/lib/fonts';
import { getPrefectureRankings } from '@/lib/queries';

export default async function HomePage() {
  // Phase 1: 東京都のみ
  const prefectures = await getPrefectureRankings();
  const tokyoData = prefectures?.find(p => p.prefecture_code === '13');

  if (!tokyoData) {
    return (
      <>
        <SiteHeader />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography>データを読み込めませんでした</Typography>
        </Container>
      </>
    );
  }

  const prefecture = {
    code: tokyoData.prefecture_code,
    name: tokyoData.prefecture_name,
    slug: tokyoData.prefecture_slug,
    actualPace: Number(tokyoData.actual_pace),
    requiredPace: Number(tokyoData.required_pace),
    paceAchievementRate: Number(tokyoData.pace_achievement_rate),
    status: tokyoData.status as 'on-track' | 'at-risk' | 'off-track',
    municipalityCount: tokyoData.municipality_count || 0,
    onTrackCount: tokyoData.on_track_count || 0,
    atRiskCount: tokyoData.at_risk_count || 0,
    offTrackCount: tokyoData.off_track_count || 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return '#2d6b45';
      case 'at-risk': return '#b87020';
      case 'off-track': return '#8b2a2a';
      default: return '#1a2744';
    }
  };

  return (
    <>
      <SiteHeader />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* ヘッダー */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h1" gutterBottom>
            気候変動対策 実績データベース
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
            日本全国の自治体・都道府県のCO₂排出削減「実績ペース」を可視化
          </Typography>
          <Typography
            sx={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: '11px',
              color: 'text.secondary',
              letterSpacing: '0.1em',
            }}
          >
            必要ペース（%/年）vs 実績ペース（%/年）の比較
          </Typography>
        </Box>

        {/* Phase 1 メッセージ */}
        <Box
          sx={{
            mb: 4,
            p: 2,
            backgroundColor: 'rgba(184,150,46,0.08)',
            border: '1px solid',
            borderColor: 'secondary.main',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'secondary.main',
              mb: 0.5,
            }}
          >
            Phase 1 - MVP
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            現在は東京都のデータのみ公開中。全国展開は Phase 2 で実装予定。
          </Typography>
        </Box>

        {/* 都道府県カード */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontFamily: dmMono.style.fontFamily,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'text.secondary',
              mb: 3,
              '&::before': {
                content: '""',
                display: 'inline-block',
                width: '24px',
                height: '2px',
                backgroundColor: 'primary.main',
                marginRight: '12px',
                verticalAlign: 'middle',
              },
            }}
          >
            都道府県
          </Typography>

          <Link href={`/${prefecture.slug}`} style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                borderTop: `4px solid ${getStatusColor(prefecture.status)}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4} alignItems="center">
                  {/* 都道府県名 */}
                  <Grid item xs={12} md={3}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: '36px',
                        color: 'primary.main',
                        mb: 1,
                      }}
                    >
                      {prefecture.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: dmMono.style.fontFamily,
                        fontSize: '10px',
                        color: 'text.secondary',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {prefecture.municipalityCount}自治体
                    </Typography>
                  </Grid>

                  {/* ペース情報 */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        sx={{
                          fontFamily: dmMono.style.fontFamily,
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.22em',
                          color: 'text.secondary',
                          mb: 0.5,
                        }}
                      >
                        実績ペース
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography
                          sx={{
                            fontFamily: 'Playfair Display',
                            fontSize: '28px',
                            fontWeight: 700,
                            color: 'secondary.main',
                          }}
                        >
                          {prefecture.actualPace.toFixed(1)}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: dmMono.style.fontFamily,
                            fontSize: '12px',
                            color: 'text.secondary',
                          }}
                        >
                          %/年
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontFamily: dmMono.style.fontFamily,
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.22em',
                          color: 'text.secondary',
                          mb: 0.5,
                        }}
                      >
                        ペース達成率
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography
                          sx={{
                            fontFamily: 'Playfair Display',
                            fontSize: '28px',
                            fontWeight: 700,
                            color: getStatusColor(prefecture.status),
                          }}
                        >
                          {prefecture.paceAchievementRate.toFixed(0)}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: dmMono.style.fontFamily,
                            fontSize: '12px',
                            color: 'text.secondary',
                          }}
                        >
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* ステータス統計 */}
                  <Grid item xs={12} md={5}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            sx={{
                              fontFamily: 'Playfair Display',
                              fontSize: '32px',
                              fontWeight: 700,
                              color: '#2d6b45',
                              lineHeight: 1,
                            }}
                          >
                            {prefecture.onTrackCount}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: dmMono.style.fontFamily,
                              fontSize: '9px',
                              textTransform: 'uppercase',
                              color: '#2d6b45',
                              mt: 0.5,
                            }}
                          >
                            On Track
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            sx={{
                              fontFamily: 'Playfair Display',
                              fontSize: '32px',
                              fontWeight: 700,
                              color: '#b87020',
                              lineHeight: 1,
                            }}
                          >
                            {prefecture.atRiskCount}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: dmMono.style.fontFamily,
                              fontSize: '9px',
                              textTransform: 'uppercase',
                              color: '#b87020',
                              mt: 0.5,
                            }}
                          >
                            At Risk
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            sx={{
                              fontFamily: 'Playfair Display',
                              fontSize: '32px',
                              fontWeight: 700,
                              color: '#8b2a2a',
                              lineHeight: 1,
                            }}
                          >
                            {prefecture.offTrackCount}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: dmMono.style.fontFamily,
                              fontSize: '9px',
                              textTransform: 'uppercase',
                              color: '#8b2a2a',
                              mt: 0.5,
                            }}
                          >
                            Off Track
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* アクションヒント */}
                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid',
                    borderTopColor: 'divider',
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: dmMono.style.fontFamily,
                      fontSize: '10px',
                      color: 'secondary.main',
                      letterSpacing: '0.1em',
                    }}
                  >
                    クリックして詳細を見る →
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Link>
        </Box>

        {/* プロジェクト情報 */}
        <Box
          sx={{
            p: 3,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            component="div"
            variant="caption"
            sx={{
              textTransform: 'uppercase',
              color: 'text.secondary',
              display: 'block',
              mb: 1.5,
            }}
          >
            このデータベースについて
          </Typography>
          <Typography component="div" variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            環境省「自治体排出量カルテ」のデータをもとに、各自治体のCO₂削減実績を「ペース」で評価。
            <br />
            2030年・2050年の目標達成に向けて、本当に真剣に取り組んでいるかを数字で示します。
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography
                component="div"
                sx={{
                  fontFamily: dmMono.style.fontFamily,
                  fontSize: '9px',
                  color: 'text.secondary',
                  mb: 0.5,
                }}
              >
                基準年
              </Typography>
              <Typography component="div" variant="body2">2013年度（パリ協定基準）</Typography>
            </Box>
            <Box>
              <Typography
                component="div"
                sx={{
                  fontFamily: dmMono.style.fontFamily,
                  fontSize: '9px',
                  color: 'text.secondary',
                  mb: 0.5,
                }}
              >
                最新データ
              </Typography>
              <Typography component="div" variant="body2">2022年度</Typography>
            </Box>
            <Box>
              <Typography
                component="div"
                sx={{
                  fontFamily: dmMono.style.fontFamily,
                  fontSize: '9px',
                  color: 'text.secondary',
                  mb: 0.5,
                }}
              >
                対象
              </Typography>
              <Typography component="div" variant="body2">東京都62自治体（Phase 1）</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
