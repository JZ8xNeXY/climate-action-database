#!/usr/bin/env python3
"""
統計局「統計でみる市区町村のすがた2022」から
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

# データを生で読み込み（ヘッダーなし）
df = pd.read_excel(excel_file, sheet_name='A', header=None)
print(f"データ形状: {df.shape}")

# 団体コードは最後の列（32列目）にあるようなので、
# 10行目以降をデータ行として扱う
data_start_row = 10

# データ部分を切り出し
df_data = df.iloc[data_start_row:].copy()

# 列インデックスを確認するため、数行表示
print("\nデータサンプル（最後の3列を含む）:")
print(df_data[[0, 1, 2, 30, 31, 32]].head(20))

# 団体コード列（最後の列）でフィルタ
code_col_idx = 32  # 0-indexedなので列番号32が33列目
df_data[code_col_idx] = df_data[code_col_idx].astype(str).str.strip()

# 5桁の団体コードのみ抽出（13xxxの形式）
df_data = df_data[df_data[code_col_idx].str.match(r'^\d{5}$', na=False)]
print(f"\n有効な団体コード: {len(df_data)}件")

# 東京都のデータを抽出
df_tokyo = df_data[df_data[code_col_idx].str.startswith('13')]
print(f"東京都のレコード: {len(df_tokyo)}件")

# 列番号を確認するため、ヘッダー行（9行目）を表示
print("\nヘッダー行（推定）:")
header_row = df.iloc[9]
print(header_row)

# 人口と面積の列を探す
# 通常、列1が市区町村名、列2が指標コード、その後が各種データ
print("\n東京都のデータサンプル:")
print(df_tokyo[[1, 2, 32]].head(10))

# 実際のデータを見て、人口・面積がどの列にあるか確認
print("\n全列を表示（最初の3レコード）:")
for idx in df_tokyo.head(3).index:
    print(f"\n団体コード: {df_tokyo.loc[idx, 32]}, 市区町村名: {df_tokyo.loc[idx, 1]}")
    print(f"全データ: {df_tokyo.loc[idx].values}")
