#!/usr/bin/env python3
"""
統計局データから東京都62自治体の人口・面積データを抽出して
Supabaseに投入（2022年度データ）
"""
import pandas as pd
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

# 1. 人口データを読み込み（人口・世帯ファイル）
print("=== 人口データ読み込み ===")
df_pop = pd.read_excel('../data/population_households_2022.xls', sheet_name='A', header=None)

# データ行を抽出（10行目以降）
df_pop_data = df_pop.iloc[10:].copy()

# 団体コード列（32列目）でフィルタ
df_pop_data[32] = df_pop_data[32].astype(str).str.strip()
df_pop_tokyo = df_pop_data[df_pop_data[32].str.match(r'^13\d{3}$', na=False)]

print(f"人口データ: {len(df_pop_tokyo)}件")

# 2. 面積データを読み込み（自然環境ファイル）
print("\n=== 面積データ読み込み ===")
df_area = pd.read_excel('../data/natural_environment_2022.xls', sheet_name='B', header=None)

# データ行を抽出（10行目以降）
df_area_data = df_area.iloc[10:].copy()

# 団体コード列（12列目）でフィルタ
df_area_data[12] = df_area_data[12].astype(str).str.strip()
df_area_tokyo = df_area_data[df_area_data[12].str.match(r'^13\d{3}$', na=False)]

print(f"面積データ: {len(df_area_tokyo)}件")

# 3. データをマージして更新
print("\n=== データ更新中 ===")
updated_count = 0
not_found_count = 0

for idx in df_pop_tokyo.index:
    city_code = df_pop_tokyo.loc[idx, 32]
    name = str(df_pop_tokyo.loc[idx, 8]).strip()  # 市区町村名

    # 人口（2020年住民基本台帳人口を使用 - 列13）
    population = df_pop_tokyo.loc[idx, 13]
    if pd.isna(population):
        # 2015年国勢調査人口を代替（列10）
        population = df_pop_tokyo.loc[idx, 10]

    if pd.notna(population):
        population = int(float(population))
    else:
        population = None

    # 面積データを探す
    area_rows = df_area_tokyo[df_area_tokyo[12] == city_code]
    area_km2 = None
    if not area_rows.empty:
        area_val = area_rows.iloc[0, 10]  # 総面積（列10）
        if pd.notna(area_val):
            area_km2 = float(area_val)

    print(f"{city_code} {name:15s} 人口:{population:>8} 面積:{area_km2}km²")

    # Supabase更新
    try:
        update_data = {}
        if population is not None:
            update_data['population'] = population
        if area_km2 is not None:
            update_data['area_km2'] = area_km2

        if update_data:
            result = supabase.table('municipalities')\
                .update(update_data)\
                .eq('city_code', city_code)\
                .execute()

            if result.data:
                updated_count += 1
            else:
                not_found_count += 1
                print(f"  ⚠️  municipalitiesテーブルに {city_code} が見つかりません")
    except Exception as e:
        print(f"  ❌ エラー: {e}")

print(f"\n=== 完了 ===")
print(f"更新成功: {updated_count}件")
print(f"見つからない: {not_found_count}件")
