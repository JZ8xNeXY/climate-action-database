"""
パース済みデータからKPIを計算してSupabaseに投入
"""
import json
import csv
import os
from pathlib import Path
from typing import Dict, List
from dotenv import load_dotenv
from supabase import create_client, Client
from kpi_calculator import (
    calc_actual_pace,
    calc_required_pace,
    calc_pace_achievement_rate,
    calc_shortfall_2030,
    calc_reduction_rate,
    calc_emission_per_capita,
    calc_deviation_score,
    determine_status
)

# 環境変数読み込み
load_dotenv()

# 設定
DATA_DIR = Path(__file__).parent.parent / "data"
PROCESSED_DIR = DATA_DIR / "processed"
MUNICIPALITIES_CSV = DATA_DIR / "tokyo_municipalities.csv"
EMISSIONS_JSON = PROCESSED_DIR / "tokyo_emissions.json"

# Supabase接続
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # 書き込み用

BASE_YEAR = 2013
LATEST_YEAR = 2022
TARGET_REDUCTION_RATE = 0.46  # 46%削減


def get_supabase_client() -> Client:
    """Supabaseクライアントを取得"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("環境変数 NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が必要です")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def load_municipality_info() -> Dict[str, Dict]:
    """自治体情報をCSVから読み込み"""
    municipalities = {}
    with open(MUNICIPALITIES_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            municipalities[row['city_code']] = {
                'name': row['name'],
                'region': row['region']
            }
    return municipalities


def calc_total_emission(emissions_by_sector: Dict, year: int) -> float:
    """指定年度の全部門合計排出量を計算"""
    total = 0.0
    year_str = str(year)  # JSONのキーは文字列
    for sector_data in emissions_by_sector.values():
        value = sector_data.get(year_str)
        if value is not None:
            total += value
    return round(total, 2)


def seed_municipalities(supabase: Client, muni_info: Dict):
    """自治体マスターを投入"""
    print("\n自治体マスターを投入中...")

    municipalities_data = []
    for city_code, info in muni_info.items():
        municipalities_data.append({
            'city_code': city_code,
            'name': info['name'],
            'prefecture_code': '13',
            'prefecture_name': '東京都',
            'prefecture_slug': 'tokyo',
            'region': info['region'],
            'population': None,  # 後で更新可能
            'area_km2': None,
            'zero_carbon_declared': False,
            'zero_carbon_year': None
        })

    # バッチ投入（upsert）
    result = supabase.table('municipalities').upsert(municipalities_data).execute()
    print(f"✓ {len(municipalities_data)} 件の自治体を投入")


def seed_emissions(supabase: Client, emissions_data: List[Dict]):
    """排出量データを投入"""
    print("\n排出量データを投入中...")

    all_emissions = []
    for muni_data in emissions_data:
        city_code = muni_data['city_code']
        emissions_by_sector = muni_data['emissions']

        for sector, yearly_data in emissions_by_sector.items():
            for year, value in yearly_data.items():
                if value is not None:
                    all_emissions.append({
                        'city_code': city_code,
                        'fiscal_year': year,
                        'sector': sector,
                        'value_kt_co2': value
                    })

    # バッチ投入（1000件ずつ）
    batch_size = 1000
    for i in range(0, len(all_emissions), batch_size):
        batch = all_emissions[i:i + batch_size]
        supabase.table('emissions').upsert(batch).execute()
        print(f"  {i + len(batch)} / {len(all_emissions)} 件投入済み")

    print(f"✓ {len(all_emissions)} 件の排出量データを投入")


def seed_municipality_kpis(supabase: Client, emissions_data: List[Dict]):
    """自治体KPIを計算・投入"""
    print("\n自治体KPIを計算・投入中...")

    kpis_data = []
    reduction_rates = []  # 偏差値計算用

    for muni_data in emissions_data:
        city_code = muni_data['city_code']
        emissions_by_sector = muni_data['emissions']

        # 基準年と最新年の総排出量を計算
        base_emission = calc_total_emission(emissions_by_sector, BASE_YEAR)
        latest_emission = calc_total_emission(emissions_by_sector, LATEST_YEAR)

        if base_emission == 0 or latest_emission == 0:
            continue

        # KPI計算
        reduction_rate = calc_reduction_rate(base_emission, latest_emission)
        actual_pace = calc_actual_pace(base_emission, latest_emission, BASE_YEAR, LATEST_YEAR)
        required_pace = calc_required_pace(base_emission, TARGET_REDUCTION_RATE, BASE_YEAR)
        pace_achievement_rate = calc_pace_achievement_rate(actual_pace, required_pace)
        shortfall = calc_shortfall_2030(base_emission, actual_pace, BASE_YEAR)
        status = determine_status(pace_achievement_rate)

        kpis_data.append({
            'city_code': city_code,
            'base_year': BASE_YEAR,
            'latest_year': LATEST_YEAR,
            'base_emission_kt': base_emission,
            'latest_emission_kt': latest_emission,
            'reduction_rate': reduction_rate,
            'actual_pace': actual_pace,
            'required_pace': required_pace,
            'pace_achievement_rate': pace_achievement_rate,
            'status': status,
            'shortfall_2030_kt': shortfall,
            'emission_per_capita': None,  # 人口データが必要
            'deviation_score': None,  # 後で計算
            'pref_rank': None,  # 後で計算
            'national_rank': None
        })

        reduction_rates.append(abs(reduction_rate))

    # 偏差値を計算
    for kpi in kpis_data:
        deviation = calc_deviation_score(reduction_rates, abs(kpi['reduction_rate']))
        kpi['deviation_score'] = deviation

    # ランキングを計算（ペース達成率順）
    kpis_data_sorted = sorted(kpis_data, key=lambda x: x['pace_achievement_rate'], reverse=True)
    for rank, kpi in enumerate(kpis_data_sorted, 1):
        kpi['pref_rank'] = rank

    # 投入
    result = supabase.table('municipality_kpis').upsert(kpis_data).execute()
    print(f"✓ {len(kpis_data)} 件の自治体KPIを投入")


def seed_prefecture_kpi(supabase: Client, emissions_data: List[Dict]):
    """都道府県KPIを集計・投入"""
    print("\n都道府県KPIを集計・投入中...")

    # 全自治体の合計を計算
    total_base = 0.0
    total_latest = 0.0

    for muni_data in emissions_data:
        emissions_by_sector = muni_data['emissions']
        total_base += calc_total_emission(emissions_by_sector, BASE_YEAR)
        total_latest += calc_total_emission(emissions_by_sector, LATEST_YEAR)

    # 千t → 百万t に変換
    base_mt = round(total_base / 1000, 2)
    latest_mt = round(total_latest / 1000, 2)

    # KPI計算
    reduction_rate = calc_reduction_rate(total_base, total_latest)
    actual_pace = calc_actual_pace(total_base, total_latest, BASE_YEAR, LATEST_YEAR)
    required_pace = calc_required_pace(total_base, TARGET_REDUCTION_RATE, BASE_YEAR)
    pace_achievement_rate = calc_pace_achievement_rate(actual_pace, required_pace)
    shortfall_mt = round(calc_shortfall_2030(total_base, actual_pace, BASE_YEAR) / 1000, 2)
    status = determine_status(pace_achievement_rate)

    # 自治体ステータスカウント
    kpis_result = supabase.table('municipality_kpis').select('status').execute()
    status_counts = {'on-track': 0, 'at-risk': 0, 'off-track': 0}
    for kpi in kpis_result.data:
        status_counts[kpi['status']] += 1

    pref_data = {
        'prefecture_code': '13',
        'prefecture_name': '東京都',
        'prefecture_slug': 'tokyo',
        'latest_year': LATEST_YEAR,
        'base_emission_mt': base_mt,
        'latest_emission_mt': latest_mt,
        'reduction_rate': reduction_rate,
        'actual_pace': actual_pace,
        'required_pace': required_pace,
        'pace_achievement_rate': pace_achievement_rate,
        'status': status,
        'shortfall_2030_mt': shortfall_mt,
        'municipality_count': len(emissions_data),
        'on_track_count': status_counts['on-track'],
        'at_risk_count': status_counts['at-risk'],
        'off_track_count': status_counts['off-track'],
        'national_rank': None
    }

    result = supabase.table('prefecture_kpis').upsert([pref_data]).execute()
    print(f"✓ 東京都の集計KPIを投入")


def main():
    """メイン処理"""
    print("=" * 60)
    print("Supabaseデータ投入スクリプト")
    print("=" * 60)

    # データ読み込み
    print("\nデータ読み込み中...")
    muni_info = load_municipality_info()

    if not EMISSIONS_JSON.exists():
        print(f"[ERROR] {EMISSIONS_JSON} が見つかりません")
        print("先に parse_excels.py を実行してください")
        return

    with open(EMISSIONS_JSON, 'r', encoding='utf-8') as f:
        emissions_data = json.load(f)

    print(f"✓ {len(emissions_data)} 自治体のデータを読み込み")

    # Supabase接続
    supabase = get_supabase_client()
    print("✓ Supabaseに接続")

    # データ投入
    seed_municipalities(supabase, muni_info)
    seed_emissions(supabase, emissions_data)
    seed_municipality_kpis(supabase, emissions_data)
    seed_prefecture_kpi(supabase, emissions_data)

    print("\n" + "=" * 60)
    print("✓ すべてのデータ投入が完了しました")
    print("=" * 60)


if __name__ == "__main__":
    main()
