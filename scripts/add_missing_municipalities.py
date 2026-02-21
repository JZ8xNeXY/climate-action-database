#!/usr/bin/env python3
"""
欠けている2自治体（狛江市13219、羽村市13227）をデータベースに追加
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

# 追加する自治体
municipalities = [
    {
        'city_code': '13219',
        'prefecture_code': '13',
        'prefecture_name': '東京都',
        'prefecture_slug': 'tokyo',
        'name': '狛江市',
        'population': None,  # あとで更新
        'area_km2': None,    # あとで更新
        'zero_carbon_declared': False
    },
    {
        'city_code': '13227',
        'prefecture_code': '13',
        'prefecture_name': '東京都',
        'prefecture_slug': 'tokyo',
        'name': '羽村市',
        'population': None,
        'area_km2': None,
        'zero_carbon_declared': False
    }
]

print("=== municipalitiesテーブルに自治体を追加 ===\n")

for muni in municipalities:
    try:
        result = supabase.table('municipalities').upsert(muni).execute()
        if result.data:
            print(f"✅ {muni['city_code']} {muni['name']} を追加しました")
        else:
            print(f"❌ {muni['city_code']} {muni['name']} の追加に失敗")
    except Exception as e:
        print(f"❌ {muni['city_code']} {muni['name']}: {e}")

print("\n完了！")
print("次のステップ:")
print("1. scripts/parse_excels.py を実行してExcelデータを解析")
print("2. scripts/seed_supabase.py を実行してKPIとemissionsデータを投入")
print("3. scripts/import_tokyo_population_area.py を実行して人口・面積を更新")
print("4. scripts/recalc_emission_per_capita.py を実行して一人当たりCO2を計算")
