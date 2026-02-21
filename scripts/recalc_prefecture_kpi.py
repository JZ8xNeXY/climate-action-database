#!/usr/bin/env python3
"""
東京都の都道府県KPIを再計算（全62自治体を反映）
"""
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

load_dotenv()
supabase = create_client(os.getenv('NEXT_PUBLIC_SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

print('=== 東京都の都道府県KPIを再計算 ===\n')

# Get all Tokyo municipality KPIs
kpis = supabase.table('municipality_kpis').select('*').execute()
tokyo_kpis = [k for k in kpis.data if k['city_code'].startswith('13')]

print(f'対象自治体数: {len(tokyo_kpis)}件')

# Calculate total emissions
total_base = sum(float(k['base_emission_kt']) for k in tokyo_kpis)
total_latest = sum(float(k['latest_emission_kt']) for k in tokyo_kpis)

print(f'基準年(2013)総排出量: {total_base:.1f} 千t-CO₂')
print(f'最新年(2021)総排出量: {total_latest:.1f} 千t-CO₂')

# Calculate prefecture KPIs
reduction_rate = calc_reduction_rate(total_base, total_latest)
actual_pace = calc_actual_pace(total_base, total_latest, 2013, 2021)
required_pace = calc_required_pace(total_base, 0.46, 2013, 2030)
pace_achievement_rate = calc_pace_achievement_rate(actual_pace, required_pace)
shortfall = calc_shortfall_2030(total_base, actual_pace, 2013, 2030, 0.46)
status = determine_status(pace_achievement_rate)

print(f'削減率: {reduction_rate}%')
print(f'実績ペース: {actual_pace}%/年')
print(f'必要ペース: {required_pace}%/年')
print(f'ペース達成率: {pace_achievement_rate}%')

# Count status distribution
on_track_count = len([k for k in tokyo_kpis if k['status'] == 'on-track'])
at_risk_count = len([k for k in tokyo_kpis if k['status'] == 'at-risk'])
off_track_count = len([k for k in tokyo_kpis if k['status'] == 'off-track'])

# Update prefecture_kpis
pref_data = {
    'prefecture_code': '13',
    'prefecture_name': '東京都',
    'prefecture_slug': 'tokyo',
    'latest_year': 2022,  # Note: Using 2022 to match existing schema
    'base_emission_mt': round(total_base / 1000, 2),  # 千t → 百万t
    'latest_emission_mt': round(total_latest / 1000, 2),
    'reduction_rate': reduction_rate,
    'actual_pace': actual_pace,
    'required_pace': required_pace,
    'pace_achievement_rate': pace_achievement_rate,
    'status': status,
    'shortfall_2030_mt': round(shortfall / 1000, 2),
    'municipality_count': len(tokyo_kpis),
    'on_track_count': on_track_count,
    'at_risk_count': at_risk_count,
    'off_track_count': off_track_count
}

result = supabase.table('prefecture_kpis').upsert(pref_data).execute()
if result.data:
    print(f'\n✅ 東京都のKPIを更新しました（自治体数: {len(tokyo_kpis)}）')
