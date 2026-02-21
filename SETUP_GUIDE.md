# セットアップガイド - 東京都全域対応

このガイドでは、Supabaseにデータを投入して、東京都全62自治体のデータを扱えるようにする手順を説明します。

## 前提条件

- Node.js 18以上
- Python 3.11以上
- Supabaseアカウント

## 📋 ステップ1: Supabaseプロジェクト作成

1. https://supabase.com にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名: `climate-tracker`（任意）
4. データベースパスワードを設定（メモしておく）
5. リージョン: Tokyo (Northeast Asia)

## 🔑 ステップ2: 環境変数設定

`.env.local` ファイルを作成:

```bash
cp .env.local.example .env.local
```

Supabaseダッシュボードから以下を取得して設定:

```env
# Project Settings > API から取得
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Project Settings > API > service_role (secret) から取得
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

⚠️ **重要**: `SUPABASE_SERVICE_ROLE_KEY` は絶対にGitにコミットしないこと！

## 🗄️ ステップ3: データベーススキーマ作成

Supabaseダッシュボードで SQL Editor を開き、以下を実行:

```bash
# スキーマファイルの内容をコピー
cat scripts/create_schema.sql
```

内容をSQL Editorに貼り付けて実行。

以下のテーブルが作成されます:
- `municipalities` - 自治体マスター
- `emissions` - 年度別排出量
- `municipality_kpis` - 自治体KPI
- `prefecture_kpis` - 都道府県KPI

## 🐍 ステップ4: Python環境セットアップ

```bash
cd scripts

# 仮想環境作成（推奨）
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存関係インストール
pip install -r requirements.txt
```

## 📥 ステップ5: データ収集・投入

### 5-1. Excelファイルダウンロード

```bash
python download_excels.py
```

- 東京都62自治体のExcelファイルを `data/raw/` にダウンロード
- 所要時間: 約1分
- 環境省サーバーに負荷をかけないよう、0.5秒間隔で取得

### 5-2. Excelファイルパース

```bash
python parse_excels.py
```

- Excelファイルをパースして `data/processed/tokyo_emissions.json` を生成
- 部門別・年度別の排出量データを抽出

### 5-3. KPI計算・Supabase投入

```bash
python seed_supabase.py
```

- KPI計算（削減率・ペース・偏差値等）
- Supabaseへデータ投入
- 所要時間: 約30秒

実行完了後、以下が投入されます:
- 62自治体のマスターデータ
- 約8,000件の排出量データ（部門別・年度別）
- 62自治体のKPI
- 東京都の集計KPI

## 🌐 ステップ6: 動作確認

開発サーバーを起動:

```bash
npm run dev
```

以下のページにアクセス:

1. **トップページ**: http://localhost:3000
   - サンプルデータ表示

2. **東京都ビュー**: http://localhost:3000/tokyo
   - 東京都の集計KPI
   - 62自治体のランキング（Supabaseから取得）

3. **自治体詳細**: http://localhost:3000/tokyo/13229
   - 西東京市の詳細データ
   - 他の自治体コードに変更可能

## 📊 データ確認

Supabaseダッシュボードの Table Editor で確認:

```sql
-- 自治体数確認
SELECT COUNT(*) FROM municipalities;
-- → 62

-- 排出量データ件数確認
SELECT COUNT(*) FROM emissions;
-- → 約8,000件

-- KPI確認
SELECT city_code, name, actual_pace, status
FROM municipality_kpis
JOIN municipalities USING(city_code)
ORDER BY pace_achievement_rate DESC
LIMIT 10;
```

## 🔄 データ更新

環境省が新しいデータを公開した場合:

```bash
# 1. 古いデータを削除（任意）
rm -rf data/raw/*
rm -rf data/processed/*

# 2. 再ダウンロード・パース・投入
python download_excels.py
python parse_excels.py
python seed_supabase.py
```

## ⚠️ トラブルシューティング

### エラー: "環境変数が見つかりません"

→ `.env.local` が正しく設定されているか確認

### エラー: "Excelファイルが見つかりません"

→ `download_excels.py` を先に実行

### エラー: "Supabaseへの接続に失敗"

→ `SUPABASE_SERVICE_ROLE_KEY` が正しく設定されているか確認

### 一部自治体のデータが欠損

→ 環境省のサーバーでファイルが存在しない可能性あり。島しょ部などはデータが不完全な場合があります。

## 📝 次のステップ

Phase 1 完了後:

- **Phase 2**: 全国47都道府県・1,900自治体に拡大
- **Phase 3**: 部門別グラフ・地図ビュー・CSVダウンロード等の追加機能

## 🆘 サポート

問題が発生した場合:

1. `progress.md` で実装状況を確認
2. `api.md` でスキーマ定義を確認
3. エラーログを確認
