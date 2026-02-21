# data-pipeline.md — データ収集・処理パイプライン

---

## 概要

```
環境省サイト
    │
    ▼ download_excels.py
data/raw/{team_code}.xlsx  (1,900ファイル)
    │
    ▼ parse_excels.py
data/processed/emissions.json
    │
    ▼ calculate_kpis.py
data/processed/kpis.json
    │
    ▼ seed_supabase.py
Supabase DB
```

---

## scripts/download_excels.py

```python
"""
環境省「自治体排出量カルテ」からExcelを一括ダウンロード。
東京都62自治体を対象とする（Phase 1）。

実行: python scripts/download_excels.py --prefecture 13
"""
import requests, time, os
from pathlib import Path

BASE_URL = "https://policies.env.go.jp/policy/roadmap/local_keikaku/kuiri/karte/xlsx/{}.xlsx"
OUTPUT_DIR = Path("data/raw")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def download_municipality(city_code: str) -> bool:
    url = BASE_URL.format(city_code)
    out_path = OUTPUT_DIR / f"{city_code}.xlsx"

    if out_path.exists():
        print(f"  SKIP (already exists): {city_code}")
        return True

    try:
        resp = requests.get(url, timeout=30)
        if resp.status_code == 200:
            out_path.write_bytes(resp.content)
            print(f"  OK: {city_code}")
            return True
        else:
            print(f"  FAIL ({resp.status_code}): {city_code}")
            return False
    except Exception as e:
        print(f"  ERROR: {city_code} — {e}")
        return False

def main():
    # 団体コードリストを読み込む
    import csv
    with open("data/tokyo_municipalities.csv") as f:
        reader = csv.DictReader(f)
        codes = [row["city_code"] for row in reader]

    print(f"Downloading {len(codes)} municipalities...")
    success, fail = 0, 0
    for code in codes:
        ok = download_municipality(code)
        if ok: success += 1
        else: fail += 1
        time.sleep(0.5)  # サーバー負荷軽減

    print(f"\nDone: {success} OK, {fail} FAILED")

if __name__ == "__main__":
    main()
```

---

## scripts/parse_excels.py

```python
"""
ダウンロードしたExcelファイルを解析し、JSON形式に変換。

実行: python scripts/parse_excels.py
出力: data/processed/emissions.json
"""
import openpyxl, json
from pathlib import Path

RAW_DIR = Path("data/raw")
OUTPUT = Path("data/processed/emissions.json")

SECTORS = [
    '製造業', '建設業', '農林水産業', '業務その他',
    '家庭', '旅客', '貨物', '鉄道', '船舶', '廃棄物'
]
YEARS = list(range(2009, 2023))  # 2009〜2022

def parse_excel(city_code: str, filepath: Path) -> dict | None:
    try:
        wb = openpyxl.load_workbook(filepath, read_only=True, data_only=True)

        # シート名を探す
        sheet = None
        for name in wb.sheetnames:
            if 'データ' in name or 'data' in name.lower():
                sheet = wb[name]
                break
        if sheet is None:
            sheet = wb.active

        # ヘッダー行（年度）を探す
        year_col = {}  # {year: col_index}
        header_row = None
        for row in sheet.iter_rows(max_row=5):
            for cell in row:
                if isinstance(cell.value, (int, float)) and 2009 <= cell.value <= 2022:
                    year_col[int(cell.value)] = cell.column
                    header_row = cell.row

        if not year_col:
            print(f"  WARNING: Year headers not found in {city_code}")
            return None

        # 部門行を探してデータ抽出
        records = []
        for row in sheet.iter_rows(min_row=header_row + 1):
            row_label = str(row[0].value or '').strip()
            sector = next((s for s in SECTORS if s in row_label), None)
            if sector:
                yearly = {}
                for year, col in year_col.items():
                    cell_val = sheet.cell(row=row[0].row, column=col).value
                    if isinstance(cell_val, (int, float)) and cell_val >= 0:
                        yearly[year] = round(float(cell_val), 2)
                    else:
                        yearly[year] = None
                records.append({
                    "city_code": city_code,
                    "sector": sector,
                    "yearly_data": yearly
                })

        wb.close()
        return {"city_code": city_code, "sectors": records}

    except Exception as e:
        print(f"  ERROR parsing {city_code}: {e}")
        return None

def main():
    results = []
    excel_files = list(RAW_DIR.glob("*.xlsx"))
    print(f"Parsing {len(excel_files)} Excel files...")

    for fp in excel_files:
        city_code = fp.stem
        print(f"  Parsing {city_code}...")
        result = parse_excel(city_code, fp)
        if result:
            results.append(result)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(results, ensure_ascii=False, indent=2))
    print(f"\nSaved {len(results)} municipalities to {OUTPUT}")

if __name__ == "__main__":
    main()
```

---

## scripts/calculate_kpis.py

```python
"""
emissions.json からKPIを計算し、kpis.json に出力。

実行: python scripts/calculate_kpis.py
出力: data/processed/kpis.json
"""
import json, numpy as np
from pathlib import Path

EMISSIONS_FILE = Path("data/processed/emissions.json")
MUNIS_FILE = Path("data/tokyo_municipalities.csv")
OUTPUT = Path("data/processed/kpis.json")

BASE_YEAR = 2013
LATEST_YEAR = 2022
TARGET_YEAR_2030 = 2030
TARGET_REDUCTION = 0.46  # ▼46%（国目標）

def total_emission(sectors: list, year: int) -> float | None:
    vals = [s["yearly_data"].get(str(year)) or s["yearly_data"].get(year)
            for s in sectors]
    valid = [v for v in vals if v is not None]
    return round(sum(valid), 2) if valid else None

def actual_pace(base: float, latest: float, years: int) -> float:
    """年複利換算の年平均削減率（%/年、正値）"""
    if base <= 0 or latest <= 0:
        return 0
    rate = (1 - (latest / base) ** (1 / years)) * 100
    return round(rate, 2)

def required_pace(base: float, target_reduction: float, years: int) -> float:
    """目標達成に必要な年平均削減率（%/年）"""
    rate = (1 - (1 - target_reduction) ** (1 / years)) * 100
    return round(rate, 2)

def pace_status(achievement_rate: float) -> str:
    if achievement_rate >= 100:   return 'on-track'
    if achievement_rate >= 80:    return 'at-risk'
    return 'off-track'

def shortfall_2030(base: float, ap: float, base_year: int, target_year: int, target_reduction: float) -> float:
    target = base * (1 - target_reduction)
    years_remaining = target_year - base_year
    forecast = base * (1 - ap / 100) ** years_remaining
    return max(0.0, round(forecast - target, 2))

def deviation_score(values: list[float], target: float) -> float:
    arr = np.array([v for v in values if v is not None])
    if len(arr) < 2 or arr.std() == 0:
        return 50.0
    return round(50 + 10 * (target - arr.mean()) / arr.std(), 1)

def main():
    data = json.loads(EMISSIONS_FILE.read_text())
    years_span = LATEST_YEAR - BASE_YEAR  # 9年

    # すべての自治体のactual_paceを先に計算（偏差値用）
    all_actual_paces = {}
    for d in data:
        base = total_emission(d["sectors"], BASE_YEAR)
        latest = total_emission(d["sectors"], LATEST_YEAR)
        if base and latest:
            all_actual_paces[d["city_code"]] = actual_pace(base, latest, years_span)

    pace_values = list(all_actual_paces.values())
    req_pace = required_pace(1, TARGET_REDUCTION, TARGET_YEAR_2030 - BASE_YEAR)

    kpis = []
    for d in data:
        code = d["city_code"]
        base = total_emission(d["sectors"], BASE_YEAR)
        latest = total_emission(d["sectors"], LATEST_YEAR)
        if not base or not latest:
            print(f"  SKIP (missing data): {code}")
            continue

        ap = all_actual_paces.get(code, 0)
        par = round(ap / req_pace * 100, 1)

        kpis.append({
            "city_code": code,
            "base_year": BASE_YEAR,
            "latest_year": LATEST_YEAR,
            "base_emission_kt": base,
            "latest_emission_kt": latest,
            "reduction_rate": round((latest - base) / base * 100, 2),
            "actual_pace": ap,
            "required_pace": req_pace,
            "pace_achievement_rate": par,
            "status": pace_status(par),
            "shortfall_2030_kt": shortfall_2030(base, ap, BASE_YEAR, TARGET_YEAR_2030, TARGET_REDUCTION),
            "deviation_score": deviation_score(pace_values, ap),
        })

    # 都道府県内ランキング付与
    kpis.sort(key=lambda x: x["pace_achievement_rate"], reverse=True)
    for i, kpi in enumerate(kpis):
        kpi["pref_rank"] = i + 1

    OUTPUT.write_text(json.dumps(kpis, ensure_ascii=False, indent=2))
    print(f"Saved {len(kpis)} KPIs to {OUTPUT}")

if __name__ == "__main__":
    main()
```

---

## scripts/seed_supabase.py

```python
"""
処理済みデータをSupabaseに投入。
実行前に .env.local の SUPABASE_SERVICE_ROLE_KEY を設定すること。

実行: python scripts/seed_supabase.py
"""
import json, os
from pathlib import Path
from supabase import create_client

url = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
supabase = create_client(url, key)

def seed_emissions():
    data = json.loads(Path("data/processed/emissions.json").read_text())
    rows = []
    for d in data:
        for sector in d["sectors"]:
            for year, value in sector["yearly_data"].items():
                rows.append({
                    "city_code": d["city_code"],
                    "fiscal_year": int(year),
                    "sector": sector["sector"],
                    "value_kt_co2": value
                })

    # バッチ投入（1000件ずつ）
    for i in range(0, len(rows), 1000):
        batch = rows[i:i+1000]
        supabase.table("emissions").upsert(batch).execute()
        print(f"  Inserted emissions batch {i//1000 + 1}")

def seed_kpis():
    kpis = json.loads(Path("data/processed/kpis.json").read_text())
    supabase.table("municipality_kpis").upsert(kpis).execute()
    print(f"  Inserted {len(kpis)} KPIs")

if __name__ == "__main__":
    print("Seeding emissions...")
    seed_emissions()
    print("Seeding KPIs...")
    seed_kpis()
    print("Done.")
```

---

## セットアップ手順

```bash
# 1. 依存ライブラリのインストール
pip install openpyxl pandas requests numpy supabase python-dotenv

# 2. 環境変数の設定
cp .env.local.example .env.local
# .env.local を編集して Supabase キーを設定

# 3. 東京都62自治体のExcelをダウンロード
python scripts/download_excels.py --prefecture 13

# 4. Excel解析
python scripts/parse_excels.py

# 5. KPI計算
python scripts/calculate_kpis.py

# 6. DB投入
python scripts/seed_supabase.py
```
