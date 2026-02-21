#!/usr/bin/env python3
"""
Excelファイルのヘッダー部分を詳しく調査して
人口と面積の列を特定する
"""
import pandas as pd

excel_file = 'data/population_households_2022.xls'
df = pd.read_excel(excel_file, sheet_name='A', header=None)

# 最初の10行を表示（ヘッダー情報）
print("=== ヘッダー部分（最初の10行） ===\n")
for i in range(10):
    print(f"行 {i}:")
    for j, val in enumerate(df.iloc[i].values):
        if pd.notna(val) and str(val).strip():
            print(f"  列{j}: {val}")
    print()

# 項目名を探す（「人口」「面積」などのキーワード）
print("\n=== 「人口」「面積」を含む行 ===\n")
for i in range(15):
    row_str = ' '.join([str(val) for val in df.iloc[i].values if pd.notna(val)])
    if '人口' in row_str or '面積' in row_str or 'Population' in row_str or 'Area' in row_str:
        print(f"行 {i}: {row_str[:200]}")
        print(f"全列:")
        for j, val in enumerate(df.iloc[i].values):
            if pd.notna(val):
                print(f"  列{j}: {val}")
        print()
