# ワードッチ UI/UX デザイン設計書

最終更新日: 2026-05-25  
対象: ワードッチ親向け進行補助ツール (Next.js / Tailwind CSS / PWA / GitHub Pages)  
関連: [system-requirements-design.md](./system-requirements-design.md) / [nextjs-folder-structure-design.md](./nextjs-folder-structure-design.md) / [wordocchi-rule-definition.md](./wordocchi-rule-definition.md)

## 目的

このドキュメントは、ワードッチ親向け進行補助ツールのビジュアルデザインと UX を、実装可能な粒度で定義する。Tailwind CSS のユーティリティクラスを基本に、アニメーションは Framer Motion、アクセシブルなインタラクションは Radix UI のプリミティブを使う。

実装担当者がこのドキュメントを読むだけで、Figma カンプを別途用意せずに UI を組み立てられることをゴールとする。

## デザインコンセプト

> 「親がやさしい司会者になれる、絵本のような進行カード」

- **対象ユーザー**: 家族・友人と遊ぶ親プレイヤー (6歳以上の子と一緒)
- **シーン**: 食卓・リビング・カフェなどで片手でスマホを持って操作する
- **キーワード**: あたたかい / 親しみやすい / 子どもにも見せられる / 大人も恥ずかしくない / 視認性が高い

### 3つのデザイン原則

1. **やさしいトーン** — 食卓に置いても浮かない、絵本のような色とフォルム。鋭角・原色・無機質なグレースケールを避ける。
2. **役割が一目でわかる** — 「親だけが見る情報」と「子に見せていい情報」を、配色とアイコンで明確に区別する。
3. **迷子にならない** — 今どこにいるか(ステッパー)・次に何をするか(主CTA)・いつでも戻れるか(常設の「新しくはじめる」)、この3つを画面から外さない。

## UX 設計の柱

このアプリは「親が片手で操作しながら、子の前で会話を回す」という特殊な状況で使われる。以下の4つを常に画面に同居させる。

| 柱 | 実体 | 配置 |
|---|---|---|
| 1. 進行の見える化 | `PhaseStepper` (パンくず兼ステッパー) | 画面上部、ヘッダー直下に固定 |
| 2. 次にすべきこと | `PrimaryAction` (主CTA) | フェイズパネル内とフッターバー |
| 3. 緊急脱出口 | 「新しくはじめる」 | フッターバーに常設、進行中は確認ダイアログ |
| 4. タイマーの中断 | 「終了」「一時停止」「再開」 | タイマー画面のコントロールに常設 |

## 技術選定 (ライブラリ)

Tailwind CSS のユーティリティだけで完結する部分と、アクセシビリティ・アニメーション品質のためにライブラリを使う部分を明確に分ける。

| ライブラリ | 用途 | 採用理由 |
|---|---|---|
| **Tailwind CSS** | スタイル全般 | 静的エクスポートと相性がよい。CSS Modules/CSS-in-JS を排除できる |
| **Radix UI** (`@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-popover`) | モーダル / Tab / ツールチップ / ポップオーバー | フォーカストラップ・ARIA 属性・キーボード操作が標準で備わる。スタイルは Tailwind で当てる |
| **Framer Motion** (`motion/react`) | 画面遷移・モーダル・ステッパーのアニメーション | `AnimatePresence` で マウント/アンマウント時のアニメが書きやすい。`prefers-reduced-motion` を尊重 |
| **Embla Carousel** (`embla-carousel-react`) | ルール説明モーダル内のステップ送り | スワイプ・キーボード・ドット表示に対応、軽量で SSR と相性◎ |
| **lucide-react** | アイコン全般 | 線が丸く、絵本トーンに合う。Tree-shaking 可 |
| **class-variance-authority** (`cva`) | コンポーネントのバリアント管理 | Tailwind の長い className を整理 |
| **clsx** | 条件付き className | `cva` と併用 |

採用しないもの:

- shadcn/ui — 個別 Radix を直接使う方が依存が薄く、デザインを丸ごとカスタムしやすい
- Bootstrap、Material UI、Chakra UI — Tailwind 単独でデザインを決める方針と衝突する
- GSAP、anime.js — Framer Motion で十分。複数アニメライブラリの並存を避ける

### バンドルサイズの目安

| ライブラリ | minified+gz |
|---|---|
| Radix Dialog | ~6 KB |
| Framer Motion (使用機能のみ) | ~25 KB |
| Embla Carousel | ~5 KB |
| lucide-react (使うアイコンのみ) | ~3-5 KB |

合計でも 50 KB 程度に収まる。GitHub Pages の静的配信でも十分軽い。

## デザイントークン

### カラーパレット

クリーム系のあたたかい背景に、緑のメインアクションと、絵本的なアクセントカラーを重ねる。

| 用途 | 名前 | Hex |
|---|---|---|
| 背景 (ベース) | `cream-50` | `#FFF8E7` |
| 背景 (カード) | `cream-100` | `#FFFBF0` |
| 背景 (アクセントカード) | `cream-200` | `#FFF1D6` |
| 主要テキスト | `ink-900` | `#3D2E1F` |
| 副次テキスト | `ink-600` | `#7A6450` |
| 補助テキスト | `ink-400` | `#B6A28A` |
| プライマリ (実行) | `leaf-500` | `#5BA84A` |
| プライマリ濃 | `leaf-600` | `#4A8E3B` |
| プライマリ淡 | `leaf-100` | `#E3F2DA` |
| バッジ (注意) | `sun-400` | `#FFCB47` |
| バッジ淡 | `sun-100` | `#FFF2CC` |
| 親専用 (秘匿) | `rose-500` | `#E36B6B` |
| 親専用 淡 | `rose-100` | `#FBE3E0` |
| 情報 (子向け) | `sky-500` | `#6BB8DB` |
| 区切り | `border-200` | `#F0E2C8` |
| 危険 | `danger-500` | `#E0635A` |

#### セマンティックロール

| ロール | トークン |
|---|---|
| `surface-base` | `cream-50` (画面全体) |
| `surface-card` | `cream-100` (フェイズパネル、設定カード) |
| `surface-secret` | `rose-100` + `border-dashed border-rose-400` (親だけが見るヒント) |
| `action-primary` | `leaf-500` (主CTA) |
| `action-secondary` | `cream-200` + `text-ink-900` (副ボタン) |
| `action-destructive` | `danger-500` (新しくはじめる確認、終了ボタン) |
| `phase-active` | `sun-400` (ステッパー現在地) |
| `phase-done` | `leaf-500` (ステッパー完了済み) |
| `phase-todo` | `border-200` (ステッパー未着手) |

### タイポグラフィ

日本語の可読性を優先し、丸ゴシック系を中心に組む。

| ロール | フォント | サイズ (mobile / ≥sm) | ウェイト | 行間 |
|---|---|---|---|---|
| アプリタイトル | `M PLUS Rounded 1c` | `text-4xl` / `text-5xl` | 900 | `leading-tight` |
| 画面見出し | `M PLUS Rounded 1c` | `text-2xl` / `text-3xl` | 800 | `leading-snug` |
| カード見出し | `M PLUS Rounded 1c` | `text-lg` / `text-xl` | 700 | `leading-snug` |
| 本文 | `Noto Sans JP` | `text-base` | 500 | `leading-relaxed` |
| 補助テキスト | `Noto Sans JP` | `text-sm` | 400 | `leading-relaxed` |
| ボタンラベル | `M PLUS Rounded 1c` | `text-lg` / `text-xl` | 700 | `leading-none` |
| タイマー数字 | `M PLUS Rounded 1c` | `text-6xl` / `text-8xl` | 900 | `leading-none tabular-nums` |
| バッジ | `M PLUS Rounded 1c` | `text-xs` / `text-sm` | 700 | `leading-none` |
| ステッパーラベル | `M PLUS Rounded 1c` | `text-xs` | 700 | `leading-none` |

### スペーシング

| 用途 | クラス | px |
|---|---|---|
| カード内余白 (mobile) | `p-5` | 20 |
| カード内余白 (≥sm) | `sm:p-6` | 24 |
| カード間ギャップ | `gap-4` | 16 |
| セクション間 | `space-y-5` | 20 |
| 画面外周 | `px-4` | 16 |
| 固定ヘッダー高 | `h-14` | 56 |
| 固定フッター高 | `h-20` | 80 |
| ステッパー高 | `h-14` | 56 |

### 角丸

| 用途 | クラス |
|---|---|
| 大型カード | `rounded-3xl` (24px) |
| 内側パネル / ボタン | `rounded-2xl` (16px) |
| ピル / ステッパーノード / バッジ | `rounded-full` |
| 入力 | `rounded-xl` (12px) |

### エレベーション

| レベル | クラス | 用途 |
|---|---|---|
| `shadow-card` | `0 2px 6px rgba(110,80,40,0.08)` | 通常カード |
| `shadow-cta` | `0 6px 16px rgba(110,80,40,0.12)` | 主CTA |
| `shadow-float` | `0 12px 28px rgba(110,80,40,0.18)` | モーダル本体 |
| `shadow-bar` | `0 -4px 12px rgba(110,80,40,0.10)` | 固定フッター(上方向) |

### モーション

Framer Motion を使う。ユーザーが `prefers-reduced-motion: reduce` を設定している場合、`useReducedMotion()` で動きを 0 にする。

| 動き | 持続 | イージング | 使用箇所 |
|---|---|---|---|
| ボタン押下 | 100ms | `ease-out` + `whileTap={{ scale: 0.97 }}` | すべてのボタン |
| フェイズ切替 | 350ms | `easeOut` | パネルの fade + slide (y: 8 → 0) |
| ステッパー進行 | 400ms | `[0.22, 1, 0.36, 1]` (easeOutQuint) | ノードの色・スケール変化 |
| モーダルオーバーレイ | 200ms | `ease-out` | opacity 0 → 1 |
| モーダル本体 (mobile) | 350ms | `[0.32, 0.72, 0, 1]` | y: 100% → 0 (Bottom Sheet) |
| モーダル本体 (≥md) | 250ms | `ease-out` | scale 0.96 → 1 + fade |
| カルーセル | Embla 標準 | `ease-out` | スライド |
| タイマー警告 | 1s × 無限 | `ease-in-out` | `animate-pulse` (60秒以下) |

## 画面骨格

全画面で「ヘッダー / ステッパー / メイン / フッターバー」の4段構成を維持する。これにより、どのフェイズでも常に進行と主要アクションが見える。

```text
┌─────────────────────────────────────┐
│ AppHeader (sticky, h-14)            │
│   [☰メニュー]   [ワードッチ]   [?ルール] │
├─────────────────────────────────────┤
│ PhaseStepper (sticky, h-14)         │
│   ① 準備 → ② キジュン → ③ ワード        │
│   → ④ 調査 → ⑤ 決選 → ⑥ 公開           │
├─────────────────────────────────────┤
│ Main (scrollable)                   │
│   ┌─────────────────────────────┐   │
│   │ HeroIllustration            │   │
│   │   犬 + 猫 + タイトル          │   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │ PhasePanel                  │   │
│   │   バッジ / 見出し / 説明 / CTA  │   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │ SecretHintCard (任意)        │   │
│   └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ FooterBar (sticky bottom, h-20)     │
│  [↺ 新しくはじめる]  [▶ 主CTA / 次へ]  │
└─────────────────────────────────────┘
```

スクロールは Main 領域だけ。ヘッダー・ステッパー・フッターは画面に固定する。safe-area を考慮する。

## 永続コンポーネント

### AppHeader

```tsx
<header className="sticky top-0 z-40 flex items-center justify-between h-14 px-3 bg-cream-50/90 backdrop-blur-md border-b border-border-200/60">
  <IconButton icon={<MenuIcon />} label="メニュー" />
  <h1 className="font-rounded text-lg font-extrabold tracking-wide text-ink-900">ワードッチ</h1>
  <IconButton icon={<HelpCircleIcon />} label="ルール" />
</header>
```

タイトルは画像のようなカラフル表示にせず、ヘッダーではモノクロのコンパクト表示。カラフルなタイトルは `HeroIllustration` でのみ使う(視覚的な役割を分ける)。

### PhaseStepper (パンくず兼ステッパー)

進行を可視化する。6つのノードを左から並べ、現在地・完了済み・未着手を3色で塗り分ける。

```tsx
<nav
  aria-label="進行ステップ"
  className="sticky top-14 z-30 h-14 px-3 bg-cream-50/85 backdrop-blur-md border-b border-border-200/60"
>
  <ol className="flex h-full items-center gap-1 overflow-x-auto scrollbar-none">
    {steps.map((step, i) => (
      <li key={step.id} className="flex items-center gap-1 shrink-0">
        <StepNode
          index={i + 1}
          label={step.label}
          state={step.state /* "done" | "active" | "todo" */}
        />
        {i < steps.length - 1 && <StepConnector state={steps[i + 1].state} />}
      </li>
    ))}
  </ol>
</nav>
```

`StepNode` の見た目:

| state | サークル | ラベル | アニメ |
|---|---|---|---|
| `done` | `bg-leaf-500 text-white` + ✓ アイコン | `text-leaf-600` | なし |
| `active` | `bg-sun-400 text-ink-900` + 数字 + ring (`ring-4 ring-sun-400/30`) | `text-ink-900 font-extrabold` | Framer Motion で `scale 0.9 → 1.05 → 1` のポップ |
| `todo` | `bg-cream-100 text-ink-400 border-2 border-border-200` + 数字 | `text-ink-400` | なし |

`StepConnector` は `h-0.5 w-6` の線。`done` なら `bg-leaf-500`、それ以外は `bg-border-200`。

ステップ定義 (6つ):

| # | id | label (短縮) | label (full) |
|---|---|---|---|
| 1 | `setup` | 準備 | 新しいラウンドを準備する |
| 2 | `secretSelection` | キジュン | ヒミツのキジュンを選ぶ |
| 3 | `wordPrompt` | ワード | 3つのワードを伝える |
| 4 | `timedInvestigation` | 調査 | タイマーで話し合う |
| 5 | `finalGuide` | 決選 | 最後のワードを選ぶ |
| 6 | `reveal` | 公開 | キジュンを公開する |

#### 横スクロールの挙動

モバイル幅では6ノードは横スクロールが必要。現在のノードを常に画面中央付近に置くため、`activeStep` が変わったら `scrollIntoView({ inline: "center", behavior: "smooth" })` を呼ぶ。

#### タップ挙動

- `done` (済): タップで前のフェイズに戻れる。確認ダイアログ「進行中のラウンドの内容は保持しつつ戻りますか?」を出す
- `active` (現在): タップ無効
- `todo` (未着手): タップでツールチップ「先にこの前のステップを完了させてください」

### FooterBar

画面下部に固定するアクションバー。左に「新しくはじめる」、右に主CTA。フェイズに応じて主CTAの中身が変わるが、左の「新しくはじめる」は常設。

```tsx
<footer
  className="sticky bottom-0 z-40 h-20 px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]
             bg-cream-50/95 backdrop-blur-md border-t border-border-200/60 shadow-bar"
>
  <div className="flex items-center gap-3 h-full">
    <RestartButton />            {/* 常設 */}
    <PrimaryAction phase={phase} /> {/* フェイズ依存 */}
  </div>
</footer>
```

#### RestartButton (常設「新しくはじめる」)

```tsx
<button
  className="flex flex-col items-center justify-center h-14 px-4 rounded-2xl bg-cream-100 text-ink-900 shadow-card active:scale-[0.97] transition"
>
  <RotateCcwIcon className="w-5 h-5 text-rose-500" />
  <span className="text-xs font-rounded font-bold mt-0.5">新しく<br />はじめる</span>
</button>
```

挙動:

- `phase === "setup"` の場合: ワンタップで初期化
- `phase` がそれ以外の場合: Radix Dialog で確認「今のラウンドを終わって、新しくはじめますか?」 → 「はじめる」(`danger-500` 系) / 「やめる」(secondary)

#### PrimaryAction

フェイズに応じて中身が切り替わる、画面右側の主CTA。`flex-1` で残りの幅を占有する。

| phase | ラベル | アイコン | onClick |
|---|---|---|---|
| `setup` | はじめる | `▶ PlayIcon` | `dispatch({ type: "START" })` |
| `secretSelection` | (パネル内のカード選択で進む) | — | 主CTAは「キジュンを選ばずに次へ」を出さず、CTA枠は無効化 + 案内テキスト |
| `wordPrompt` | タイマー開始 | `ClockIcon` | `dispatch({ type: "START_TIMER" })` |
| `timedInvestigation` | 決選へ進む | `FastForwardIcon` | 確認ダイアログ後に `dispatch({ type: "GO_FINAL" })` |
| `finalGuide` | キジュンを公開 | `EyeIcon` | `dispatch({ type: "REVEAL" })` |
| `reveal` | もう一度遊ぶ | `RefreshCwIcon` | `dispatch({ type: "RESTART" })` |

```tsx
<button
  className="flex-1 flex items-center justify-between h-14 px-5 rounded-2xl bg-leaf-500 hover:bg-leaf-600 active:scale-[0.98] text-white font-rounded text-lg font-bold shadow-cta transition disabled:bg-cream-200 disabled:text-ink-400 disabled:shadow-none"
>
  <span className="flex items-center gap-2">
    <Icon className="w-5 h-5" />
    {label}
  </span>
  <ChevronRightIcon className="w-5 h-5 opacity-80" />
</button>
```

無効状態 (例: キジュン未選択時) は `disabled` + cream の薄いグレーで、押せないことを明示する。

## メインエリアのコンポーネント

### HeroIllustration

```tsx
<section className="relative pt-3 pb-4 text-center">
  <DogDetective className="absolute left-1 top-3 w-20 sm:w-24" aria-hidden />
  <CatNotekeeper className="absolute right-1 top-3 w-20 sm:w-24" aria-hidden />
  <h2 aria-label="ワードッチ" className="font-rounded text-4xl sm:text-5xl font-black tracking-tight px-24">
    <span className="text-rose-500">ワ</span>
    <span className="text-sun-400">ー</span>
    <span className="text-leaf-500">ド</span>
    <span className="text-sky-500">ッ</span>
    <span className="text-rose-500">チ</span>
  </h2>
  <p className="mt-1 text-sm text-ink-600">親のための進行サポートツール</p>
</section>
```

このセクションは `setup` フェイズだけ大きく表示し、他のフェイズではコンパクト版 (キャラなし、`text-2xl`) に切り替える。

### PhasePanel

```tsx
<section className="rounded-3xl bg-cream-100 px-5 py-6 sm:p-6 shadow-card">
  <PhaseBadge tone={tone}>{badgeLabel}</PhaseBadge>
  <h3 className="mt-3 font-rounded text-2xl sm:text-3xl font-extrabold text-ink-900">
    {heading}
  </h3>
  <p className="mt-2 text-sm sm:text-base text-ink-600 leading-relaxed">
    {description}
  </p>
  {children /* フェイズ固有の中身 */}
</section>
```

`AnimatePresence` で囲み、`phase` が変わるたびに fade + slide で差し替える。

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={phase}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
  >
    <PhasePanel ... />
  </motion.div>
</AnimatePresence>
```

### PhaseBadge

`tone` プロパティで色を変える。

| tone | 背景 | 文字色 |
|---|---|---|
| `start` | `bg-sun-400` | `text-ink-900` |
| `secret` | `bg-rose-100` | `text-rose-500` |
| `info` | `bg-sky-500` | `text-white` |
| `live` | `bg-leaf-500` | `text-white` (`animate-pulse` 可) |
| `done` | `bg-leaf-100` | `text-leaf-600` |

### SecretHintCard

```tsx
<aside
  className="rounded-3xl bg-cream-200 border-2 border-dashed border-sun-400 p-5 sm:p-6 shadow-card"
  aria-label="親だけが見るヒント"
>
  <header className="flex items-center justify-between">
    <h4 className="font-rounded text-lg font-bold text-ink-900">親だけが見るヒント</h4>
    <EyeOffIcon className="w-5 h-5 text-rose-500" aria-hidden />
  </header>
  <p className="mt-3 text-sm text-ink-600 leading-relaxed">
    ヒミツのキジュンは<br />子どもに見せないでね！
  </p>
</aside>
```

フェイズが `secretSelection` 以降になると、中身が「実際のヒミツのキジュン本文」を `Disclosure` (Radix の `Collapsible`) で隠す形に変わる。

### CountdownControls (タイマー画面)

タイマー中は「一時停止 / 再開」「リセット」「終了」の3つを表示する。**「終了」は調査フェイズを途中で打ち切るための重要なボタン。**

```tsx
<div className="grid grid-cols-3 gap-2 mt-4">
  <TimerControlButton
    intent="secondary"
    icon={isRunning ? <PauseIcon /> : <PlayIcon />}
    label={isRunning ? "一時停止" : "再開"}
    onClick={togglePause}
  />
  <TimerControlButton
    intent="secondary"
    icon={<RotateCcwIcon />}
    label="リセット"
    onClick={confirmReset}
  />
  <TimerControlButton
    intent="danger"
    icon={<StopCircleIcon />}
    label="終了"
    onClick={confirmEnd}
  />
</div>
```

`TimerControlButton` (intent="danger") のスタイル:

```tsx
className="flex flex-col items-center justify-center h-16 rounded-2xl bg-rose-100 text-danger-500 border-2 border-dashed border-rose-400 font-rounded font-bold active:scale-[0.98] transition"
```

「終了」をタップすると、Radix Dialog で確認:

> タイマーを終了して、決選フェイズへ進みますか?  
> [やめる] [終了して進む]

「終了して進む」を選ぶと、`dispatch({ type: "GO_FINAL" })` で `finalGuide` フェイズへ遷移。

### TimerDisplay

```tsx
<div className="flex flex-col items-center justify-center py-6">
  <span className="text-xs font-bold text-ink-600 tracking-wide">のこり時間</span>
  <motion.span
    className={cn(
      "mt-1 font-rounded text-6xl sm:text-8xl font-black tabular-nums",
      remainingSec <= 60 ? "text-rose-500" : "text-ink-900"
    )}
    animate={remainingSec <= 60 ? { scale: [1, 1.04, 1] } : {}}
    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    aria-live="polite"
  >
    {format(remainingSec)}
  </motion.span>
</div>
```

## ルールモーダル — ステップ式カルーセル

画像の絵本トーンに合わせ、ルール説明は「1ステップ1ページの絵本めくり」スタイルにする。Radix Dialog + Embla Carousel + Framer Motion を組み合わせる。

### 構成

```text
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │ ← 半透明オーバーレイ (タップで閉じる)
│  │ ✕   あそびかた           1/5  │   │ ← ヘッダー (閉じる / タイトル / 進捗)
│  ├─────────────────────────────┤    │
│  │                             │    │
│  │   [大きな絵本のような絵]      │    │ ← イラスト (各ステップ固有)
│  │                             │    │
│  │   ステップ見出し              │    │
│  │   本文 (2-3行)                │    │
│  │                             │    │
│  ├─────────────────────────────┤    │
│  │ ● ○ ○ ○ ○                   │    │ ← ドットインジケーター
│  ├─────────────────────────────┤    │
│  │ [もどる]      [つぎへ →]      │    │ ← フッター (左右ナビゲート)
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 5ステップ構成

| # | 見出し | 本文 (要約) | イラスト |
|---|---|---|---|
| 1 | ワードッチってどんなあそび? | 親だけが知る「キジュン」を、子どもたちが3つのワードから当てに行く会話あそび。 | 犬探偵+猫メモ+ワード3枚 |
| 2 | 親のやくわり | キジュンを選ぶ。3つのワードを声に出して伝える。子の話し合いを聞く。 | 親キャラ + 吹き出し |
| 3 | キジュンを2つから選ぼう | 2つの候補から、今回のヒミツのキジュンを1つ選ぶ。選ばなかったほうは伏せておく。 | 鍵 + 2枚のカード |
| 4 | タイマーで話し合おう | 3-10分のあいだ、子どもたちが3つのワードから1つを話し合いで選ぶ。 | 時計 + 話し合う子の絵 |
| 5 | キジュンを公開して感想戦 | タイマーが終わったら、親はキジュンを公開して、みんなで感想を話す。 | 開いた扉 + ✨ |

### モーダル本体の動き

#### モバイル (< md)

Bottom Sheet として下からせり上がる。

```tsx
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Portal>
    <Dialog.Overlay asChild>
      <motion.div
        className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    </Dialog.Overlay>
    <Dialog.Content asChild>
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-cream-50 max-h-[88vh] flex flex-col shadow-float"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      >
        <RulesCarousel onClose={() => setOpen(false)} />
      </motion.div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

#### タブレット以上 (≥ md)

中央に scale + fade で出す。最大幅 `max-w-md`。

```tsx
<motion.div
  className="fixed inset-0 z-50 flex items-center justify-center p-6"
  initial={{ opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.96 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
>
  <div className="w-full max-w-md rounded-3xl bg-cream-50 shadow-float overflow-hidden">
    <RulesCarousel onClose={...} />
  </div>
</motion.div>
```

### RulesCarousel の実装方針

```tsx
import useEmblaCarousel from "embla-carousel-react";

function RulesCarousel({ onClose }: { onClose: () => void }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false, align: "start", dragFree: false });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const handler = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", handler);
    return () => { embla.off("select", handler); };
  }, [embla]);

  const total = STEPS.length;
  const isFirst = selected === 0;
  const isLast = selected === total - 1;

  return (
    <div className="flex flex-col h-full">
      <CarouselHeader current={selected + 1} total={total} onClose={onClose} />
      <div ref={emblaRef} className="overflow-hidden flex-1">
        <div className="flex h-full">
          {STEPS.map((step, i) => (
            <article
              key={step.id}
              className="shrink-0 grow-0 basis-full px-6 py-4 flex flex-col items-center justify-center text-center"
              aria-roledescription="slide"
              aria-label={`ステップ ${i + 1} / ${total}`}
            >
              <step.Illustration className="w-48 h-48 sm:w-56 sm:h-56" aria-hidden />
              <h3 className="mt-4 font-rounded text-2xl font-extrabold text-ink-900">{step.heading}</h3>
              <p className="mt-2 text-base text-ink-600 leading-relaxed max-w-xs">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
      <DotsIndicator total={total} current={selected} onJump={(i) => embla?.scrollTo(i)} />
      <CarouselFooter
        isFirst={isFirst}
        isLast={isLast}
        onPrev={() => embla?.scrollPrev()}
        onNext={() => embla?.scrollNext()}
        onDone={onClose}
      />
    </div>
  );
}
```

#### CarouselHeader

```tsx
<header className="flex items-center justify-between px-4 h-14 border-b border-border-200">
  <button
    type="button"
    onClick={onClose}
    aria-label="閉じる"
    className="w-10 h-10 rounded-2xl flex items-center justify-center bg-cream-100 active:scale-[0.97] transition"
  >
    <XIcon className="w-5 h-5 text-ink-900" />
  </button>
  <h2 className="font-rounded text-lg font-extrabold text-ink-900">あそびかた</h2>
  <span className="text-sm font-bold text-ink-600 tabular-nums">{current}/{total}</span>
</header>
```

#### DotsIndicator

```tsx
<div className="flex items-center justify-center gap-2 py-3">
  {Array.from({ length: total }).map((_, i) => (
    <button
      key={i}
      type="button"
      onClick={() => onJump(i)}
      aria-label={`ステップ ${i + 1} へ`}
      className={cn(
        "h-2 rounded-full transition-all duration-300",
        i === current ? "w-8 bg-leaf-500" : "w-2 bg-border-200 hover:bg-ink-400"
      )}
    />
  ))}
</div>
```

現在のドットだけ横に伸びる(`w-2 → w-8`)アニメーションで、進行が直感的にわかる。

#### CarouselFooter

```tsx
<footer className="flex items-center gap-3 px-4 py-4 border-t border-border-200">
  <button
    type="button"
    onClick={onPrev}
    disabled={isFirst}
    className="flex-1 h-12 rounded-2xl bg-cream-100 text-ink-900 font-rounded font-bold disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition"
  >
    <span className="inline-flex items-center gap-1"><ChevronLeftIcon className="w-5 h-5" />もどる</span>
  </button>
  {isLast ? (
    <button
      type="button"
      onClick={onDone}
      className="flex-1 h-12 rounded-2xl bg-leaf-500 hover:bg-leaf-600 text-white font-rounded font-bold shadow-cta active:scale-[0.98] transition"
    >
      <span className="inline-flex items-center gap-1">はじめる<PlayIcon className="w-5 h-5" /></span>
    </button>
  ) : (
    <button
      type="button"
      onClick={onNext}
      className="flex-1 h-12 rounded-2xl bg-leaf-500 hover:bg-leaf-600 text-white font-rounded font-bold shadow-cta active:scale-[0.98] transition"
    >
      <span className="inline-flex items-center gap-1">つぎへ<ChevronRightIcon className="w-5 h-5" /></span>
    </button>
  )}
</footer>
```

最後のステップでは「はじめる」に変わり、押すとモーダルが閉じてアプリ画面に戻る。

### イラストの差し替えアニメーション

ステップが切り替わるたびに、イラストが軽くポップする。

```tsx
<motion.div
  key={step.id}
  initial={{ scale: 0.92, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
>
  <step.Illustration />
</motion.div>
```

`AnimatePresence mode="wait"` で前のイラストが消えてから次が入る。

### キーボード操作

- `←` / `→` で前後のステップへ
- `Esc` で閉じる
- `Tab` でフォーカスがモーダル内をループ (Radix Dialog のフォーカストラップで自動)
- 最後のステップで `Enter` を押すと「はじめる」

## その他のモーダル

ルールモーダルと同じ「Bottom Sheet (mobile) / Center Dialog (≥md)」のパターンを共通化する。`<AppDialog>` というラッパーコンポーネントを `src/components/ui/AppDialog.tsx` に用意する。

### 設定モーダル

- 音通知トグル (`Switch` コンポーネント)
- 既定タイマー時間 (`SegmentedControl`: 3 / 5 / 7 / 10 分)
- データモード (`SegmentedControl`: 手入力 / サンプル)
- 「保存データを初期化する」(danger ボタン)

### キジュン確認モーダル

親が「ヒミツのキジュンをこっそり確認」を**長押し**しているあいだだけ開く。

- 実装: `onPointerDown` で開く / `onPointerUp` `onPointerCancel` `onPointerLeave` で閉じる
- 内容: 大きく `text-3xl font-extrabold text-rose-500` でキジュン本文
- 背景: `bg-ink-900/80` で全面を覆い、覗き見を防ぐ
- ボタンには `aria-pressed={open}` と「長押し中だけ表示します」のヒントを併記

### 確認ダイアログ (Restart, Timer End)

```tsx
<AppDialog open={open} onClose={...} size="sm">
  <div className="p-6">
    <h3 className="font-rounded text-xl font-extrabold text-ink-900">{title}</h3>
    <p className="mt-2 text-sm text-ink-600">{description}</p>
    <div className="mt-6 grid grid-cols-2 gap-3">
      <button onClick={onCancel} className="h-12 rounded-2xl bg-cream-100 text-ink-900 font-bold active:scale-[0.98]">やめる</button>
      <button onClick={onConfirm} className="h-12 rounded-2xl bg-rose-500 text-white font-bold shadow-cta active:scale-[0.98]">{confirmLabel}</button>
    </div>
  </div>
</AppDialog>
```

## フェイズ別画面詳細

各フェイズで `PhasePanel` と `FooterBar` がどう見えるかを表にする。`PhaseStepper` はどのフェイズでも常に表示。

### `setup` — 新しいラウンドを準備する

| 要素 | 内容 |
|---|---|
| `HeroIllustration` | 大きく表示 (キャラ+カラフルタイトル) |
| `PhaseBadge` | 「はじめよう!」(`start`) |
| 見出し | 「新しいラウンドをはじめる」 |
| 説明 | 「2つのヒミツのキジュンを選び、3つのワードを子どもたちに伝えてワードッチを楽しみましょう!」 |
| パネル内 | `TimerSettingControl` (タイマー時間選択) |
| FooterBar 左 | (グレー無効) — このフェイズでは再開不要なので「↻ もういちど」を出さず、`SecondaryAction` の「ルール」アイコンに差し替え |
| FooterBar 右 | 「はじめる」(`leaf`) |

### `secretSelection` — ヒミツのキジュンを選ぶ

| 要素 | 内容 |
|---|---|
| `HeroIllustration` | コンパクト (キャラなし) |
| `PhaseBadge` | 「ステップ 1/3」(`secret`) |
| 見出し | 「ヒミツのキジュンを選ぼう」 |
| 説明 | 「2つの候補から、今回のヒミツのキジュンを1つだけ選んでね。選ばないほうは伏せたままにします。」 |
| パネル内 | `CriterionCandidateCard` ×2 (縦並び) |
| SecretHintCard | 「これは親だけが見るカードだよ」 |
| FooterBar 左 | 「↻ 新しくはじめる」 |
| FooterBar 右 | 「次へ」(候補が選ばれるまで disabled) |

### `wordPrompt` — 3つのワードを伝える

| 要素 | 内容 |
|---|---|
| `PhaseBadge` | 「ステップ 2/3」(`info`) |
| 見出し | 「3つのワードを子に伝えよう」 |
| 説明 | 「下の3つのワードを口に出して伝えてください。子どもたちは、ヒミツのキジュンに一番近そうなワードを話し合います。」 |
| パネル内 | `WordCard` ×3 |
| SecretHintCard | キジュンを `Collapsible` で隠して表示 |
| FooterBar 左 | 「↻ 新しくはじめる」 |
| FooterBar 右 | 「タイマー開始」(`leaf`) |

### `timedInvestigation` — タイマー調査中

| 要素 | 内容 |
|---|---|
| `PhaseBadge` | 「調査中」(`live`、`animate-pulse` 任意) |
| 見出し | 「のこり時間で話し合おう」 |
| パネル内 | `TimerDisplay` + `CountdownControls` (一時停止 / リセット / **終了**) |
| SecretHintCard | キジュン本文 (`Collapsible` で隠す。長押し SecretButton で確認) |
| FooterBar 左 | 「↻ 新しくはじめる」(進行中なので確認ダイアログ) |
| FooterBar 右 | 「決選へ進む」(`leaf`、タイマーが残っていても押せる。`CountdownControls` の「終了」と同じ動作) |

「終了」と「決選へ進む」は同じ機能だが、視認性のため両方残す。タイマー画面に集中しているときはコントロールから、画面全体を見ているときはフッターから操作できる。

### `finalGuide` — 決選フェイズの案内

| 要素 | 内容 |
|---|---|
| `PhaseBadge` | 「決選フェイズ」(`secret`) |
| 見出し | 「最後のワードを考えてもらおう」 |
| 説明 | 「ここからは、子どもたちにそれぞれ最後のワードを1つ考えてもらいます。出そろったら、親がキジュンに一番合うワードを選びましょう。」 |
| パネル内 | 進行順を3ステップで箇条書き(視認しやすい大きな番号付き) |
| FooterBar 左 | 「↻ 新しくはじめる」 |
| FooterBar 右 | 「キジュンを公開」(`leaf`) |

### `reveal` — キジュン公開

| 要素 | 内容 |
|---|---|
| `PhaseBadge` | 「正解はこちら!」(`done`) |
| 見出し | キジュン本文 (大きく表示) |
| パネル内 | このラウンドの3ワードと、設定したタイマー時間を一覧 |
| FooterBar 左 | (このフェイズでは非表示 or `SecondaryAction` に変更) |
| FooterBar 右 | 「もう一度遊ぶ」(`leaf`) |

`reveal` ではフェイズが終わったので、左ボタンを「↻ 新しくはじめる」ではなく「終わる(履歴に残す)」に切り替えてもよい。実装では `FooterBar` が `phase` を見て中身を差し替える。

## アクセシビリティ

- **ステッパー**: `<nav aria-label="進行ステップ">` + `<ol>` でスクリーンリーダーに「進行ステップ、ステップ X / Y、現在: ZZ」を伝える。`aria-current="step"` を `active` ノードに付ける
- **フォーカスリング**: `focus-visible:ring-4 focus-visible:ring-leaf-500/40` をすべてのインタラクティブ要素に
- **タップターゲット**: 主要ボタン 48×48px 以上、フッターのアクションは `h-14` (56px)
- **コントラスト**: 主要組み合わせを WCAG AA 以上で満たす (`text-ink-900` on `cream-50` で 12:1)
- **ライブ領域**: タイマーは `aria-live="polite"`、フェイズ変更時はパネル見出しに `tabIndex={-1}` + `focus()`
- **モーション**: `useReducedMotion()` で `transition: { duration: 0 }` に切り替える
- **モーダル**: Radix Dialog のフォーカストラップ + `Esc` 閉じる + 背景クリック閉じる
- **長押しボタン**: 「長押し中だけ表示します」のテキストを併記し、SR でも `aria-pressed` で状態を伝える

## レスポンシブ仕様

| 幅 | ヘッダー | ステッパー | キャラ | パネル並び | タイマー数字 |
|---|---|---|---|---|---|
| < 360px | 高さ 52px | h-12, ノード小 | `w-16` | 縦1列 | `text-5xl` |
| 360-640px | 高さ 56px | h-14 | `w-20` | 縦1列 | `text-6xl` |
| 640-1024px | 高さ 60px | h-14 | `w-24` | 縦1列 | `text-7xl` |
| ≥ 1024px | 高さ 60px | h-14 (中央寄せ、ノード大) | `w-28` | パネル+ヒントを2列に | `text-8xl` |

横持ち時は `100dvh` 基準でレイアウトを組み、ヘッダー/ステッパー/フッターを `sticky` のまま、メインを scroll する。

## Tailwind 設定

### `tailwind.config.ts` (抜粋)

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { 50: "#FFF8E7", 100: "#FFFBF0", 200: "#FFF1D6" },
        ink:   { 400: "#B6A28A", 600: "#7A6450", 900: "#3D2E1F" },
        leaf:  { 100: "#E3F2DA", 500: "#5BA84A", 600: "#4A8E3B" },
        sun:   { 100: "#FFF2CC", 400: "#FFCB47" },
        rose:  { 100: "#FBE3E0", 400: "#EB8B85", 500: "#E36B6B" },
        sky:   { 500: "#6BB8DB" },
        border:{ 200: "#F0E2C8" },
        danger:{ 500: "#E0635A" },
      },
      fontFamily: {
        rounded: ["var(--font-rounded)", "system-ui", "sans-serif"],
        noto:    ["var(--font-noto)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:  "0 2px 6px rgba(110,80,40,0.08)",
        cta:   "0 6px 16px rgba(110,80,40,0.12)",
        float: "0 12px 28px rgba(110,80,40,0.18)",
        bar:   "0 -4px 12px rgba(110,80,40,0.10)",
      },
      borderRadius: { "4xl": "2rem" },
    },
  },
} satisfies Config;
```

### `globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply text-ink-900 font-noto antialiased;
    color-scheme: light;
    background: theme(colors.cream.50);
  }

  body {
    @apply min-h-[100dvh];
    background-image:
      radial-gradient(circle at 12% 18%, rgba(255,203,71,0.18) 0, transparent 38%),
      radial-gradient(circle at 88% 12%, rgba(227,107,107,0.12) 0, transparent 36%),
      radial-gradient(circle at 50% 102%, rgba(91,168,74,0.10) 0, transparent 40%);
  }

  :focus-visible {
    @apply outline-none ring-4 ring-leaf-500/40 rounded-2xl;
  }

  /* Embla / カルーセル用の補助 */
  .scrollbar-none {
    scrollbar-width: none;
  }
  .scrollbar-none::-webkit-scrollbar { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

## ファイル配置 (新規/更新)

```text
src/
  app/
    layout.tsx                    # 永続レイアウト (Header + Stepper + Footer のホスト)
    page.tsx                      # フェイズ別パネルの合成
    globals.css
    manifest.ts
  components/
    layout/
      AppHeader.tsx              # メニュー / タイトル / ルールアイコン
      PhaseStepper.tsx           # ★ 新規: 6ノードのステッパー
      FooterBar.tsx              # ★ 新規: 「新しくはじめる」+ 主CTA を常設
      AppShell.tsx               # ヘッダー+ステッパー+メイン+フッターの組み立て
    ui/
      AppDialog.tsx              # ★ Radix Dialog + Framer Motion ラッパー
      Button.tsx                 # cva バリアント (primary/secondary/danger/ghost)
      IconButton.tsx
      SegmentedControl.tsx
      Switch.tsx
      Collapsible.tsx            # Radix Collapsible のラッパー
      ConfirmDialog.tsx          # ★ 新規: 確認用 (Restart/End)
    pwa/
      ServiceWorkerRegistrar.tsx
  features/
    round/
      components/
        CriterionPicker.tsx
        PromptWords.tsx
        RevealPanel.tsx
      round-reducer.ts
      round-storage.ts
      round-types.ts
    rules/
      RulesDialog.tsx            # ★ 新規: ルールモーダル本体
      RulesCarousel.tsx          # ★ 新規: Embla カルーセル
      rules-steps.ts             # ★ 新規: 5ステップのコンテンツとイラスト
      illustrations/             # ★ 新規: 各ステップ用 SVG
    timer/
      components/
        CountdownControls.tsx    # ★ 更新: 終了ボタン追加
        TimerDisplay.tsx
      use-countdown.ts
      timer-reducer.ts
  lib/
    motion.ts                    # ★ 新規: 共通モーションプリセット
    cn.ts                        # clsx + tailwind-merge ラッパー
```

## 状態遷移と Reducer の対応

`round-reducer.ts` に以下の action を追加・整理する。

```ts
type RoundAction =
  | { type: "START" }                  // setup → secretSelection
  | { type: "PICK_CRITERION"; id: string }   // secretSelection → wordPrompt
  | { type: "START_TIMER" }           // wordPrompt → timedInvestigation
  | { type: "PAUSE_TIMER" }
  | { type: "RESUME_TIMER" }
  | { type: "RESET_TIMER" }
  | { type: "GO_FINAL" }              // timedInvestigation → finalGuide
  | { type: "REVEAL" }                // finalGuide → reveal
  | { type: "RESTART" }               // reveal → setup
  | { type: "ABORT_AND_RESTART" }     // どのフェイズからでも setup に戻す (FooterBar の「新しくはじめる」)
  | { type: "GO_BACK"; toPhase: Phase }; // ステッパーで完了済みステップに戻る
```

`ABORT_AND_RESTART` は確認ダイアログを経由してから dispatch される。タイマーが動いていれば停止する。

## デザイン検証チェックリスト

実装完了時に以下を確認する。

- [ ] 全画面で `PhaseStepper` が常に見えている
- [ ] 全画面 (reveal を除く) で `FooterBar` 左に「新しくはじめる」が常設されている
- [ ] `setup` 以外で「新しくはじめる」を押すと確認ダイアログが出る
- [ ] `timedInvestigation` の `CountdownControls` に「終了」ボタンがある
- [ ] 「終了」を押すと確認後に `finalGuide` へ進む
- [ ] ルールモーダルが Bottom Sheet (mobile) / Center Dialog (≥md) で開く
- [ ] ルールモーダルがスワイプ・キーボード矢印・ドットタップで動く
- [ ] 最後のステップで「はじめる」を押すと閉じる
- [ ] iPhone SE (375×667) と Pixel 7 (412×915) でレイアウトが破綻しない
- [ ] フォーカスリングがすべてのボタンで見える
- [ ] `prefers-reduced-motion: reduce` でアニメーションが止まる
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Service Worker キャッシュ後、オフラインで動作する

## 採用しないデザイン

- マテリアルデザインの濃いシャドウ
- 全画面背景画像
- カスタム CSS フレームワーク
- ダーク / ハイコントラストモード(初期スコープ外、`color-scheme: light` 固定)
- 子ども側端末との同期 UI(初期スコープ外)
- 派手なグラデーション
- 太い黒ストロークの「アニメ調」イラスト
