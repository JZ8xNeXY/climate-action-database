# api.md — APIエンドポイント・Supabaseスキーマ

---

## Supabase テーブル定義

### municipalities（自治体マスター）

```sql
CREATE TABLE municipalities (
  city_code        VARCHAR(5)   PRIMARY KEY,   -- 団体コード (例: '13229')
  name             VARCHAR(50)  NOT NULL,       -- 自治体名（例: '西東京市'）
  prefecture_code  VARCHAR(2)   NOT NULL,       -- 都道府県コード（例: '13'）
  prefecture_name  VARCHAR(20)  NOT NULL,
  prefecture_slug  VARCHAR(30)  NOT NULL,       -- ローマ字スラッグ（例: 'tokyo'）
  region           VARCHAR(30),                 -- 地域区分（例: '多摩地域'）
  population       INTEGER,
  area_km2         NUMERIC(8,2),
  zero_carbon_declared BOOLEAN DEFAULT FALSE,
  zero_carbon_year INTEGER,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_municipalities_prefecture ON municipalities(prefecture_code);
```

### emissions（年度別排出量）

```sql
CREATE TABLE emissions (
  id               BIGSERIAL    PRIMARY KEY,
  city_code        VARCHAR(5)   NOT NULL REFERENCES municipalities(city_code),
  fiscal_year      SMALLINT     NOT NULL,        -- 年度（2009〜2022）
  sector           VARCHAR(20)  NOT NULL,        -- 部門名
  value_kt_co2     NUMERIC(10,2),                -- 千t-CO₂（NULLあり）
  created_at       TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(city_code, fiscal_year, sector)
);

CREATE INDEX idx_emissions_city ON emissions(city_code);
CREATE INDEX idx_emissions_year ON emissions(fiscal_year);

-- 部門名の制約
ALTER TABLE emissions ADD CONSTRAINT valid_sector
  CHECK (sector IN (
    '製造業','建設業','農林水産業','業務その他',
    '家庭','旅客','貨物','鉄道','船舶','廃棄物'
  ));
```

### municipality_kpis（計算済みKPI）

```sql
CREATE TABLE municipality_kpis (
  city_code              VARCHAR(5)    PRIMARY KEY REFERENCES municipalities(city_code),
  base_year              SMALLINT      DEFAULT 2013,
  latest_year            SMALLINT      NOT NULL,
  base_emission_kt       NUMERIC(10,2) NOT NULL,    -- 千t-CO₂
  latest_emission_kt     NUMERIC(10,2) NOT NULL,
  reduction_rate         NUMERIC(6,2)  NOT NULL,    -- % (負値: -26.7)
  actual_pace            NUMERIC(5,2)  NOT NULL,    -- %/年
  required_pace          NUMERIC(5,2)  NOT NULL,
  pace_achievement_rate  NUMERIC(6,1)  NOT NULL,    -- %
  status                 VARCHAR(10)   NOT NULL,    -- 'on-track','at-risk','off-track'
  shortfall_2030_kt      NUMERIC(10,2),
  emission_per_capita    NUMERIC(6,3),              -- t-CO₂/人
  deviation_score        NUMERIC(5,1),              -- 偏差値
  pref_rank              SMALLINT,
  national_rank          INTEGER,
  updated_at             TIMESTAMPTZ   DEFAULT NOW()
);
```

### prefecture_kpis（都道府県集計KPI）

```sql
CREATE TABLE prefecture_kpis (
  prefecture_code        VARCHAR(2)    PRIMARY KEY,
  prefecture_name        VARCHAR(20)   NOT NULL,
  prefecture_slug        VARCHAR(30)   NOT NULL,
  latest_year            SMALLINT      NOT NULL,
  base_emission_mt       NUMERIC(8,2)  NOT NULL,    -- 百万t-CO₂
  latest_emission_mt     NUMERIC(8,2)  NOT NULL,
  reduction_rate         NUMERIC(6,2)  NOT NULL,
  actual_pace            NUMERIC(5,2)  NOT NULL,
  required_pace          NUMERIC(5,2)  NOT NULL,
  pace_achievement_rate  NUMERIC(6,1)  NOT NULL,
  status                 VARCHAR(10)   NOT NULL,
  shortfall_2030_mt      NUMERIC(8,2),
  municipality_count     SMALLINT,
  on_track_count         SMALLINT,
  at_risk_count          SMALLINT,
  off_track_count        SMALLINT,
  national_rank          SMALLINT,
  updated_at             TIMESTAMPTZ   DEFAULT NOW()
);
```

---

## Next.js API Routes

### GET /api/prefectures

都道府県一覧（ランキング順）を返す。

```typescript
// app/api/prefectures/route.ts
// Response:
{
  data: PrefectureKpi[]
}
```

クエリパラメータ:
- `sort`: `pace_achievement_rate` | `reduction_rate` （default: `pace_achievement_rate`）
- `order`: `desc` | `asc` （default: `desc`）

### GET /api/prefectures/[code]

都道府県詳細 + 管内自治体ランキング。

```typescript
// Response:
{
  prefecture: PrefectureKpi,
  municipalities: MunicipalityKpi[]
}
```

### GET /api/municipalities/[cityCode]

自治体詳細KPI。

```typescript
// Response:
{
  municipality: MunicipalityKpi,
  sectorData: SectorTimeSeries[]
}
```

### GET /api/municipalities/[cityCode]/trajectory

軌道グラフ用データ。

```typescript
// Response:
{
  trajectory: TrajectoryDataPoint[]
  // 実績 + 必要軌道 + 2030/2050目標
}
```

---

## Supabase クエリ関数（lib/queries.ts）

```typescript
import { createClient } from '@/lib/supabase'

// 都道府県一覧
export async function getPrefectureRankings() {
  const { data } = await supabase
    .from('prefecture_kpis')
    .select('*')
    .order('pace_achievement_rate', { ascending: false })
  return data
}

// 都道府県詳細 + 管内自治体
export async function getPrefectureWithMunicipalities(prefCode: string) {
  const [pref, munis] = await Promise.all([
    supabase
      .from('prefecture_kpis')
      .select('*')
      .eq('prefecture_code', prefCode)
      .single(),
    supabase
      .from('municipality_kpis')
      .select('*, municipalities(name, population, zero_carbon_declared)')
      .eq('municipalities.prefecture_code', prefCode)
      .order('pace_achievement_rate', { ascending: false })
  ])
  return { prefecture: pref.data, municipalities: munis.data }
}

// 自治体詳細
export async function getMunicipalityDetail(cityCode: string) {
  const [kpi, emissions] = await Promise.all([
    supabase
      .from('municipality_kpis')
      .select('*, municipalities(*)')
      .eq('city_code', cityCode)
      .single(),
    supabase
      .from('emissions')
      .select('*')
      .eq('city_code', cityCode)
      .order('fiscal_year', { ascending: true })
  ])
  return { kpi: kpi.data, emissions: emissions.data }
}
```

---

## 環境変数

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # スクリプト用のみ

# (Phase 2) Revalidation
CRON_SECRET=xxxx
```

---

## キャッシュ戦略

```typescript
// Server Components でのfetch設定

// 都道府県一覧: 1時間キャッシュ
fetch(url, { next: { revalidate: 3600 } })

// 自治体詳細: 1日キャッシュ（データは年1回更新）
fetch(url, { next: { revalidate: 86400 } })
```

Supabase直接クエリ（fetch不使用）の場合はNext.js `unstable_cache` を使用:

```typescript
import { unstable_cache } from 'next/cache'

export const getCachedPrefectures = unstable_cache(
  getPrefectureRankings,
  ['prefectures'],
  { revalidate: 3600 }
)
```
