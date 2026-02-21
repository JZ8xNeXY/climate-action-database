# 気候変動対策 実績データベース

日本全国の自治体・都道府県のCO₂排出削減「実績ペース」を可視化するWebアプリケーション

## コンセプト

**必要ペース（%/年）vs 実績ペース（%/年）** の比較により、2030年・2050年目標に向けた取り組みの進捗を数値で示す。

## 技術スタック

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **UI**: Material-UI (MUI) v5
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Deploy**: Vercel

## 開発環境セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成:

```bash
cp .env.local.example .env.local
```

以下の値を設定:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

## 実装状況

### ✅ 完了

- Next.js + MUI プロジェクト構築
- デザインシステム（style.mdをMUIテーマに実装）
- 型定義（自治体KPI、都道府県KPI、排出量データ）
- コアコンポーネント:
  - **PaceHero**: 実績ペース vs 必要ペースの核心ウィジェット
  - **TrajectoryChart**: 排出量軌道グラフ（Recharts）
  - **KpiStrip/KpiCard**: KPI表示カード
  - **RankingList/RankingRow**: 自治体ランキングリスト
  - **PaceBar**: ペース達成率バー
  - **StatusBadge**: ステータスバッジ（on-track/at-risk/off-track）
  - **SiteHeader**: ヘッダー（英国政府報告書スタイル）

### 🚧 進行中（Phase 1）

- Supabaseプロジェクト作成
- データパイプライン（Python スクリプト）
- 東京都62自治体データ収集
- 詳細ページ実装（/tokyo, /tokyo/[cityCode]）

### ⏸ 未着手（Phase 2以降）

- 全国展開（47都道府県・1,900自治体）
- 日本地図ビュー
- 全国検索機能
- CSVダウンロード

## ディレクトリ構成

```
53_climate/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/          # ヘッダー・フッター等
│   │   ├── pace/            # ペース関連コンポーネント
│   │   ├── kpi/             # KPIカード
│   │   ├── ranking/         # ランキング
│   │   ├── charts/          # グラフ
│   │   └── ui/              # 汎用UIプリミティブ
│   ├── lib/
│   │   ├── theme.ts         # MUIテーマ（style.md準拠）
│   │   ├── supabase.ts      # Supabaseクライアント
│   │   └── queries.ts       # DBクエリ関数
│   ├── types/
│   │   └── index.ts         # 型定義
│   └── data/
│       └── sampleData.ts    # サンプルデータ
├── scripts/                 # データ処理（Python）
├── data/                    # 生データ・処理済みデータ
├── docs/                    # ドキュメント（*.md）
└── public/                  # 静的ファイル
```

## デザインシステム

英国政府報告書スタイルを採用（詳細は `style.md` 参照）

### カラーパレット

- **Navy** (`#1a2744`): メインカラー
- **Cream** (`#f5f0e8`): 背景
- **Gold** (`#b8962e`): アクセント
- **Status Green** (`#2d6b45`): on-track
- **Status Amber** (`#b87020`): at-risk
- **Status Red** (`#8b2a2a`): off-track

### フォント

- **Playfair Display**: 見出し・KPI大数値
- **DM Mono**: ラベル・メタデータ・数値補足
- **Noto Sans JP**: 本文・UI一般

## ドキュメント

- `CLAUDE.md`: Claude Code用メイン指示書
- `requirements.md`: 機能要件・技術要件
- `progress.md`: 実装進捗
- `content.md`: データ構造・データソース
- `style.md`: デザインシステム
- `architecture.md`: ディレクトリ構成・コンポーネント設計
- `api.md`: APIエンドポイント・Supabaseスキーマ

## ライセンス

Private
