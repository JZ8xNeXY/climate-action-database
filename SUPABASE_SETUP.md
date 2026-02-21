# Supabase セットアップ手順

## 1️⃣ Supabaseプロジェクト作成

### 1-1. アカウント作成・ログイン
1. https://supabase.com にアクセス
2. 「Start your project」→ GitHubでサインイン
3. ダッシュボードに移動

### 1-2. 新規プロジェクト作成
1. 「New Project」をクリック
2. 以下を入力：
   - **Name**: `climate-tracker`（任意）
   - **Database Password**: 強力なパスワードを設定（必ずメモ！）
   - **Region**: `Tokyo (Northeast Asia)` を選択
   - **Pricing Plan**: Free を選択
3. 「Create new project」をクリック
4. プロジェクトの準備完了を待つ（1-2分）

---

## 2️⃣ APIキーの取得

### 2-1. Project Settings を開く
1. 左サイドバー下部の⚙️ **Settings** をクリック
2. **API** をクリック

### 2-2. 必要な情報をコピー
以下の3つをメモ帳にコピー：

**① Project URL**
```
https://xxxxxxxxxxxxx.supabase.co
```

**② anon public (公開用キー)**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhY...
```

**③ service_role (管理者キー)**
- 「Reveal」ボタンをクリックして表示
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhY...
```

⚠️ **重要**: `service_role`キーは絶対に公開しないこと！

---

## 3️⃣ 環境変数の設定

### 3-1. .env.local ファイルを作成

プロジェクトルートで以下を実行：

```bash
cd /Users/satoutsubasa/Desktop/53_climate
```

`.env.local` ファイルを作成し、以下を記入：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhY...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhY...
```

**手順:**
1. ステップ2でコピーした3つの値を貼り付け
2. ファイルを保存

---

## 4️⃣ データベーススキーマ作成

### 4-1. SQL Editor を開く
1. Supabaseダッシュボードに戻る
2. 左サイドバーの **SQL Editor** をクリック
3. 「New query」をクリック

### 4-2. スキーマSQLを実行

以下のコマンドでスキーマファイルの内容を表示：

```bash
cat scripts/create_schema.sql
```

表示された内容を **すべてコピー** して、SQL Editorに貼り付け。

### 4-3. 実行
1. 右下の **Run** ボタンをクリック
2. 成功メッセージを確認：`Success. No rows returned`

### 4-4. テーブル確認
1. 左サイドバーの **Table Editor** をクリック
2. 以下のテーブルが作成されていることを確認：
   - `municipalities`
   - `emissions`
   - `municipality_kpis`
   - `prefecture_kpis`

---

## 5️⃣ データ投入

### 5-1. Python仮想環境を起動

```bash
cd /Users/satoutsubasa/Desktop/53_climate
source scripts/venv/bin/activate
```

### 5-2. データ投入スクリプトを実行

```bash
python scripts/seed_supabase.py
```

### 5-3. 結果確認

以下のメッセージが表示されれば成功：

```
✓ 60 件の自治体を投入
✓ 8,000+ 件の排出量データを投入
✓ 60 件の自治体KPIを投入
✓ 東京都の集計KPIを投入
✓ すべてのデータ投入が完了しました
```

### 5-4. データ確認

Supabaseダッシュボードで確認：

1. **Table Editor** → `municipalities` → 60行あることを確認
2. **Table Editor** → `emissions` → 8,000行以上あることを確認
3. **Table Editor** → `municipality_kpis` → 60行あることを確認

---

## 6️⃣ アプリケーションで確認

### 6-1. 開発サーバー再起動

```bash
npm run dev
```

### 6-2. ブラウザで確認

http://localhost:3000 にアクセス

- トップページ: 東京都のカード表示
- `/tokyo`: 60自治体のランキング（実データ）
- `/tokyo/13229`: 西東京市の詳細（実データ）

---

## ❌ トラブルシューティング

### エラー: "環境変数が見つかりません"
→ `.env.local` が正しく作成されているか確認
→ 開発サーバーを再起動

### エラー: "Supabaseへの接続に失敗"
→ APIキーが正しいか確認
→ Project URLが正しいか確認

### データが表示されない
→ `seed_supabase.py` が成功したか確認
→ Table Editorでデータがあるか確認

---

## 📝 次のステップ

データ投入完了後：
1. `/tokyo` でランキングが表示されることを確認
2. 自治体をクリックして詳細ページに遷移
3. すべてのグラフ・KPIが正しく表示されることを確認

---

## 🔒 セキュリティ注意事項

- `.env.local` は **絶対にGitにコミットしない**（.gitignoreに含まれています）
- `SUPABASE_SERVICE_ROLE_KEY` は **絶対に公開しない**
- 本番環境では環境変数をVercelの設定で管理
