#!/usr/bin/env python3
"""
狛江市(13219)と羽村市(13227)の2自治体のKPIとemissionsデータを投入
"""
import json
import os
from supabase import create_client
from dotenv import load_dotenv
from kpi_calculator import (
    calc_actual_pace,
    calc_required_pace,
    calc_pace_achievement_rate,
    calc_shortfall_2030,
    calc_reduction_rate,
    determine_status
)

# 環境変数読み込み
load_dotenv()
supabase = create_client(os.getenv('NEXT_PUBLIC_SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

# パース済みデータ読み込み（配列形式）
with open('../data/processed/tokyo_emissions.json', 'r', encoding='utf-8') as f:
    all_data = json.load(f)

# 辞書形式に変換
data_by_code = {item['city_code']: item for item in all_data}

# 対象の2自治体のみ処理
target_codes = ['13219', '13227']

print("=== 狛江市・羽村市のKPI・排出量データ投入 ===\n")

for city_code in target_codes:
    if city_code not in data_by_code:
        print(f'❌ {city_code}: データが見つかりません')
        continue

    city_data = data_by_code[city_code]
    print(f"\n処理中: {city_code} {city_data['city_name']}")

    # ========== KPIデータ投入 ==========

    emissions_data = city_data.get('emissions', {})

    # 基準年(2013)と最新年(2021)の総排出量を計算
    # 構造: emissions[sector][year] = value
    def calc_total_emission(year_str):
        total = 0
        for sector, years_data in emissions_data.items():
            if year_str in years_data:
                total += years_data[year_str]
        return total if total > 0 else None

    base_emission = calc_total_emission('2013')
    latest_emission = calc_total_emission('2021')

    if not base_emission or not latest_emission:
        print(f'  ❌ 排出量データが不完全です')
        continue

    # KPI計算
    actual_pace = calc_actual_pace(base_emission, latest_emission, 2013, 2021)
    required_pace = calc_required_pace(base_emission, 0.46, 2013, 2030)
    pace_achievement_rate = calc_pace_achievement_rate(actual_pace, required_pace)
    shortfall = calc_shortfall_2030(base_emission, actual_pace, 2013, 2030, 0.46)
    reduction_rate = calc_reduction_rate(base_emission, latest_emission)
    status = determine_status(pace_achievement_rate)

    # KPI投入
    kpi_data = {
        'city_code': city_code,
        'base_year': 2013,
        'base_emission_kt': round(base_emission, 1),
        'latest_year': 2021,
        'latest_emission_kt': round(latest_emission, 1),
        'actual_pace': actual_pace,
        'required_pace': required_pace,
        'pace_achievement_rate': pace_achievement_rate,
        'shortfall_2030_kt': shortfall,
        'reduction_rate': reduction_rate,
        'status': status,
        'deviation_score': 50.0,  # 後で再計算
        'emission_per_capita': None,  # 後で計算
        'pref_rank': None,
        'national_rank': None
    }

    result = supabase.table('municipality_kpis').upsert(kpi_data).execute()
    if result.data:
        print(f'  ✅ KPI投入完了')
        print(f'     削減率: {reduction_rate}%')
        print(f'     実績ペース: {actual_pace}%/年')
        print(f'     ペース達成率: {pace_achievement_rate}%')

    # ========== 排出量データ投入 ==========

    emissions_records = []

    # 構造: emissions[sector][year] = value
    for sector, years_data in emissions_data.items():
        for year_str, value in years_data.items():
            try:
                fiscal_year = int(year_str)
                emissions_records.append({
                    'city_code': city_code,
                    'fiscal_year': fiscal_year,
                    'sector': sector,
                    'value_kt_co2': round(value, 3)
                })
            except (ValueError, TypeError):
                pass

    # バッチ投入
    if emissions_records:
        BATCH_SIZE = 100
        for i in range(0, len(emissions_records), BATCH_SIZE):
            batch = emissions_records[i:i+BATCH_SIZE]
            supabase.table('emissions').upsert(batch).execute()
        print(f'  ✅ 排出量データ投入完了 ({len(emissions_records)}件)')

print("\n=== 投入完了 ===")
