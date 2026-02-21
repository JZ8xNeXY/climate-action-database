// 部門名
export type SectorName =
  | '製造業' | '建設業' | '農林水産業' | '業務その他'
  | '家庭' | '旅客' | '貨物' | '鉄道' | '船舶' | '廃棄物';

// ペースステータス
export type PaceStatus = 'on-track' | 'at-risk' | 'off-track';

// 年度別排出量
export type EmissionByYear = Record<number, number>; // { 2009: 756, ..., 2022: 554 }

// 部門別排出量（1年分）
export type SectorEmission = {
  sector: SectorName;
  value: number; // 千t-CO₂
};

// 自治体KPI
export interface MunicipalityKpi {
  cityCode: string;           // 団体コード（5桁）
  name: string;               // 自治体名
  prefecture: string;         // 都道府県名
  prefectureCode: string;     // 都道府県コード（2桁）
  population: number;
  area: number;               // km²
  zeroCarbonDeclared: boolean;
  zeroCarbonYear: number | null;

  // 排出量
  baseEmission: number;       // 2013年度 千t-CO₂
  latestEmission: number;     // 最新年度 千t-CO₂
  latestYear: number;         // 最新データ年度

  // KPI
  reductionRate: number;      // 削減率 % (負値)
  actualPace: number;         // 実績ペース %/年
  requiredPace: number;       // 必要ペース %/年
  paceAchievementRate: number; // ペース達成率 %
  status: PaceStatus;
  shortfall2030: number;      // 2030年予測不足量 千t-CO₂
  emissionPerCapita: number;  // 一人あたり t-CO₂
  deviationScore: number;     // 偏差値

  // ランキング
  prefRank: number;           // 都道府県内順位
  nationalRank: number;       // 全国順位（Phase 2）
}

// 都道府県KPI
export interface PrefectureKpi {
  code: string;               // 2桁コード
  name: string;
  slug: string;               // ローマ字（URL用）
  population: number;

  baseEmission: number;       // 百万t-CO₂
  latestEmission: number;
  latestYear: number;

  reductionRate: number;
  actualPace: number;
  requiredPace: number;
  paceAchievementRate: number;
  status: PaceStatus;
  shortfall2030: number;

  municipalityCount: number;
  onTrackCount: number;
  atRiskCount: number;
  offTrackCount: number;
}

// 部門別時系列データ
export interface SectorTimeSeries {
  cityCode: string;
  sector: SectorName;
  yearlyData: EmissionByYear;
}

// グラフ用データ（Recharts形式）
export interface TrendDataPoint {
  year: number;
  total: number;
  home?: number;
  business?: number;
  transport?: number;
  industry?: number;
  waste?: number;
  other?: number;
}

export interface TrajectoryDataPoint {
  year: number;
  actual: number | null;
  required: number | null;
  target2030: number | null;
  target2050: number | null;
}
