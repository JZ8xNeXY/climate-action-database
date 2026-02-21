import { MunicipalityKpi, TrajectoryDataPoint, TrendDataPoint } from '@/types';

// 西東京市のサンプルデータ（content.mdより）
export const sampleMunicipality: MunicipalityKpi = {
  cityCode: '13229',
  name: '西東京市',
  prefecture: '東京都',
  prefectureCode: '13',
  population: 205000,
  area: 15.75,
  zeroCarbonDeclared: false,
  zeroCarbonYear: null,

  baseEmission: 738,      // 2013年度
  latestEmission: 554,    // 2022年度
  latestYear: 2022,

  reductionRate: -24.9,   // ▼24.9%
  actualPace: 2.4,        // ▼2.4%/年
  requiredPace: 3.2,      // ▼3.2%/年（国目標▼46%ベース）
  paceAchievementRate: 75, // 75%
  status: 'at-risk',
  shortfall2030: 146,     // 146 千t-CO₂
  emissionPerCapita: 2.7, // t-CO₂/人
  deviationScore: 52,     // 偏差値52

  prefRank: 3,            // 都内3位
  nationalRank: 0,        // Phase 2で実装
};

// 軌道グラフ用サンプルデータ
export const sampleTrajectory: TrajectoryDataPoint[] = [
  { year: 2013, actual: 738, required: 738, target2030: null, target2050: null },
  { year: 2014, actual: 710, required: 715, target2030: null, target2050: null },
  { year: 2015, actual: 695, required: 693, target2030: null, target2050: null },
  { year: 2016, actual: 680, required: 672, target2030: null, target2050: null },
  { year: 2017, actual: 665, required: 651, target2030: null, target2050: null },
  { year: 2018, actual: 602, required: 631, target2030: null, target2050: null },
  { year: 2019, actual: 590, required: 612, target2030: null, target2050: null },
  { year: 2020, actual: 575, required: 593, target2030: null, target2050: null },
  { year: 2021, actual: 565, required: 575, target2030: null, target2050: null },
  { year: 2022, actual: 554, required: 557, target2030: null, target2050: null },
  { year: 2023, actual: null, required: 540, target2030: null, target2050: null },
  { year: 2024, actual: null, required: 523, target2030: null, target2050: null },
  { year: 2025, actual: null, required: 507, target2030: null, target2050: null },
  { year: 2026, actual: null, required: 492, target2030: null, target2050: null },
  { year: 2027, actual: null, required: 477, target2030: null, target2050: null },
  { year: 2028, actual: null, required: 462, target2030: null, target2050: null },
  { year: 2029, actual: null, required: 448, target2030: null, target2050: null },
  { year: 2030, actual: null, required: 398, target2030: 398, target2050: null },
  { year: 2050, actual: null, required: null, target2030: null, target2050: 0 },
];

// 西東京市の部門別排出量推移（サンプル）
export const sampleSectorTrend: TrendDataPoint[] = [
  { year: 2013, total: 738, home: 208, business: 224, transport: 137, industry: 120, waste: 36, other: 13 },
  { year: 2014, total: 710, home: 200, business: 215, transport: 132, industry: 115, waste: 35, other: 13 },
  { year: 2015, total: 695, home: 195, business: 210, transport: 128, industry: 112, waste: 34, other: 16 },
  { year: 2016, total: 680, home: 190, business: 205, transport: 125, industry: 108, waste: 33, other: 19 },
  { year: 2017, total: 665, home: 185, business: 198, transport: 122, industry: 105, waste: 32, other: 23 },
  { year: 2018, total: 602, home: 182, business: 178, transport: 120, industry: 77, waste: 31, other: 14 },
  { year: 2019, total: 590, home: 180, business: 172, transport: 118, industry: 75, waste: 30, other: 15 },
  { year: 2020, total: 575, home: 179, business: 165, transport: 115, industry: 72, waste: 29, other: 15 },
  { year: 2021, total: 565, home: 178, business: 160, transport: 113, industry: 69, waste: 28, other: 17 },
  { year: 2022, total: 554, home: 178, business: 155, transport: 111, industry: 67, waste: 28, other: 15 },
];

// 部門別削減率（2013年度比）
export const sampleSectorReduction = [
  { sector: '家庭', rate: -14.4 },
  { sector: '業務その他', rate: -30.8 },
  { sector: '旅客', rate: -19.0 },
  { sector: '製造業', rate: -44.2 },
  { sector: '廃棄物', rate: -22.2 },
  { sector: 'その他', rate: 15.4 },
];

// 東京都自治体ランキング（サンプル5件）
export const sampleRanking: MunicipalityKpi[] = [
  {
    cityCode: '13101',
    name: '千代田区',
    prefecture: '東京都',
    prefectureCode: '13',
    population: 66000,
    area: 11.66,
    zeroCarbonDeclared: true,
    zeroCarbonYear: 2020,
    baseEmission: 850,
    latestEmission: 520,
    latestYear: 2022,
    reductionRate: -38.8,
    actualPace: 4.2,
    requiredPace: 3.2,
    paceAchievementRate: 131,
    status: 'on-track',
    shortfall2030: 0,
    emissionPerCapita: 7.9,
    deviationScore: 65,
    prefRank: 1,
    nationalRank: 0,
  },
  {
    cityCode: '13203',
    name: '武蔵野市',
    prefecture: '東京都',
    prefectureCode: '13',
    population: 148000,
    area: 10.98,
    zeroCarbonDeclared: true,
    zeroCarbonYear: 2021,
    baseEmission: 680,
    latestEmission: 475,
    latestYear: 2022,
    reductionRate: -30.1,
    actualPace: 3.5,
    requiredPace: 3.2,
    paceAchievementRate: 109,
    status: 'on-track',
    shortfall2030: 0,
    emissionPerCapita: 3.2,
    deviationScore: 58,
    prefRank: 2,
    nationalRank: 0,
  },
  sampleMunicipality, // 西東京市（3位）
  {
    cityCode: '13112',
    name: '世田谷区',
    prefecture: '東京都',
    prefectureCode: '13',
    population: 930000,
    area: 58.05,
    zeroCarbonDeclared: true,
    zeroCarbonYear: 2022,
    baseEmission: 3200,
    latestEmission: 2550,
    latestYear: 2022,
    reductionRate: -20.3,
    actualPace: 2.5,
    requiredPace: 3.2,
    paceAchievementRate: 78,
    status: 'at-risk',
    shortfall2030: 450,
    emissionPerCapita: 2.7,
    deviationScore: 51,
    prefRank: 4,
    nationalRank: 0,
  },
  {
    cityCode: '13111',
    name: '大田区',
    prefecture: '東京都',
    prefectureCode: '13',
    population: 738000,
    area: 61.86,
    zeroCarbonDeclared: false,
    zeroCarbonYear: null,
    baseEmission: 4100,
    latestEmission: 3450,
    latestYear: 2022,
    reductionRate: -15.9,
    actualPace: 1.9,
    requiredPace: 3.2,
    paceAchievementRate: 59,
    status: 'off-track',
    shortfall2030: 820,
    emissionPerCapita: 4.7,
    deviationScore: 45,
    prefRank: 5,
    nationalRank: 0,
  },
];
