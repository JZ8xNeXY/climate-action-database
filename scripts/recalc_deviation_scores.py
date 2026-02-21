#!/usr/bin/env python3
"""
すべての自治体の偏差値を再計算
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from kpi_calculator import calc_deviation_score

# 環境変数読み込み
load_dotenv()
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not supabase_url or not supabase_key:
    raise Exception('.env.localにSupabaseの環境変数が設定されていません')

supabase: Client = create_client(supabase_url, supabase_key)

print("=== 偏差値の再計算 ===\n")

# 東京都の全自治体KPIを取得
result = supabase.table('municipality_kpis')\
    .select('city_code, reduction_rate')\
    .execute()

if not result.data:
    print("データが見つかりません")
    exit(1)

# 削減率の絶対値リストを作成
reduction_rates = [abs(float(kpi['reduction_rate'])) for kpi in result.data]

print(f"対象自治体数: {len(result.data)}件")
print(f"削減率の範囲: {min(reduction_rates):.1f}% 〜 {max(reduction_rates):.1f}%")
print(f"削減率の平均: {sum(reduction_rates)/len(reduction_rates):.1f}%\n")

# 各自治体の偏差値を再計算
updated = 0
for kpi in result.data:
    city_code = kpi['city_code']
    reduction_rate = abs(float(kpi['reduction_rate']))

    # 偏差値を計算（削減率が高いほど偏差値が高い）
    deviation_score = calc_deviation_score(reduction_rates, reduction_rate)

    # 更新
    update_result = supabase.table('municipality_kpis')\
        .update({'deviation_score': deviation_score})\
        .eq('city_code', city_code)\
        .execute()

    if update_result.data:
        updated += 1
        print(f"{city_code}: 削減率 {reduction_rate:.1f}% → 偏差値 {deviation_score:.1f}")

print(f"\n=== 完了 ===")
print(f"更新: {updated}件")
