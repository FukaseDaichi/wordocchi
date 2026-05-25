# ワードッチ UI/UX デザイン設計書

最終更新日: 2026-05-25  
対象: ワードッチ親向け進行補助ツール (Next.js / Tailwind CSS / PWA / GitHub Pages)  
関連: [system-requirements-design.md](./system-requirements-design.md) / [nextjs-folder-structure-design.md](./nextjs-folder-structure-design.md) / [wordocchi-rule-definition.md](./wordocchi-rule-definition.md) / [implementation-rules.md](./implementation-rules.md)

## 目的

このドキュメントは、ワードッチ親向け進行補助ツールのビジュアルデザインと UX を、実装可能な粒度で定義する。Tailwind CSS のユーティリティクラスを基本にしつつ、細かな装飾・擬似要素・safe area・アニメーションなどは必要に応じてポイント CSS で補う前提で、デザイントークン、コンポーネント、レイアウト、状態遷移ごとの画面設計を確定する。

実装担当者がこのドキュメントを読むだけで、Figma カンプを別途用意せずに UI を組み立てられることをゴールとする。

## デザインコンセプト

> 「親がやさしい司会者になれる、絵本のような進行カード」

- **対象ユーザー**: 家族・友人と遊ぶ親プレイヤー (6歳以上の子と一緒)
- **シーン**: 食卓・リビング・カフェなどで片手でスマホを持って操作する
- **キーワード**: あたたかい / 親しみやすい / 子どもにも見せられる / 大人も恥ずかしくない / 視認性が高い

### 3つのデザイン原則

1. **やさしいトーン** — 食卓に置いても浮かない、絵本のような色とフォルム。鋭角・原色・無機質なグレースケールを避ける。
2. **役割が一目でわかる** — 「親だけが見る情報」と「子に見せていい情報」を、配色とアイコンで明確に区別する。
3. **片手で押し切れる** — 主要アクションは画面下部に大きく配置。タップターゲットは最小 48×48px。

## デザイントークン

### カラーパレット

クリーム系のあたたかい背景に、緑のメインアクションと、絵本的なアクセントカラーを重ねる。

| 用途 | 名前 | Hex | Tailwind カスタム名 |
|---|---|---|---|
| 背景 (ベース) | `cream-50` | `#FFF8E7` | `bg-cream-50` |
| 背景 (カード) | `cream-100` | `#FFFBF0` | `bg-cream-100` |
| 背景 (アクセントカード) | `cream-200` | `#FFF1D6` | `bg-cream-200` |
| 主要テキスト | `ink-900` | `#3D2E1F` | `text-ink-900` |
| 副次テキスト | `ink-600` | `#7A6450` | `text-ink-600` |
| 補助テキスト | `ink-400` | `#B6A28A` | `text-ink-400` |
| プライマリ (実行) | `leaf-500` | `#5BA84A` | `bg-leaf-500` |
| プライマリ濃 | `leaf-600` | `#4A8E3B` | `hover:bg-leaf-600` |
| プライマリ淡 | `leaf-100` | `#E3F2DA` | `bg-leaf-100` |
| バッジ (注意) | `sun-400` | `#FFCB47` | `bg-sun-400` |
| バッジ淡 | `sun-100` | `#FFF2CC` | `bg-sun-100` |
| 親専用 (秘匿) | `rose-500` | `#E36B6B` | `text-rose-500` |
| 親専用 淡 | `rose-100` | `#FBE3E0` | `bg-rose-100` |
| 情報 (子向け) | `sky-500` | `#6BB8DB` | `bg-sky-500` |
| 区切り | `border-200` | `#F0E2C8` | `border-border-200` |
| 罠注意 (危険) | `danger-500` | `#E0635A` | `text-danger-500` |

#### セマンティックロール

| ロール | トークン | 使用例 |
|---|---|---|
| `surface-base` | `cream-50` | 画面全体の背景 |
| `surface-card` | `cream-100` | フェイズパネル、設定カード |
| `surface-secret` | `rose-100` + `dashed border-rose-300` | 親だけが見るヒントカード |
| `action-primary` | `leaf-500` | 「新しくはじめる」「次へ」など主CTA |
| `action-secondary` | `cream-200` + `text-ink-900` | 「リセット」「閉じる」など副ボタン |
| `phase-indicator` | `sun-400` | 「はじめよう！」などの状態バッジ |

### タイポグラフィ

日本語の可読性を優先し、丸ゴシック系を中心に組む。

| ロール | フォント | サイズ (mobile) | サイズ (≥sm) | ウェイト | 行間 |
|---|---|---|---|---|---|
| アプリタイトル | `M PLUS Rounded 1c` | `text-4xl` (36px) | `text-5xl` (48px) | `900` | `leading-tight` |
| 画面見出し (フェイズ名) | `M PLUS Rounded 1c` | `text-2xl` (24px) | `text-3xl` (30px) | `800` | `leading-snug` |
| カード見出し | `M PLUS Rounded 1c` | `text-lg` (18px) | `text-xl` (20px) | `700` | `leading-snug` |
| 本文 | `Noto Sans JP` | `text-base` (16px) | `text-base` (16px) | `500` | `leading-relaxed` |
| 補助テキスト | `Noto Sans JP` | `text-sm` (14px) | `text-sm` (14px) | `400` | `leading-relaxed` |
| ボタンラベル | `M PLUS Rounded 1c` | `text-lg` (18px) | `text-xl` (20px) | `700` | `leading-none` |
| タイマー数字 | `M PLUS Rounded 1c` | `text-6xl` (60px) | `text-8xl` (96px) | `900` | `leading-none` `tabular-nums` |
| バッジ | `M PLUS Rounded 1c` | `text-xs` (12px) | `text-sm` (14px) | `700` | `leading-none` |

#### フォント読み込み

`src/app/layout.tsx` で `next/font/google` を使い、表示遅延を抑える。

```tsx
import { M_PLUS_Rounded_1c, Noto_Sans_JP } from "next/font/google";

const rounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-rounded",
  display: "swap",
});

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});
```

タイトルや見出しは `font-rounded`、本文は `font-noto` を当てる。GitHub Pages の静的配信でも Next.js のフォント最適化は機能する。

### スペーシング

Tailwind の標準スケール (`4px` 刻み) を使う。ローカルルールとして以下の用途を固定する。

| 用途 | クラス | px |
|---|---|---|
| カード内余白 (mobile) | `p-5` | 20 |
| カード内余白 (≥sm) | `sm:p-6` | 24 |
| カード間ギャップ | `gap-4` | 16 |
| セクション間 | `space-y-6` | 24 |
| 画面外周 (safe area 除く) | `px-4 pt-3 pb-6` | 16/12/24 |
| ボタン上下 padding | `py-4` | 16 |
| ボタン左右 padding | `px-6` | 24 |
| アイコン+テキスト間 | `gap-2` | 8 |

### 角丸 (radius)

絵本らしい柔らかさのため、四角の要素は基本的に大きめの角丸を使う。

| 用途 | クラス | px |
|---|---|---|
| カード | `rounded-3xl` | 24 |
| 内側パネル | `rounded-2xl` | 16 |
| ボタン (CTA) | `rounded-2xl` | 16 |
| ピル / バッジ | `rounded-full` | ∞ |
| 入力フィールド | `rounded-xl` | 12 |
| アイコンボタン | `rounded-2xl` | 16 |

### エレベーション (影)

影は控えめにし、紙が机に置かれた程度のリフトを表現する。

| レベル | クラス | 用途 |
|---|---|---|
| `elev-0` | (なし) | 地のセクション |
| `elev-1` | `shadow-[0_2px_6px_rgba(110,80,40,0.08)]` | 通常カード |
| `elev-2` | `shadow-[0_6px_16px_rgba(110,80,40,0.12)]` | 主要CTA、モーダル |
| `elev-3` | `shadow-[0_12px_28px_rgba(110,80,40,0.18)]` | ダイアログのフローティング |

色付き影は使わず、ベージュ寄りの茶色で統一する。

### モーション

| 動き | 持続 | イージング | 使用箇所 |
|---|---|---|---|
| ボタン押下 | `duration-100` | `ease-out` + `active:scale-[0.97]` | すべてのボタン |
| フェイズ切替 | `duration-300` | `ease-out` | パネルの fade + slide-up 8px |
| モーダル開閉 | `duration-200` | `ease-out` | overlay fade、本体 scale 0.96→1 |
| タイマー残り少ない時 | `duration-1000` | `ease-in-out` 無限 | `animate-pulse` を残り60秒以下で |

`prefers-reduced-motion: reduce` のときはアニメーションを `duration-0` で打ち消す。

### アイコン

絵本トーンを保つため、ストロークが太めで丸い形を選ぶ。

- ライブラリ: `lucide-react` の round 系、または絵文字を Picture 要素で囲む
- サイズ: 標準 `w-5 h-5` (20px)、大きいボタン内では `w-6 h-6` (24px)
- カラー: `currentColor` を基本にし、テキストカラーで継承

セマンティクスを持つカスタム絵文字 / アイコン:

| 役割 | 表現 | コード/置き換え |
|---|---|---|
| 親だけが見る | 鍵+目線 | `🔒` + `<EyeIcon />` の合成 |
| 現在のフェイズ | 旗 | `🚩` または `<FlagIcon />` |
| タイマー | 時計 | `<ClockIcon />` |
| ルール | 疑問符の丸 | `<HelpCircleIcon />` |
| メニュー | ハンバーガー | `<MenuIcon />` |
| キャラクター | 犬 / 猫 イラスト | `public/illustrations/*.png` |

## イラストレーション方針

探偵犬 + メモ猫のキャラクターを画面のキーポイントに置く。画像素材は原則として Codex の `imagegen` skill で生成し、PNG として利用する。初期実装では画像生成を後回しにして、余白・配色・アイコンだけで成立する UI にしてよい。

### キャラクター

- **タンテイ犬 (探偵犬)**: 親役の補佐。虫眼鏡、ハンチング帽。ヘッダーや「キジュンを選ぶ」フェイズに登場。
- **メモ猫**: 子の様子を眺める観察役。手帳とペン。タイマー・調査フェイズに登場。

### 装飾要素

- 星 (`star-burst`)、肉球 (`paw`)、ハート、はてなマークを背景にランダム配置
- 配置は装飾レイヤーとして `pointer-events-none aria-hidden="true"` で背面固定
- 過剰にならないよう、1画面あたり 6〜10 個まで

### 素材形式

- 基本形式: PNG (`public/illustrations/*.png`)
- 生成方法: Codex の `imagegen` skill を使う
- スタイル: 絵本風の線画 + 塗り、線色 `#3D2E1F` に近い濃い茶色、彩度はやや低め
- SVG は lucide-react のアイコン、単純なコード管理装飾、または生成画像より保守しやすい小さな UI 部品に限定する
- 著作: 自作またはライセンスフリー素材のみ。公式 IP の流用は禁止

## レイアウト

### ブレークポイント

| 名前 | 幅 | 想定端末 |
|---|---|---|
| 基本 | < 640px | スマートフォン縦持ち (主ターゲット) |
| `sm` | ≥ 640px | 大型スマートフォン横持ち、小型タブレット縦 |
| `md` | ≥ 768px | タブレット |
| `lg` | ≥ 1024px | ノートPC (デスクトップでも違和感ない最低限) |

モバイルファースト原則: 基本クラスでモバイルレイアウトを書き、`sm:` / `md:` で拡張する。

### グリッド

- 最大幅: `max-w-screen-sm` (640px) を `mx-auto` で中央寄せ
- 画面外周: `px-4` (16px)
- safe-area: `pt-[env(safe-area-inset-top)]` `pb-[env(safe-area-inset-bottom)]` をルートに付ける
- メインカラム: 縦1カラム。`md` 以上でフェイズパネルとヒントカードを2カラム化してもよいが、初期実装では縦1カラムを優先

### 画面骨格

```text
┌─────────────────────────────┐
│ AppHeader                   │  ← メニュー / タイトル / ルール
├─────────────────────────────┤
│ HeroIllustration            │  ← 犬+猫+タイトル+サブコピー
├─────────────────────────────┤
│ PhasePanel                  │  ← 現在のフェイズに応じた中身
│  ├─ PhaseBadge              │
│  ├─ PhaseHeading            │
│  ├─ PhaseDescription        │
│  └─ PrimaryAction           │
├─────────────────────────────┤
│ SecretHintCard (条件付)     │  ← 親だけが見るヒント
├─────────────────────────────┤
│ TimerSettingControl         │  ← タイマー時間の選択
├─────────────────────────────┤
│ FooterMeta                  │  ← バージョン、リンク
└─────────────────────────────┘
```

`md` 以上では `PhasePanel` と `SecretHintCard + TimerSettingControl` を左右に並べてもよい。

## コンポーネント仕様

実装は `src/components/ui/` (汎用) と `src/features/*/components/` (機能固有) に振り分ける。各コンポーネントの責務とプロパティを定義する。

### AppHeader

トップに固定する薄いヘッダー。左にメニュー、中央にタイトル、右にルール。

```tsx
<header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-cream-50/80 backdrop-blur">
  <IconButton icon={<MenuIcon />} label="メニュー" onClick={...} />
  <span className="sr-only">ワードッチ</span>
  <IconButton icon={<HelpCircleIcon />} label="ルール" onClick={...} />
</header>
```

- 高さ: `h-14` (56px)
- 背景: `bg-cream-50/80` + `backdrop-blur` (スクロール時の重なりに対応)
- アイコンボタン: 円形 `rounded-2xl`、`w-12 h-12`、ラベル下付き

### IconButton

アイコン+短いラベルが下に出る大きめのタップターゲット。

```tsx
<button
  type="button"
  className="flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-2xl bg-cream-100 text-ink-900 shadow-[0_2px_6px_rgba(110,80,40,0.08)] active:scale-[0.97] transition"
  aria-label={label}
>
  <Icon className="w-6 h-6" />
  <span className="text-xs font-bold">{label}</span>
</button>
```

### HeroIllustration

タイトル+サブコピー+両脇のキャラクター。

```tsx
<section className="relative px-4 pt-2 pb-4 text-center">
  <DogDetective className="absolute left-2 top-4 w-24 sm:w-28" aria-hidden />
  <CatNotekeeper className="absolute right-2 top-6 w-24 sm:w-28" aria-hidden />
  <h1 className="font-rounded text-4xl sm:text-5xl font-black tracking-tight">
    <span className="text-rose-500">ワ</span>
    <span className="text-sun-400">ー</span>
    <span className="text-leaf-500">ド</span>
    <span className="text-sky-500">ッ</span>
    <span className="text-rose-500">チ</span>
  </h1>
  <p className="mt-2 text-sm text-ink-600">親のための進行サポートツール</p>
</section>
```

- タイトルの一文字ずつに別カラーを当てる。`rose → sun → leaf → sky → rose` の配色
- キャラクター PNG は装飾なので `aria-hidden`
- モバイルで両脇キャラがタイトルに被らないよう、タイトル左右に `px-24` の余白を取る

### PhasePanel

現在のフェイズに応じて中身が差し替わるメインパネル。

```tsx
<section className="rounded-3xl bg-cream-100 px-5 py-6 sm:p-6 shadow-[0_2px_6px_rgba(110,80,40,0.08)]">
  <PhaseIndicator phase={phase} />
  <PhaseBadge>{badgeLabel}</PhaseBadge>
  <h2 className="mt-3 font-rounded text-2xl sm:text-3xl font-extrabold text-ink-900">
    {heading}
  </h2>
  <p className="mt-2 text-sm sm:text-base text-ink-600 leading-relaxed">
    {description}
  </p>
  <div className="mt-5">
    <PrimaryButton>{actionLabel}</PrimaryButton>
  </div>
</section>
```

| Prop | 型 | 説明 |
|---|---|---|
| `phase` | `Phase` | 状態遷移上の現在フェイズ |
| `badgeLabel` | `string` | 「はじめよう！」「キジュンを選ぼう」など |
| `heading` | `string` | パネルの主タイトル |
| `description` | `string` | 親への案内文 |
| `action` | `{ label, onClick }` | 次へ進めるCTA |

### PhaseIndicator

旗アイコン+小さなラベルでフェイズを示すヘッダー要素。

```tsx
<div className="flex items-center gap-2 text-leaf-600">
  <FlagIcon className="w-5 h-5" />
  <span className="text-sm font-bold tracking-wide">現在のフェイズ</span>
</div>
```

### PhaseBadge

黄色のピル状バッジ。

```tsx
<span className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-sun-400 text-ink-900 text-sm font-bold shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]">
  {children}
</span>
```

### PrimaryButton

CTA。深い緑、白いアイコン+ラベル、両脇の三角で「次に進む感」を出す。

```tsx
<button
  type="button"
  className="group flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-leaf-500 hover:bg-leaf-600 active:scale-[0.98] text-white font-rounded text-xl font-bold shadow-[0_6px_16px_rgba(110,80,40,0.12)] transition"
>
  <span className="flex items-center gap-3">
    <PlayIcon className="w-6 h-6" />
    {children}
  </span>
  <ChevronRightIcon className="w-6 h-6 opacity-80 group-hover:translate-x-0.5 transition" />
</button>
```

### SecretButton

親だけが押す秘匿系のサブボタン。`rose-500` のアウトライン。

```tsx
<button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-rose-400 text-rose-500 font-bold bg-rose-100/40 active:scale-[0.98] transition">
  <EyeIcon className="w-4 h-4" />
  キジュンを確認する
</button>
```

長押し or ホールドで開く挙動を `aria-pressed` と `pointerdown` イベントで再現する。

### SecretHintCard

「親だけが見るヒント」を表す、点線ボーダーのカード。画像右側のカードに相当。

```tsx
<aside
  className="rounded-3xl bg-cream-200 border-2 border-dashed border-sun-400 p-5 sm:p-6 shadow-[0_2px_6px_rgba(110,80,40,0.08)]"
  aria-label="親だけが見るヒント"
>
  <header className="flex items-center justify-between">
    <h3 className="font-rounded text-lg font-bold text-ink-900">親だけが見るヒント</h3>
    <EyeOffIcon className="w-5 h-5 text-rose-500" aria-hidden />
  </header>
  <p className="mt-3 text-sm text-ink-600 leading-relaxed">
    ヒミツのキジュンは<br />子どもに見せないでね！
  </p>
  <div className="mt-3 flex items-center justify-center">
    <LockIllustration className="w-20" aria-hidden />
  </div>
</aside>
```

- 点線は `border-dashed border-2`
- 開閉ボタンを付ける場合、内容を `Disclosure` で覆い、初期状態は閉じる
- 子の前で開いたままにならないよう、5秒で自動クローズの挙動を `setTimeout` で用意

### TimerSettingControl

タイマー時間を選ぶピル+ドロップダウン。

```tsx
<button
  type="button"
  aria-haspopup="listbox"
  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-cream-100 text-ink-900 shadow-[0_2px_6px_rgba(110,80,40,0.08)] active:scale-[0.98] transition"
>
  <ClockIcon className="w-6 h-6 text-ink-600" />
  <div className="flex flex-col text-left">
    <span className="text-xs text-ink-600 font-bold">タイマー設定</span>
    <span className="text-lg font-rounded font-bold">{minutes}分</span>
  </div>
  <ChevronDownIcon className="w-5 h-5 text-ink-400 ml-auto" />
</button>
```

選択肢は `3分 / 5分 / 7分 / 10分`。Bottom Sheet スタイルのモーダルで選ばせる。

### TimerDisplay

調査フェイズ中の中央表示。残り時間を巨大数字で。

```tsx
<div className="flex flex-col items-center justify-center py-6">
  <span className="text-xs font-bold text-ink-600 tracking-wide">のこり時間</span>
  <span
    className={cn(
      "mt-1 font-rounded text-6xl sm:text-8xl font-black tabular-nums",
      remainingSec <= 60 ? "text-rose-500 animate-pulse" : "text-ink-900"
    )}
    aria-live="polite"
  >
    {format(remainingSec)}
  </span>
</div>
```

- 1分以下になったら `rose-500` + `animate-pulse`
- 30秒以下になったらバイブレーション (`navigator.vibrate` が利用可能なら)
- 0秒になったら画面全体に薄い `rose` の overlay フラッシュを出す

### Modal / BottomSheet

ルール説明、設定、キジュン候補選択、タイマー設定の確認に使う。

- スマホでは下からせり上がる Bottom Sheet (`translate-y-full → 0`)
- タブレット以上では中央モーダル
- `role="dialog" aria-modal="true"`、`Escape` で閉じる、フォーカストラップを実装
- 背景 overlay: `bg-ink-900/40` + `backdrop-blur-sm`
- 本体: `rounded-t-3xl bg-cream-50 max-h-[85vh] overflow-y-auto`

### WordCard

3ワード提示フェイズで使う、横並びカード。

```tsx
<ol className="grid gap-3 sm:grid-cols-3">
  {words.map((w, i) => (
    <li
      key={w}
      className="rounded-2xl bg-cream-100 px-5 py-6 text-center shadow-[0_2px_6px_rgba(110,80,40,0.08)]"
    >
      <span className="text-xs text-ink-600 font-bold">ワード{i + 1}</span>
      <p className="mt-2 font-rounded text-2xl font-extrabold text-ink-900">{w}</p>
    </li>
  ))}
</ol>
```

子に見せてよい情報なので、配色は cream 系で統一する。`rose` 系は使わない。

### CriterionCandidateCard

ヒミツのキジュン候補を2枚並べ、親に選ばせる。

```tsx
<button
  type="button"
  onClick={() => onPick(candidate)}
  className="w-full rounded-3xl bg-cream-100 border-2 border-border-200 p-5 text-left active:scale-[0.98] transition focus:border-leaf-500 focus:outline-none"
>
  <span className="text-xs font-bold text-rose-500">候補 {index + 1}</span>
  <p className="mt-2 font-rounded text-xl font-extrabold text-ink-900">{candidate.label}</p>
  <p className="mt-2 text-sm text-ink-600">{candidate.hint}</p>
</button>
```

- 親しか見ないので `text-rose-500` の「親専用」シグナルを少量使う
- 選んだ瞬間にもう一枚は `opacity-40` で残し、選択を確認しやすくする

## フェイズ別画面設計

`Round.phase` の状態ごとに `PhasePanel` の内容を差し替える。各フェイズで何を見せるかを表で固定する。

### `idle` / `setup` — はじめよう！ (画像と同じ初期状態)

| 要素 | 内容 |
|---|---|
| バッジ | 「はじめよう！」(`bg-sun-400`) |
| 見出し | 「新しいラウンドをはじめる」 |
| 説明 | 「2つのヒミツのキジュンを選び、3つのワードを子どもたちに伝えてワードッチを楽しみましょう！」 |
| 主CTA | 「▶ 新しくはじめる」(緑) |
| 副要素 | SecretHintCard (まだヒミツが未確定なので、説明だけ表示) / TimerSettingControl |

### `secretSelection` — キジュンを選ぼう

| 要素 | 内容 |
|---|---|
| バッジ | 「ステップ1」 |
| 見出し | 「ヒミツのキジュンを選ぼう」 |
| 説明 | 「2つの候補から、今回のヒミツのキジュンを1つだけ選んでね。選ばないほうは伏せたままにします。」 |
| 中身 | `CriterionCandidateCard` ×2 を縦並び |
| SecretHintCard | 「これは親だけが見るカードだよ」+ 子に見せないリマインド |

### `wordPrompt` — 3ワードを子に伝える

| 要素 | 内容 |
|---|---|
| バッジ | 「ステップ2」 |
| 見出し | 「3つのワードを子に伝えよう」 |
| 説明 | 「下の3つのワードを口に出して伝えてください。子どもたちは、ヒミツのキジュンに一番近そうなワードを話し合います。」 |
| 中身 | `WordCard` ×3 |
| 主CTA | 「タイマーを開始する」 |

### `timedInvestigation` — 調査フェイズ

| 要素 | 内容 |
|---|---|
| バッジ | 「調査中」 (`bg-leaf-100 text-leaf-600`) |
| 見出し | 「のこり時間で話し合おう」 |
| 中身 | `TimerDisplay` + `CountdownControls` (開始/一時停止/再開/リセット) |
| 副CTA | 「ヒミツのキジュンをこっそり確認」(`SecretButton`) |
| SecretHintCard | 親だけが見るキジュン本文 (`Disclosure` で覆う) |

### `finalGuide` — 決選フェイズの案内

| 要素 | 内容 |
|---|---|
| バッジ | 「決選フェイズ」 (`bg-rose-100 text-rose-500`) |
| 見出し | 「最後のワードを考えてもらおう」 |
| 説明 | 「ここからは、子どもたちにそれぞれ最後のワードを1つ考えてもらいます。出そろったら、親がキジュンに一番合うワードを選びましょう。」 |
| 主CTA | 「キジュンを公開する」 |

### `reveal` — キジュン公開

| 要素 | 内容 |
|---|---|
| バッジ | 「正解はこちら！」 |
| 見出し | キジュン本文 (大きく表示) |
| 中身 | 提示した3ワード、タイマー時間、ラウンド時刻 |
| 主CTA | 「もう一度遊ぶ」 |
| 副CTA | 「終わる」 |

### `done` — ラウンド終了

`reveal` と同じレイアウトを使いまわすが、副情報として「次のおすすめ時間」「ヒント集」などを置ける拡張領域を残す。

## 状態と表現の対応表

| 状態 | バッジ色 | 見出し色 | アクセント |
|---|---|---|---|
| `idle` / `setup` | sun (黄) | ink-900 | leaf (緑) |
| `secretSelection` | rose-100 (薄ピンク) | rose-500 | rose |
| `wordPrompt` | sky-500 (青) | ink-900 | sky |
| `timedInvestigation` | leaf-100 (薄緑) | ink-900 (60秒以下で rose-500) | leaf |
| `finalGuide` | rose-100 | rose-500 | rose |
| `reveal` | sun-400 | ink-900 | sun |
| `done` | leaf-100 | ink-900 | leaf |

色だけで状態を区別しないように、必ずバッジテキスト+アイコンを併記する (アクセシビリティ)。

## モーダル設計

### ルール説明モーダル (`activeModal: "rules"`)

- ヘッダー: 「あそびかた」+ 閉じるボタン (右上)
- 本文構成: 「ワードッチとは」「親の役割」「進行の流れ」「子へのコツ」をアコーディオン
- フッター: 「とじる」(`PrimaryButton` の幅100%)

### 設定モーダル (`activeModal: "settings"`)

- 既定タイマー時間 (Segmented control)
- データは独自サンプル固定で扱う。初期実装では手入力モードを置かない
- 「保存データを初期化する」(危険ボタン: `text-danger-500`)

### キジュン確認モーダル (`activeModal: "secret"`)

- 親が長押し中だけ表示する。指を離すと閉じる
- 中身は大きく `text-3xl font-extrabold text-rose-500` でキジュン本文
- 周囲を `bg-ink-900/70` で覆い、画面外漏れを避ける

## アクセシビリティ

- **キーボード操作**: すべてのインタラクティブ要素は Tab で到達できる。フォーカスリングは `focus-visible:ring-4 focus-visible:ring-leaf-500/40` を必ず付ける。
- **タップターゲット**: 主要ボタンは 48×48px 以上。`IconButton` も 56×56px を最低保証。
- **コントラスト**: `text-ink-900` on `cream-50` で 12:1。`text-rose-500` on `rose-100` は 4.5:1 を満たすか定期検証。
- **スクリーンリーダー**: 装飾イラストは `aria-hidden="true"`。タイマーは `aria-live="polite"`。フェイズ変更時はパネルの見出しに `tabIndex={-1}` + `focus()` でフォーカスを移す。
- **動きの抑制**: `prefers-reduced-motion: reduce` の場合、`animate-pulse` と `transition` を `motion-reduce:` プレフィックスで切る。
- **配色だけに依存しない**: 状態はアイコン+ラベル+色の3点で表す。
- **言語**: `<html lang="ja">` を必ず指定する。

## レスポンシブ仕様

| 幅 | ヘッダー | キャラクターサイズ | パネル並び | タイマー数字 |
|---|---|---|---|---|
| < 360px | 高さ 52px | `w-20` | 縦1列 | `text-5xl` |
| 360–640px | 高さ 56px | `w-24` | 縦1列 | `text-6xl` |
| 640–1024px | 高さ 60px | `w-28` | 縦1列 (任意で2列) | `text-7xl` |
| ≥ 1024px | 高さ 60px | `w-32` | 2列レイアウト | `text-8xl` |

### 横持ち時

- ヘッダーを `sticky` のままにする
- フェイズパネル+SecretHintCard を 2 カラム化
- タイマー画面は中央寄せの単独表示にし、左右に余白を多く取る

## Tailwind 実装ガイド

### `tailwind.config.ts` カスタム

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFF8E7",
          100: "#FFFBF0",
          200: "#FFF1D6",
        },
        ink: {
          400: "#B6A28A",
          600: "#7A6450",
          900: "#3D2E1F",
        },
        leaf: {
          100: "#E3F2DA",
          500: "#5BA84A",
          600: "#4A8E3B",
        },
        sun: {
          100: "#FFF2CC",
          400: "#FFCB47",
        },
        rose: {
          100: "#FBE3E0",
          400: "#EB8B85",
          500: "#E36B6B",
        },
        sky: {
          500: "#6BB8DB",
        },
        border: {
          200: "#F0E2C8",
        },
        danger: {
          500: "#E0635A",
        },
      },
      fontFamily: {
        rounded: ["var(--font-rounded)", "system-ui", "sans-serif"],
        noto: ["var(--font-noto)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 6px rgba(110,80,40,0.08)",
        cta: "0 6px 16px rgba(110,80,40,0.12)",
        float: "0 12px 28px rgba(110,80,40,0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
} satisfies Config;
```

カスタム影は `shadow-card` / `shadow-cta` / `shadow-float` として参照する。

### グローバル CSS (`src/app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply text-ink-900 font-noto antialiased;
    background: theme(colors.cream.50);
  }

  body {
    @apply min-h-screen;
    background-image:
      radial-gradient(circle at 12% 18%, rgba(255, 203, 71, 0.18) 0, transparent 38%),
      radial-gradient(circle at 88% 12%, rgba(227, 107, 107, 0.12) 0, transparent 36%),
      radial-gradient(circle at 50% 102%, rgba(91, 168, 74, 0.10) 0, transparent 40%);
  }

  :focus-visible {
    @apply outline-none ring-4 ring-leaf-500/40 rounded-2xl;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

背景はベタ塗りではなく、3色の薄いラジアルグラデーションを重ねて絵本らしい雰囲気を作る。

### クラスの組み立て規約

- 長い className は `clsx` (または `cn` ヘルパー) で分割する
- バリアントが3つ以上になるコンポーネントは `class-variance-authority` (cva) を使う
- 例:

```ts
import { cva } from "class-variance-authority";

export const button = cva(
  "inline-flex items-center justify-center font-rounded font-bold rounded-2xl transition active:scale-[0.98]",
  {
    variants: {
      intent: {
        primary: "bg-leaf-500 hover:bg-leaf-600 text-white shadow-cta",
        secondary: "bg-cream-100 text-ink-900 shadow-card",
        ghost: "bg-transparent text-ink-900 hover:bg-cream-100",
        danger: "bg-rose-100 text-danger-500 border-2 border-dashed border-rose-400",
      },
      size: {
        md: "px-5 py-3 text-base",
        lg: "px-6 py-4 text-xl",
      },
    },
    defaultVariants: { intent: "primary", size: "lg" },
  },
);
```

## アセット要件

| アセット | パス | サイズ | 形式 |
|---|---|---|---|
| 犬探偵キャラ | `public/illustrations/dog-detective.png` | 512×512 目安 | PNG |
| 猫メモキャラ | `public/illustrations/cat-notekeeper.png` | 512×512 目安 | PNG |
| 鍵イラスト (秘匿) | `public/illustrations/lock-secret.png` | 512×512 目安 | PNG |
| 装飾 (星・ハート・はてな) | `public/illustrations/decor-*.png` | 256×256 目安 | PNG |
| PWA アイコン | `public/icons/icon-{192,512}.png`, `maskable-512.png` | 仕様通り | PNG |
| OG 画像 | `public/og-image.png` | 1200×630 | PNG |

イラストは `imagegen` skill で後から生成して追加する。初期実装では未配置でもよく、その場合はタイトル・アイコン・余白でデザインを成立させる。生成時は線色 `#3D2E1F` に近い濃い茶色、塗り色はパレットから選ぶ。

## 命名規約

- ファイル: コンポーネントは PascalCase (`PhasePanel.tsx`)、関数モジュールは kebab-case (`round-reducer.ts`)
- CSS クラス: Tailwind 標準。カスタムは付けない
- 色トークン: パレット名で参照 (`text-ink-900`)。直接 hex を書かない
- アイコンコンポーネント: `XxxIcon` (例: `FlagIcon`)
- イラスト表示コンポーネント: `XxxImage` または `XxxIllustration` (例: `SecretLockImage`)
- バリアント: `intent` / `size` / `tone` の3軸を超えないように設計する

## デザインの検証チェックリスト

実装完了時、以下を確認する。

- [ ] iPhone SE (375×667) と Pixel 7 (412×915) で主要画面が縦スクロールで完結する
- [ ] 横持ち時にレイアウト破綻がない
- [ ] 親の主要操作 (新しくはじめる / キジュン選択 / タイマー操作 / 公開) が3タップ以内で到達できる
- [ ] 子に見せたくないテキスト (`text-rose-500` を含むエリア) は折りたたみ可能で、初期状態が閉じている (キジュン公開フェイズを除く)
- [ ] フォーカスリングが見える
- [ ] `prefers-reduced-motion: reduce` でアニメーションが止まる
- [ ] Lighthouse Accessibility ≥ 95
- [ ] ダーク背景の OS でも視認性が崩れない (本アプリはダークモードを提供しないため、`color-scheme: light` を `<html>` に指定)
- [ ] Service Worker キャッシュ後にオフラインで開いてもフォントが代替表示に落ちる程度で読める

## 将来拡張のための余地

- ダークモードは初期スコープ外。`color-scheme: light` を明示する
- 多言語化を想定するなら、ピル/バッジは最大文字数 8 文字以内に揃えておく
- 効果音は初期スコープ外。将来入れる場合はユーザー操作後の再生許可、音量設定、ミュート導線、素材ライセンスを別途設計する
- 親が複数の子ども端末と同期する機能を将来追加する場合でも、ヒミツのキジュンを表示するエリアは「親端末専用」のスタイル (rose系点線) を継続する

## 採用しないデザイン

- マテリアルデザインの濃いシャドウ、フラットの単色背景
- 派手なグラデーションを大面積に当てる演出
- 黒いストロークアウトラインの強い「アニメ調」イラスト (絵本らしさを損なう)
- 全画面背景画像 (オフライン時の表示劣化と読み込みコストを避ける)
- カスタム CSS フレームワーク / UI ライブラリ
- ダークモード / ハイコントラストモードの個別実装 (初期スコープ外)
