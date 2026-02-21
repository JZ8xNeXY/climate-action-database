# CLAUDE.md — 気候変動対策 実績データベース

このファイルはClaude Codeへの指示書です。作業開始前に必ず読んでください。

## プロジェクト概要

日本全国の自治体・都道府県のCO₂排出削減「実績ペース」を可視化するWebアプリ。
「2030年・2050年目標に向けて、本当に真剣に取り組んでいるか」を数字で示す。

**コアコンセプト**: 必要ペース（%/年）vs 実績ペース（%/年）の比較

## 参照ファイル一覧

| ファイル | 内容 |
|---|---|
| `requirements.md` | 機能要件・技術スタック・フェーズ定義 |
| `progress.md` | 実装状況・完了タスク・次のTODO |
| `content.md` | データ構造・データソース・サンプルデータ |
| `style.md` | デザインシステム・カラー・タイポグラフィ |
| `architecture.md` | ディレクトリ構成・コンポーネント設計 |
| `api.md` | APIエンドポイント・Supabaseスキーマ |

## 技術スタック

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Deploy**: Vercel
- **Data処理**: Python (scripts/)

## 作業ルール

1. **コンポーネント追加前に`architecture.md`を確認**する
2. **新しいAPIエンドポイントは`api.md`に追記**する
3. **実装完了したタスクは`progress.md`のチェックボックスをON**にする
4. **デザインはstyle.mdのトークンに従う**。独自の色・フォントを勝手に追加しない
5. TypeScriptの型は`src/types/`に集約する
6. データフェッチはServer Componentsで行い、クライアントに渡す

## 優先順位

**今すぐやること（Phase 1 MVP）**:
→ `progress.md` の「Phase 1」セクションを確認

**やらないこと（スコープ外）**:
- ユーザー認証・ログイン機能
- データ入力・編集UI（データはPythonスクリプトで投入）
- モバイルアプリ化
- 英語対応

## 重要な設計判断

- 政治的メッセージは入れない。**数字だけで語らせる**
- 評価は「ペース達成率」の3段階（on-track / at-risk / off-track）のみ
- データは環境省「自治体排出量カルテ」が唯一の一次ソース
- 基準年は **2013年度**（パリ協定基準）で統一
