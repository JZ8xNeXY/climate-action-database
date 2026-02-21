#!/usr/bin/env python3
"""
統計局Excelファイルの構造を詳しく調査
"""
import pandas as pd

excel_file = 'data/stat_municipalities_2022_2023.xls'

# 2022シートを読み込み
print("=== 2022シート ===")
df_2022 = pd.read_excel(excel_file, sheet_name='2022', header=None)
print(f"形状: {df_2022.shape}")
print(f"\n最初の10行 x 10列:")
print(df_2022.iloc[:10, :10])

print(f"\n\n50行目付近:")
print(df_2022.iloc[48:58, :10])

# 団体コードっぽい数字を探す（13で始まる5桁）
print(f"\n\n団体コード（13xxx）を含む行を検索:")
for idx, row in df_2022.iterrows():
    if idx > 200:  # 最初の200行だけチェック
        break
    for val in row:
        if pd.notna(val) and isinstance(val, (int, float)):
            if 13000 < val < 13400:  # 東京都の団体コード範囲
                print(f"行 {idx}: {row.values[:15]}")
                break
