-- 気候変動対策データベース Supabaseスキーマ
-- Phase 1: 東京都62自治体

-- 1. 自治体マスター
CREATE TABLE IF NOT EXISTS municipalities (
  city_code        VARCHAR(5)   PRIMARY KEY,
  name             VARCHAR(50)  NOT NULL,
  prefecture_code  VARCHAR(2)   NOT NULL,
  prefecture_name  VARCHAR(20)  NOT NULL,
  prefecture_slug  VARCHAR(30)  NOT NULL,
  region           VARCHAR(30),
  population       INTEGER,
  area_km2         NUMERIC(8,2),
  zero_carbon_declared BOOLEAN DEFAULT FALSE,
  zero_carbon_year INTEGER,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_municipalities_prefecture ON municipalities(prefecture_code);

-- 2. 年度別排出量
CREATE TABLE IF NOT EXISTS emissions (
  id               BIGSERIAL    PRIMARY KEY,
  city_code        VARCHAR(5)   NOT NULL REFERENCES municipalities(city_code) ON DELETE CASCADE,
  fiscal_year      SMALLINT     NOT NULL,
  sector           VARCHAR(20)  NOT NULL,
  value_kt_co2     NUMERIC(10,2),
  created_at       TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(city_code, fiscal_year, sector)
);

CREATE INDEX IF NOT EXISTS idx_emissions_city ON emissions(city_code);
CREATE INDEX IF NOT EXISTS idx_emissions_year ON emissions(fiscal_year);

-- 部門名の制約
DO $$ BEGIN
  ALTER TABLE emissions ADD CONSTRAINT valid_sector
    CHECK (sector IN (
      '製造業','建設業','農林水産業','業務その他',
      '家庭','旅客','貨物','鉄道','船舶','廃棄物'
    ));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. 自治体KPI（計算済み）
CREATE TABLE IF NOT EXISTS municipality_kpis (
  city_code              VARCHAR(5)    PRIMARY KEY REFERENCES municipalities(city_code) ON DELETE CASCADE,
  base_year              SMALLINT      DEFAULT 2013,
  latest_year            SMALLINT      NOT NULL,
  base_emission_kt       NUMERIC(10,2) NOT NULL,
  latest_emission_kt     NUMERIC(10,2) NOT NULL,
  reduction_rate         NUMERIC(6,2)  NOT NULL,
  actual_pace            NUMERIC(5,2)  NOT NULL,
  required_pace          NUMERIC(5,2)  NOT NULL,
  pace_achievement_rate  NUMERIC(6,1)  NOT NULL,
  status                 VARCHAR(10)   NOT NULL,
  shortfall_2030_kt      NUMERIC(10,2),
  emission_per_capita    NUMERIC(6,3),
  deviation_score        NUMERIC(5,1),
  pref_rank              SMALLINT,
  national_rank          INTEGER,
  updated_at             TIMESTAMPTZ   DEFAULT NOW(),
  CHECK (status IN ('on-track', 'at-risk', 'off-track'))
);

-- 4. 都道府県集計KPI
CREATE TABLE IF NOT EXISTS prefecture_kpis (
  prefecture_code        VARCHAR(2)    PRIMARY KEY,
  prefecture_name        VARCHAR(20)   NOT NULL,
  prefecture_slug        VARCHAR(30)   NOT NULL,
  latest_year            SMALLINT      NOT NULL,
  base_emission_mt       NUMERIC(8,2)  NOT NULL,
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
  updated_at             TIMESTAMPTZ   DEFAULT NOW(),
  CHECK (status IN ('on-track', 'at-risk', 'off-track'))
);

-- Row Level Security (RLS) 設定
-- 読み取り専用アクセス
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipality_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE prefecture_kpis ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY IF NOT EXISTS "Public read access" ON municipalities FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read access" ON emissions FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read access" ON municipality_kpis FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public read access" ON prefecture_kpis FOR SELECT USING (true);

-- 管理者のみ書き込み可能（service_roleキー使用時）
CREATE POLICY IF NOT EXISTS "Service role write access" ON municipalities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Service role write access" ON emissions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Service role write access" ON municipality_kpis FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Service role write access" ON prefecture_kpis FOR ALL USING (auth.role() = 'service_role');
