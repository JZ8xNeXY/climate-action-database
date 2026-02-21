"""
環境省「自治体排出量カルテ」Excelファイル一括ダウンロード
"""
import os
import csv
import time
import requests
from pathlib import Path


# 設定
BASE_URL = "https://policies.env.go.jp/policy/roadmap/local_keikaku/kuiki/files/tool/karte/xlsx/{city_code}.xlsx"
DATA_DIR = Path(__file__).parent.parent / "data"
RAW_DIR = DATA_DIR / "raw"
MUNICIPALITIES_CSV = DATA_DIR / "tokyo_municipalities.csv"

# ダウンロード間隔（秒）- サーバー負荷軽減のため
DOWNLOAD_INTERVAL = 0.5


def download_excel(city_code: str, output_dir: Path) -> bool:
    """
    指定した自治体のExcelファイルをダウンロード

    Args:
        city_code: 5桁の団体コード
        output_dir: 保存先ディレクトリ

    Returns:
        成功した場合True、失敗した場合False
    """
    url = BASE_URL.format(city_code=city_code)
    output_path = output_dir / f"{city_code}.xlsx"

    # 既にファイルが存在する場合はスキップ
    if output_path.exists():
        print(f"[SKIP] {city_code} - Already exists")
        return True

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        # ファイルを保存
        with open(output_path, 'wb') as f:
            f.write(response.content)

        print(f"[OK] {city_code} - Downloaded ({len(response.content)} bytes)")
        return True

    except requests.exceptions.RequestException as e:
        print(f"[ERROR] {city_code} - {e}")
        return False


def main():
    """メイン処理"""
    # 出力ディレクトリを作成
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    # CSVから自治体コードを読み込み
    city_codes = []
    with open(MUNICIPALITIES_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            city_codes.append(row['city_code'])

    print(f"東京都 {len(city_codes)} 自治体のExcelファイルをダウンロード開始")
    print(f"保存先: {RAW_DIR}")
    print("-" * 60)

    success_count = 0
    fail_count = 0

    for i, city_code in enumerate(city_codes, 1):
        print(f"[{i}/{len(city_codes)}] ", end="")

        if download_excel(city_code, RAW_DIR):
            success_count += 1
        else:
            fail_count += 1

        # サーバー負荷軽減のため待機
        if i < len(city_codes):
            time.sleep(DOWNLOAD_INTERVAL)

    print("-" * 60)
    print(f"完了: 成功 {success_count} / 失敗 {fail_count} / 合計 {len(city_codes)}")


if __name__ == "__main__":
    main()
