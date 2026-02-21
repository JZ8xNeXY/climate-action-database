# architecture.md — ディレクトリ構成・コンポーネント設計

---

## ディレクトリ構成

```
climate-db/
├── CLAUDE.md                     ← Claude Code用メイン指示書
├── docs/
│   ├── requirements.md
│   ├── progress.md
│   ├── content.md
│   ├── style.md
│   ├── architecture.md           ← このファイル
│   └── api.md
│
├── src/
│   ├── app/                      ← Next.js App Router
│   │   ├── layout.tsx            ← RootLayout（フォント・グローバルCSS）
│   │   ├── page.tsx              ← / 国レベルランディング
│   │   ├── [prefecture]/
│   │   │   ├── page.tsx          ← /[prefecture] 都道府県ビュー
│   │   │   └── [cityCode]/
│   │   │       └── page.tsx      ← /[prefecture]/[cityCode] 自治体詳細
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── BreadcrumbNav.tsx
│   │   │   └── PageFooter.tsx
│   │   │
│   │   ├── pace/                 ← コアウィジェット群
│   │   │   ├── PaceHero.tsx      ← 必要ペース vs 実績ペース（最重要）
│   │   │   ├── PaceBar.tsx       ← ランキング行内のバー
│   │   │   ├── VerdictBand.tsx   ← 判定バナー（at-risk等）
│   │   │   └── TrajectoryChart.tsx ← 軌道グラフ（実績+目標線）
│   │   │
│   │   ├── kpi/
│   │   │   ├── KpiStrip.tsx      ← KPIカード4枚横並び
│   │   │   ├── KpiCard.tsx
│   │   │   └── DeviationMeter.tsx ← 偏差値スケールバー
│   │   │
│   │   ├── ranking/
│   │   │   ├── RankingList.tsx
│   │   │   ├── RankingRow.tsx
│   │   │   └── StatusBadge.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── SectorTrendChart.tsx  ← 部門別積み上げ棒グラフ
│   │   │   ├── SectorRateChart.tsx   ← 部門別削減率 横棒グラフ
│   │   │   └── PaceCompareChart.tsx  ← 近隣比較グラフ
│   │   │
│   │   └── ui/                   ← 汎用UIプリミティブ
│   │       ├── SectionLabel.tsx
│   │       ├── GoldRule.tsx
│   │       ├── Panel.tsx
│   │       └── TabNav.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts           ← Supabaseクライアント
│   │   ├── queries.ts            ← DB クエリ関数
│   │   └── kpi.ts                ← KPI計算ロジック（content.mdの関数）
│   │
│   ├── types/
│   │   └── index.ts              ← 全型定義
│   │
│   └── data/
│       └── prefectures.ts        ← 都道府県マスター（静的）
│
├── scripts/                      ← Pythonデータ処理
│   ├── download_excels.py        ← 環境省からExcel一括DL
│   ├── parse_excels.py           ← Excel→JSON変換
│   ├── calculate_kpis.py         ← KPI計算
│   └── seed_supabase.py          ← Supabaseへの投入
│
├── data/                         ← 生データ・中間ファイル
│   ├── tokyo_municipalities.csv  ← 団体コードリスト
│   ├── raw/                      ← DLしたExcel（gitignore）
│   └── processed/                ← 処理済みJSON
│
├── public/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 型定義（src/types/index.ts）

```typescript
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
```

---

## コンポーネント Props 設計

### PaceHero

```typescript
interface PaceHeroProps {
  actualPace: number;        // ▼2.4
  requiredPace: number;      // ▼3.2
  paceAchievementRate: number; // 75
  shortfall2030: number;     // 146 千t
  status: PaceStatus;
  trajectoryData: TrajectoryDataPoint[];
  dark?: boolean;            // dark bg（自治体詳細ビュー用）
}
```

### RankingRow

```typescript
interface RankingRowProps {
  rank: number;
  name: string;
  reductionRate: number;
  actualPace: number;
  requiredPace: number;
  status: PaceStatus;
  onClick: () => void;
  isSelected?: boolean;
}
```

### KpiCard

```typescript
interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subText?: string;
  subColor?: 'green' | 'red' | 'muted';
  accentColor?: 'navy' | 'green' | 'gold' | 'red';
}
```

---

## Server / Client コンポーネント方針

```
Server Components（データフェッチ）:
  app/page.tsx
  app/[prefecture]/page.tsx
  app/[prefecture]/[cityCode]/page.tsx

Client Components（インタラクション・グラフ）:
  components/charts/*.tsx  → 'use client'
  components/pace/TrajectoryChart.tsx → 'use client'
  components/ranking/RankingList.tsx → 'use client'（検索フィルタ）
  components/ui/TabNav.tsx → 'use client'
```

データはServer Componentsで取得し、props経由でClientに渡す。

---

## データフロー

```
環境省Excel (CO2排出量)
    ↓ scripts/download_excels.py
    ↓ scripts/parse_excels.py
    ↓ scripts/kpi_calculator.py
    ↓ scripts/seed_supabase.py
        ↓
Supabase DB (emissions, municipality_kpis)
        ↑
統計局Excel (人口・面積)
    ↓ scripts/import_tokyo_population_area.py
    ↓ scripts/recalc_emission_per_capita.py
        ↓
Supabase DB (municipalities更新)
    ↓ lib/queries.ts
Server Components
    ↓ props
Client Components（グラフ・インタラクション）
```

### データ処理スクリプト一覧

**CO2排出量データ:**
- `download_excels.py` - 環境省からExcelファイル一括ダウンロード
- `parse_excels.py` - Excelから排出量データを抽出してJSON化
- `kpi_calculator.py` - KPI計算ロジック（ペース・削減率等）
- `seed_supabase.py` - Supabaseにデータ投入

**人口・面積データ:**
- `import_tokyo_population_area.py` - 統計局データから人口・面積を抽出してDB更新
- `recalc_emission_per_capita.py` - 一人当たりCO2排出量を再計算

**その他:**
- `create_schema.sql` - Supabaseテーブル定義
- `check_*.py` - データ確認用スクリプト群
