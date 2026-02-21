# Vercel デプロイ手順

## 前提条件

- Supabaseプロジェクトが作成済み
- データベースにデータが投入済み

## 手順

### 1. GitHubリポジトリをVercelに接続

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "Add New..." → "Project" をクリック
3. GitHubリポジトリ `climate-action-database` を選択
4. "Import" をクリック

### 2. 環境変数を設定

**Project Settings > Environment Variables** で以下を追加：

#### 必須の環境変数

```bash
# Supabase URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anon Key（Public Key）
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 環境変数の取得方法

1. [Supabase Dashboard](https://supabase.com/dashboard) を開く
2. プロジェクトを選択
3. Settings > API に移動
4. 以下をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **注意**: Service Role Key（秘密鍵）は使用しないでください。Anon Key（公開鍵）のみを使用します。

### 3. デプロイ

1. 環境変数を保存
2. "Deploy" ボタンをクリック
3. ビルドが完了するまで待機（2-3分）

### 4. デプロイ確認

デプロイが完了したら、Vercelが提供するURLにアクセスして動作確認：

- トップページが表示される
- `/tokyo` ページで東京都のデータが表示される
- `/tokyo/13229` などで自治体詳細が表示される

## トラブルシューティング

### ビルドエラー: "supabaseUrl is required"

**原因**: 環境変数が設定されていない

**解決策**:
1. Vercel Dashboard > Project Settings > Environment Variables
2. 上記の必須環境変数を追加
3. Deployments タブから "Redeploy" をクリック

### データが表示されない

**原因**: データベースが空、またはRLSポリシーの問題

**解決策**:
1. Supabaseダッシュボードで Table Editor を確認
2. `municipalities`, `municipality_kpis`, `emissions` テーブルにデータがあるか確認
3. RLSポリシーが有効で、SELECT権限が `anon` に付与されているか確認

### ビルドは成功するがページが真っ白

**原因**: JavaScriptエラー、またはフェッチエラー

**解決策**:
1. ブラウザの開発者ツール（F12）でコンソールを確認
2. Vercel Dashboard > Deployments > Function Logs でエラーを確認
3. Supabase Dashboard > Database > Logs でクエリエラーを確認

## 環境変数の更新

環境変数を変更した場合は、必ず再デプロイが必要です：

1. Project Settings > Environment Variables で変更
2. Deployments タブ > 最新のデプロイの "..." メニュー > "Redeploy"

または、新しいコミットをpushすると自動的に再デプロイされます。

## パフォーマンス最適化（オプション）

### ISR（Incremental Static Regeneration）の有効化

データ更新頻度が低い場合、ISRを有効にしてパフォーマンスを改善できます。

`src/app/tokyo/[cityCode]/page.tsx`:
```typescript
export const revalidate = 3600; // 1時間ごとに再生成
```

### Edge Runtime（実験的）

グローバルな低レイテンシーが必要な場合：
```typescript
export const runtime = 'edge';
```

## カスタムドメインの設定

1. Project Settings > Domains
2. カスタムドメインを追加
3. DNSレコードを設定（VercelがCNAMEを提供）

---

**参考リンク**:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
