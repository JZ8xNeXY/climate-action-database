import { Box, Container, Typography, Grid } from '@mui/material';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/layout/SiteHeader';
import PaceHero from '@/components/pace/PaceHero';
import KpiStrip from '@/components/kpi/KpiStrip';
import DeviationMeter from '@/components/kpi/DeviationMeter';
import SectorTrendChart from '@/components/charts/SectorTrendChart';
import SectorReductionChart from '@/components/charts/SectorReductionChart';
import { getMunicipalityDetail } from '@/lib/queries';

export const metadata = {
  title: '自治体詳細 - 気候変動対策 実績データベース',
};

interface PageProps {
  params: {
    cityCode: string;
  };
}

export default async function MunicipalityPage({ params }: PageProps) {
  const { cityCode } = params;

  try {
    // Supabaseからデータ取得
    const { kpi, emissions } = await getMunicipalityDetail(cityCode);

    // データ構造を変換
    const municipality = {
      cityCode: kpi.city_code,
      name: kpi.municipalities?.name || '不明',
      population: kpi.municipalities?.population || 0,
      area: kpi.municipalities?.area_km2 || 0,
      zeroCarbonDeclared: kpi.municipalities?.zero_carbon_declared || false,
      latestYear: kpi.latest_year,
      latestEmission: Number(kpi.latest_emission_kt),
      actualPace: Number(kpi.actual_pace),
      requiredPace: Number(kpi.required_pace),
      paceAchievementRate: Number(kpi.pace_achievement_rate),
      shortfall2030: Number(kpi.shortfall_2030_kt || 0),
      status: kpi.status,
      emissionPerCapita: Number(kpi.emission_per_capita || 0),
      deviationScore: Number(kpi.deviation_score || 50),
      prefRank: kpi.pref_rank || 0,
      reductionRate: Number(kpi.reduction_rate),
    };

    // チャート用データを生成
    // 1. 部門別推移データ
    const sectorsByYear: { [year: number]: { [sector: string]: number } } = {};
    emissions.forEach((e: any) => {
      if (!sectorsByYear[e.fiscal_year]) {
        sectorsByYear[e.fiscal_year] = {};
      }
      sectorsByYear[e.fiscal_year][e.sector] = Number(e.value_kt_co2);
    });

    const years = Object.keys(sectorsByYear).map(Number).sort();
    const sectorTrendData = years.map(year => {
      const yearData = sectorsByYear[year];
      return {
        year,
        industry: (yearData['製造業'] || 0) + (yearData['建設業'] || 0) + (yearData['農林水産業'] || 0),
        business: yearData['業務その他'] || 0,
        home: yearData['家庭'] || 0,
        transport: (yearData['旅客'] || 0) + (yearData['貨物'] || 0) + (yearData['鉄道'] || 0) + (yearData['船舶'] || 0),
        waste: yearData['廃棄物'] || 0,
        total: Object.values(yearData).reduce((sum: number, val: number) => sum + val, 0),
      };
    });

    // 2. 部門別削減率データ
    const baseYear = kpi.base_year || 2013;
    const baseYearData = sectorsByYear[baseYear] || {};
    const latestYearData = sectorsByYear[kpi.latest_year] || {};

    const sectors = ['製造業', '建設業', '農林水産業', '業務その他', '家庭', '旅客', '貨物', '鉄道', '船舶', '廃棄物'];
    const sectorReductionData = sectors.map(sector => {
      const baseValue = baseYearData[sector] || 0;
      const latestValue = latestYearData[sector] || 0;
      const reduction = baseValue > 0 ? ((baseValue - latestValue) / baseValue) * 100 : 0;
      return {
        sector,
        rate: -Math.round(reduction * 10) / 10, // 負の値 = 削減
      };
    }).filter(d => {
      const baseValue = baseYearData[d.sector] || 0;
      return baseValue > 0; // 基準年に排出がある部門のみ
    });

    // 3. 削減軌道データ
    const targetYear2030 = 2030;
    const targetYear2050 = 2050;
    const targetReductionRate2030 = 0.46; // 46%削減
    const targetReductionRate2050 = 0.80; // 80%削減
    const baseEmission = Number(kpi.base_emission_kt);
    const targetEmission2030 = baseEmission * (1 - targetReductionRate2030);
    const targetEmission2050 = baseEmission * (1 - targetReductionRate2050);

    const trajectoryData = [
      {
        year: baseYear,
        actual: baseEmission,
        required: baseEmission,
        target2030: null,
        target2050: null
      },
      ...years.filter(y => y > baseYear).map(year => ({
        year,
        actual: Object.values(sectorsByYear[year]).reduce((sum: number, val: number) => sum + val, 0),
        required: null,
        target2030: null,
        target2050: null,
      })),
      {
        year: targetYear2030,
        actual: null,
        required: targetEmission2030,
        target2030: targetEmission2030,
        target2050: null,
      },
      {
        year: targetYear2050,
        actual: null,
        required: targetEmission2050,
        target2030: null,
        target2050: targetEmission2050,
      },
    ];

    // 必要軌道を計算（基準年から目標年まで）
    trajectoryData.forEach((point) => {
      if (point.year > baseYear && point.year <= targetYear2050) {
        const yearsPassed = point.year - baseYear;
        point.required = baseEmission * Math.pow(1 - Number(kpi.required_pace) / 100, yearsPassed);
      }
    });

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
              <a
                href="/tokyo"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                東京都
              </a>
              {' / '}
              <span style={{ color: '#1a2744' }}>{municipality.name}</span>
            </Typography>
          </Box>

          {/* タイトル */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h1" gutterBottom>
              {municipality.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                東京都 {municipality.name}のCO₂削減実績
              </Typography>
              {municipality.zeroCarbonDeclared && (
                <Box
                  component="span"
                  sx={{
                    px: 1,
                    py: 0.5,
                    backgroundColor: 'success.light',
                    color: 'success.main',
                    fontSize: '11px',
                    fontWeight: 500,
                    border: '1px solid',
                    borderColor: 'success.main',
                  }}
                >
                  ゼロカーボン宣言済み
                </Box>
              )}
            </Box>
          </Box>

          {/* ペースヒーロー（ダークモード） */}
          <PaceHero
            actualPace={municipality.actualPace}
            requiredPace={municipality.requiredPace}
            paceAchievementRate={municipality.paceAchievementRate}
            shortfall2030={municipality.shortfall2030}
            status={municipality.status}
            trajectoryData={trajectoryData}
            dark
          />

          {/* KPIストリップ */}
          <KpiStrip
            totalEmission={municipality.latestEmission}
            emissionPerCapita={municipality.emissionPerCapita}
            deviationScore={municipality.deviationScore}
            shortfall2030={municipality.shortfall2030}
            reductionRate={municipality.reductionRate}
          />

          {/* 基本情報 */}
          <Box
            sx={{
              mb: 4,
              p: 3,
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
                mb: 2,
              }}
            >
              基本情報
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 0.5 }}
                >
                  人口
                </Typography>
                <Typography variant="h4">
                  {municipality.population.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 0.5 }}
                >
                  面積
                </Typography>
                <Typography variant="h4">
                  {municipality.area} km²
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 0.5 }}
                >
                  都内順位
                </Typography>
                <Typography variant="h4">
                  {municipality.prefRank}位 / 62自治体
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 0.5 }}
                >
                  データ年度
                </Typography>
                <Typography variant="h4">
                  {municipality.latestYear}年度
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 部門別分析 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h2" gutterBottom>
              部門別分析
            </Typography>

            <Grid container spacing={3}>
              {/* 部門別排出量推移 */}
              <Grid item xs={12} lg={8}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <SectorTrendChart data={sectorTrendData} />
                </Box>
              </Grid>

              {/* 偏差値メーター */}
              <Grid item xs={12} lg={4}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <DeviationMeter
                    score={municipality.deviationScore}
                    label="多摩地域同規模自治体内"
                  />
                </Box>
              </Grid>

              {/* 部門別削減率 */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <SectorReductionChart data={sectorReductionData} />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* データソース */}
          <Box
            sx={{
              p: 2,
              backgroundColor: 'rgba(26,39,68,0.02)',
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
                mb: 0.5,
              }}
            >
              データソース
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              環境省「自治体排出量カルテ」(2022年度)
              <br />
              基準年: 2013年度（パリ協定基準）
            </Typography>
          </Box>
        </Container>
      </>
    );
  } catch (error) {
    console.error('Error loading municipality page:', error);
    notFound();
  }
}
