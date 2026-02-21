#!/usr/bin/env python3
"""
統計局「統計でみる市区町村のすがた2022」人口・世帯データから
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
excel_file = 'data/population_households_2022.xls'
print(f"Reading {excel_file}...")

# シートを確認
xls = pd.ExcelFile(excel_file)
print(f"利用可能なシート: {xls.sheet_names}\n")

# 最初のシートを読み込んで構造を確認
df = pd.read_excel(excel_file, sheet_name=0, header=None)
print(f"データ形状: {df.shape}")
print(f"\n最初の20行:")
print(df.head(20))

# 団体コードを含む行を探す
print("\n\n団体コードを含む行を検索...")
header_row = None
for idx in range(min(50, len(df))):
    row_str = ' '.join([str(val) for val in df.iloc[idx].values if pd.notna(val)])
    if '団体コード' in row_str or 'コード' in row_str:
        print(f"ヘッダー候補行 {idx}: {df.iloc[idx].values[:10]}")
        if header_row is None:
            header_row = idx

if header_row is not None:
    print(f"\nヘッダー行として {header_row} を使用します")
    df = pd.read_excel(excel_file, sheet_name=0, header=header_row)
    print(f"\nカラム名:")
    for i, col in enumerate(df.columns):
        print(f"  {i}: {col}")

    print(f"\n最初の10行:")
    print(df.head(10))

    # 東京都のデータを抽出（団体コードが13で始まる）
    print("\n\n東京都のデータを抽出中...")
    # 団体コードの列名を探す
    code_col = None
    for col in df.columns:
        if '団体コード' in str(col) or 'コード' in str(col):
            code_col = col
            break

    if code_col:
        print(f"団体コード列: {code_col}")
        # 東京都（13で始まる5桁）を抽出
        tokyo_df = df[df[code_col].astype(str).str.match(r'^13\d{3}$', na=False)]
        print(f"抽出された東京都のレコード数: {len(tokyo_df)}")
        print(f"\n最初の5件:")
        print(tokyo_df.head())
    else:
        print("団体コード列が見つかりません")
else:
    print("ヘッダー行が見つかりませんでした")
