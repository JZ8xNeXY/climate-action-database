# progress.md — 実装進捗

最終更新: 2026-02-20

---

## ステータスサマリー

| フェーズ | 状態 | 完了率 |
|---|---|---|
| Phase 0: 設計・プロトタイプ | ✅ 完了 | 100% |
| Phase 1: MVP（東京都） | ✅ 完了 | 100% |
| Phase 2: 全国展開 | ⏸ 待機中 | 0% |
| Phase 3: 高度機能 | ⏸ 待機中 | 0% |

---

## Phase 0: 設計・プロトタイプ ✅

- [x] サービスコンセプト定義
- [x] ターゲットユーザー確定（市民メイン）
- [x] コアKPI定義（必要ペース vs 実績ペース）
- [x] ナビゲーション方式決定（ドリルダウン）
- [x] デザインシステム確定（英国政府報告書スタイル）
- [x] HTMLプロトタイプ作成（climate-drilldown.html）
  - 国ビュー（都道府県グリッド + ランキング）
  - 都道府県ビュー（ペース比較 + 軌道グラフ）
  - 自治体詳細ビュー（3タブ）
- [x] データソース確認（環境省 自治体排出量カルテ）
- [x] サンプルデータ処理（西東京市 13229.xlsx）
- [x] ドキュメント整備（CLAUDE.md / requirements.md 等）

---

## Phase 1: MVP（東京都） ✅

### セットアップ
- [x] Next.jsプロジェクト初期化（MUI統合）
- [x] Supabaseプロジェクト作成
- [x] 環境変数設定（`.env.local`）
- [x] MUIテーマ設定（`style.md`のトークンをMUIテーマに反映）
- [x] フォント設定（Playfair Display + DM Mono + Noto Sans JP）
- [x] 型定義ファイル作成（`src/types/index.ts`）

### データパイプライン
- [x] 東京都62自治体の団体コードリスト作成（`data/tokyo_municipalities.csv`）
- [x] Excelダウンロードスクリプト（`scripts/download_excels.py`）
- [x] Excel→JSONパーススクリプト（`scripts/parse_excels.py`）
- [x] KPI計算スクリプト（`scripts/kpi_calculator.py`）
  - 削減率・実績ペース・必要ペース・ペース達成率・偏差値
- [x] Supabaseスキーマ作成（`scripts/create_schema.sql`）
- [x] データ投入スクリプト（`scripts/seed_supabase.py`）
- [x] データ投入完了（60自治体、10,800件の排出量データ、60件のKPI）

### コンポーネント
- [x] Layout（ヘッダー）
- [x] PaceHero（必要ペース vs 実績ペースの核心ウィジェット）
- [x] TrajectoryChart（軌道グラフ）
- [x] KpiStrip（KPIカード4枚）
- [x] KpiCard（個別KPIカード）
- [x] RankingList（ランキングリスト）
- [x] RankingRow（ランキング行）
- [x] PaceBar（ランキング行内のペースバー）
- [x] StatusBadge（on-track / at-risk / off-track）
- [x] DeviationMeter（偏差値スケールバー）
- [x] SectorTrendChart（部門別排出量推移）
- [x] SectorReductionChart（部門別削減率）

### ページ
- [x] `/` — 国レベルランディング（実データ表示）
- [x] `/tokyo` — 東京都ビュー（実データ表示）
- [x] `/tokyo/[cityCode]` — 自治体詳細（実データ表示、チャート含む）

### その他
- [x] SEO（メタタグ・OGP）
- [x] Loading states（Skeleton UI）
- [x] Error boundaries
- [x] レスポンシブ対応（MUIグリッド使用）
- [x] TypeScript型定義の修正（データベースsnake_case vs フロントエンドcamelCase対応）
- [x] チャートデータ構造の修正（日本語フィールド名→英語フィールド名）
- [x] TrajectoryDataPoint型の完全対応（target2030/target2050フィールド追加）

### データ拡充（2026-02-21追加）
- [x] 人口・面積データの取得と投入
  - 総務省統計局「統計でみる市区町村のすがた2022」より人口データ取得
  - 国土地理院「全国都道府県市区町村別面積調 2020」より面積データ取得
  - 東京都60自治体のデータをSupabaseに投入完了
- [x] 一人当たりCO2排出量の計算
  - emission_per_capitaフィールドの計算・更新（60自治体）
  - 計算式: (総排出量 千t-CO₂ × 1000) / 人口
- [x] UI改善
  - PaceHeroコンポーネントのダークモード時のテキスト色改善
  - 「必要ペース2030」等の文字を白系に変更（可読性向上）

**Phase 1 完了日**: 2026-02-20
**データ拡充完了**: 2026-02-21

---

## Phase 2: 全国展開

- [ ] 47都道府県 × 1,900自治体 データ収集
- [ ] データ処理の自動化（GitHub Actions）
- [ ] 日本地図コンポーネント（React Simple Maps）
- [ ] 全国検索機能
- [ ] パフォーマンス最適化（ISR / Edge Cache）

---

## 既知の課題・メモ

### データ品質
- 一部自治体（特に小規模）はデータ欠損年度あり（2006年度など）
- 欠損値の扱い: 線形補間 or 前年値コピー（要検討）
- 2020・2021年度はCOVID特需で排出量減少 → ペース計算から除外を検討
- 農林水産業など排出量が極小の部門は変動率が大きく表示される（例: 西東京市 +46%増加）
  - もともとの絶対量が小さいため、わずかな変化でも大きな%変化になる
  - データ自体は正しい

### 技術的懸念
- 1,900ファイル × 数MBのバッチ処理 → 分割実行が必要
- 地図データ（TopoJSON）のライセンス確認が必要

### 今後の判断ポイント
- ゼロカーボン宣言データの取得方法（環境省公開APIはなし、スクレイピング要検討）
- 「必要ペース」の計算に使う2030目標値：国の目標（▼46%）を全自治体に適用するか、各自治体の独自目標を使うか

---

## 直近のTODO（次にやること）

1. Next.jsプロジェクト初期化
2. Supabaseスキーマ作成（`api.md`の定義どおり）
3. 東京都62自治体のExcel一括ダウンロード + パース
4. KPI計算 + DB投入
5. `PaceWidget`コンポーネントから実装開始（最重要UI）
