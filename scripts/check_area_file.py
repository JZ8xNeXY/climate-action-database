#!/usr/bin/env python3
"""
自然環境ファイルから面積データを確認
"""
import pandas as pd

excel_file = 'data/natural_environment_2022.xls'
df = pd.read_excel(excel_file, sheet_name='B', header=None)

print(f"データ形状: {df.shape}")

# 最初の10行を表示（ヘッダー情報）
print("\n=== ヘッダー部分（最初の10行） ===\n")
for i in range(10):
    print(f"行 {i}:")
    for j, val in enumerate(df.iloc[i].values[:15]):  # 最初の15列
        if pd.notna(val) and str(val).strip():
            print(f"  列{j}: {val}")
    print()

# 面積を含む行を探す
print("\n=== 「面積」を含む行 ===\n")
for i in range(15):
    row_str = ' '.join([str(val) for val in df.iloc[i].values if pd.notna(val)])
    if '面積' in row_str or 'Area' in row_str or 'area' in row_str:
        print(f"行 {i}: {row_str[:300]}")
        print(f"最初の15列:")
        for j, val in enumerate(df.iloc[i].values[:15]):
            if pd.notna(val):
                print(f"  列{j}: {val}")
        print()

# データ行のサンプル（東京都を探す）
print("\n=== データ部分から東京都を検索 ===\n")
for idx in range(10, min(800, len(df))):  # 10行目から検索
    code_val = str(df.iloc[idx, -1]) if pd.notna(df.iloc[idx, -1]) else ""
    if code_val.startswith('13'):
        print(f"行 {idx}: {df.iloc[idx, :15].values}")
        if idx > 680 and idx < 695:  # 東京都の最初の数件
            print(f"  団体コード: {df.iloc[idx, -1]}")
            print(f"  全列: {df.iloc[idx].values}")
            print()
