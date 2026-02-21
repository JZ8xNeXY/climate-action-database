#!/usr/bin/env python3
"""
統計局「統計でみる市区町村のすがた2022、2023」から
東京都62自治体の人口・面積データを抽出してSupabaseに投入
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

# Excelファイルを読み込み
excel_file = 'data/stat_municipalities_2022_2023.xls'
print(f"Reading {excel_file}...")

# Excelファイルの構造を確認
xls = pd.ExcelFile(excel_file)
print(f"\n利用可能なシート: {xls.sheet_names}")

# メインのデータシートを読み込み（通常は最初のシート）
df = pd.read_excel(excel_file, sheet_name=0)
print(f"\nデータ形状: {df.shape}")
print(f"カラム: {df.columns.tolist()[:10]}...")  # 最初の10カラムを表示

# ヘッダー行を探す（団体コードがある行）
print("\n最初の20行を確認:")
print(df.head(20))

# 団体コードの列を探す
for idx, row in df.head(30).iterrows():
    if '団体コード' in str(row.values):
        print(f"\n団体コード行が見つかりました: {idx}行目")
        print(row.values)
        header_row = idx
        break
else:
    print("\n団体コード行が見つかりません。最初の行をヘッダーとして使用します。")
    header_row = 0

# ヘッダー行を指定して再読み込み
df = pd.read_excel(excel_file, sheet_name=0, header=header_row)
print(f"\nヘッダー適用後:")
print(f"カラム: {df.columns.tolist()}")
print(f"\n最初の5行:")
print(df.head())

# 必要なカラム名を確認
print("\n\n=== カラム名の詳細 ===")
for i, col in enumerate(df.columns):
    print(f"{i}: {col}")
