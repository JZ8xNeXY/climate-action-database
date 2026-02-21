# style.md — デザインシステム

デザインコンセプト: **英国政府報告書スタイル**（Government Gazette）
格調・信頼感・データの客観性を視覚的に表現する。

---

## カラーパレット

### CSS変数 / Tailwind設定

```css
/* tailwind.config.ts の extend.colors に追加 */
colors: {
  navy: {
    DEFAULT: '#1a2744',  /* メイン濃紺 */
    mid:     '#243358',  /* 中間 */
    light:   '#2e4070',  /* 薄め */
  },
  cream: {
    DEFAULT: '#f5f0e8',  /* 背景 */
    dark:    '#ede6d8',  /* 区切り・無効 */
  },
  gold: {
    DEFAULT: '#b8962e',  /* アクセント */
    light:   '#d4af50',  /* ホバー・明るい強調 */
  },
  status: {
    green:      '#2d6b45',
    greenLight: '#e8f5ed',
    amber:      '#b87020',
    amberLight: '#fdf3e3',
    red:        '#8b2a2a',
    redLight:   '#f5e8e8',
  },
  border: {
    DEFAULT: '#c8bfa8',
    dark:    '#a09070',
  },
}
```

### カラー用途

| トークン | 用途 |
|---|---|
| `navy` | ヘッダー・サイドバー背景・主要テキスト・グラフ配色 |
| `navy-mid` | 検索バー背景 |
| `cream` | ページ背景 |
| `cream-dark` | カード区切り・トラックバー |
| `gold` | アクセント・装飾ライン・パンくず・重要ラベル |
| `gold-light` | ホバー状態・明るい金 |
| `status-green` | on-track テキスト・グラフ（削減が良い部門） |
| `status-amber` | at-risk テキスト・グラフ |
| `status-red` | off-track テキスト・グラフ（削減が遅い） |
| `border` | カード・テーブルの罫線 |

### グラフ配色（固定順）

```ts
export const CHART_COLORS = {
  sector: {
    home:       '#1a2744',  // 家庭
    business:   '#3d5a8a',  // 業務
    transport:  '#b8962e',  // 旅客
    industry:   '#2d6b45',  // 製造業
    waste:      '#c8bfa8',  // 廃棄物
    other:      '#e0d8c8',  // その他
  },
  trajectory: {
    actual:     '#b8962e',  // 実績（ゴールド）
    required:   'rgba(26,39,68,0.25)',  // 必要軌道（薄紺）
    target2030: '#2d6b45',  // 2030目標マーカー
    target2050: 'rgba(93,196,122,0.7)', // 2050目標マーカー
  },
  pace: {
    onTrack:    '#2d6b45',
    atRisk:     '#b87020',
    offTrack:   '#8b2a2a',
    needed:     'rgba(26,39,68,0.15)',
  }
}
```

---

## タイポグラフィ

### フォントファミリー

```css
/* Google Fonts でロード */
Playfair Display  → 見出し・KPI数値（セリフ体、格調）
DM Mono          → ラベル・メタデータ・数値補足（等幅）
Noto Sans JP     → 本文・UI一般（可読性重視）
```

### スケール

| 用途 | フォント | サイズ | ウェイト | letter-spacing |
|---|---|---|---|---|
| ページタイトル | Playfair Display | 30-32px | 700 | -0.01em |
| セクション見出し | Playfair Display | 22-26px | 600 | 0 |
| KPI大数値 | Playfair Display | 30-48px | 700 | 0 |
| セクションラベル | DM Mono | 9px | 400 | 0.22em |
| メタ情報 | DM Mono | 9-10px | 300 | 0.14em |
| テーブルヘッダー | DM Mono | 8-9px | 400 | 0.18em |
| 本文・ラベル | Noto Sans JP | 12-13px | 300 | 0.04em |
| ボタン | DM Mono | 10-11px | 400 | 0.18em |

### テキスト変換ルール
- セクションラベル・テーブルヘッダー: `text-transform: uppercase`
- 日本語テキストには `uppercase` を使わない
- DM Monoの数値: `font-variant-numeric: tabular-nums`

---

## スペーシング・レイアウト

### ページ余白
```
デスクトップ: padding 36px 48px
タブレット:   padding 24px 32px
モバイル:     padding 20px 16px
```

### コンポーネント間隔
```
セクション間: 24-28px
カード内余白: 18-24px
テーブル行:   11-14px padding vertical
```

### グリッド
```
2カラム: grid-template-columns: 1fr 1fr; gap: 20px;
4カラム（KPI）: grid-template-columns: repeat(4, 1fr); gap: 0;
メインレイアウト: grid-template-columns: [sidebar] 280-300px [main] 1fr;
```

---

## コンポーネントスタイルガイド

### カード（Panel）
```
background: white
border: 1px solid var(--border)
角丸: なし（直角）
上部アクセントライン: 3px solid [カラー]
```

### ラベル（SectionLabel）
```
font: DM Mono 9px
letter-spacing: 0.22em
text-transform: uppercase
color: text-muted (#6a6258)
```
先頭にショートライン（`::before`）を付ける:
```css
.section-label::before {
  content: '';
  display: inline-block;
  width: 12px; height: 2px;
  background: var(--navy);
  margin-right: 8px;
}
```

### StatusBadge
```
on-track:  bg #e8f5ed, border rgba(45,107,69,.3),  text #2d6b45
at-risk:   bg #fdf3e3, border rgba(184,112,32,.3), text #b87020
off-track: bg #f5e8e8, border rgba(139,42,42,.3),  text #8b2a2a
padding: 3px 8px
font: DM Mono 10px
border: 1px solid
角丸: なし
```

### PaceBar（ランキング行内）
```
トラック: height 4px, bg cream-dark
実績バー: height 4px, 状態により色変更
必要ペースマーカー: width 2px, bg navy 30% opacity
```

### テーブル
```
ヘッダー: DM Mono 8-9px uppercase, border-bottom 1px solid border
行: border-bottom 1px solid rgba(200,191,168, .35)
ホバー: background rgba(26,39,68, .03)
フォント: Noto Sans JP 12-13px
数値列: DM Mono, text-align right
```

### ゴールドライン（装飾）
```css
.gold-rule {
  height: 1px;
  background: linear-gradient(90deg, var(--gold), transparent);
}
```

### ヘッダー
```
background: navy
bottom border: 3px solid gold
ブランドマーク: 42px circle, border 2px gold
組織名ラベル: DM Mono 9px, gold-light, uppercase
タイトル: Playfair Display 19px, cream
```

---

## アニメーション

シンプルなトランジションのみ使用。過度なアニメーション禁止。

```css
/* クリック・ホバー */
transition: color 0.15s ease;
transition: background 0.15s ease;
transition: all 0.2s ease;

/* ページ遷移（フェード） */
transition: opacity 0.2s ease;

/* バーの初期描画 */
transition: width 0.6s ease;
```

---

## レスポンシブブレークポイント

```
sm:  640px  モバイル
md:  768px  タブレット縦
lg:  1024px タブレット横・デスクトップ
xl:  1280px ワイドデスクトップ
```

モバイル時:
- サイドバー非表示（ハンバーガーメニューで代替、Phase 2）
- グリッドを1カラムに変更
- KPIカードを2×2に変更
- グラフの height を小さく調整

---

## ダークモード

Phase 1では不要。ネイビーサイドバー・ヘッダーが「ダーク要素」として機能する。
全ページダークモードは Phase 3 以降で検討。

---

## アクセシビリティ

- ステータスの色のみに依存しない: 必ずラベルテキストを併記
- フォーカスリング: `outline: 2px solid var(--gold)` を全インタラクティブ要素に
- コントラスト比: cream背景 + navy テキスト → WCAG AA達成
- グラフ: `aria-label` にデータのサマリーを記述
