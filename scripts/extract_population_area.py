#!/usr/bin/env python3
"""
総務省の住民基本台帳データから人口・面積データを抽出
"""
import pandas as pd
import json

# 総務省Excelファイルを読み込み
# このファイルは令和4年（2022年）1月1日時点のデータ
excel_file = 'data/soumu_population_2022.xlsx'

try:
    # Excelファイルの全シートを確認
    xls = pd.ExcelFile(excel_file)
    print(f"利用可能なシート: {xls.sheet_names}")

    # 通常、市区町村データは特定のシートに含まれている
    # よくあるシート名: '市区町村', '都道府県・市区町村', '表1', etc.
    for sheet_name in xls.sheet_names[:5]:  # 最初の5シートを確認
        print(f"\n=== シート: {sheet_name} ===")
        df = pd.read_excel(excel_file, sheet_name=sheet_name, nrows=10)
        print(df.head())
        print(f"カラム: {df.columns.tolist()}")

except Exception as e:
    print(f"エラー: {e}")
