#!/usr/bin/env python3
"""
人口データを使って一人当たりCO2排出量を再計算
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# 環境変数読み込み
load_dotenv()
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not supabase_url or not supabase_key:
    raise Exception('.env.localにSupabaseの環境変数が設定されていません')

supabase: Client = create_client(supabase_url, supabase_key)

def calc_emission_per_capita(total_emission_kt: float, population: int) -> float:
    """
    一人当たりCO2排出量を計算（t-CO₂/人）

    Args:
        total_emission_kt: 総排出量（千t-CO₂）
        population: 人口（人）

    Returns:
        一人当たり排出量（t-CO₂/人）
    """
    if population <= 0:
        return 0.0

    # 千t-CO₂ → t-CO₂ に変換してから人口で割る
    per_capita = (total_emission_kt * 1000) / population
    return round(per_capita, 3)

print("=== 一人当たりCO2排出量の再計算 ===\n")

# municipality_kpisとmunicipalitiesをJOINして取得
result = supabase.table('municipality_kpis')\
    .select('city_code, latest_emission_kt, municipalities(population)')\
    .execute()

if not result.data:
    print("データが見つかりません")
    exit(1)

updated_count = 0
skipped_count = 0

for kpi in result.data:
    city_code = kpi['city_code']
    latest_emission_kt = float(kpi['latest_emission_kt'])

    municipality = kpi.get('municipalities')
    if not municipality or not municipality.get('population'):
        print(f"{city_code}: 人口データなし（スキップ）")
        skipped_count += 1
        continue

    population = municipality['population']

    # 一人当たり排出量を計算
    emission_per_capita = calc_emission_per_capita(latest_emission_kt, population)

    # 更新
    update_result = supabase.table('municipality_kpis')\
        .update({'emission_per_capita': emission_per_capita})\
        .eq('city_code', city_code)\
        .execute()

    if update_result.data:
        print(f"{city_code}: {emission_per_capita:.3f} t-CO₂/人 (人口: {population:,}人)")
        updated_count += 1
    else:
        print(f"{city_code}: 更新失敗")

print(f"\n=== 完了 ===")
print(f"更新: {updated_count}件")
print(f"スキップ: {skipped_count}件")
