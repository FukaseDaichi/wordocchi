# ワードッチ Web ツール システム要件・設計書

最終更新日: 2026-05-25  
対象: Next.js 静的サイト / PWA / GitHub Pages デプロイ / Tailwind CSS のみ

## 目的

アークライト『ワードッチ』を遊ぶ親プレイヤー向けに、進行を軽く補助する Web ツールを作る。  
このツールは子プレイヤーの入力や勝敗を厳密に管理するものではなく、親だけが操作する「ルール説明」「ヒミツのキジュン選択」「3つのワード提示」「タイマー」「フェイズ案内」を主目的とする。

## 調査元

- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Next.js basePath](https://nextjs.org/docs/pages/api-reference/config/next-config-js/basePath)
- [Next.js Tailwind CSS Guide](https://nextjs.org/docs/pages/getting-started/css#tailwind-css)
- [GitHub Docs: What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [アークライト公式商品ページ: ワードッチ](https://arclightgames.jp/product/651wordocchi/)

## 前提

- 実装はプライベート利用を主目的とする。
- デプロイは GitHub Pages のプロジェクトサイトを想定する。
- GitHub Pages は静的な HTML/CSS/JavaScript をホスティングするサービスであり、リポジトリ内のファイルをビルドして公開できる。
- GitHub Pages のプロジェクトサイトは通常 `https://<owner>.github.io/<repository>/` のサブパス配信になる。
- GitHub Pages をプライベートリポジトリで使うには、GitHub Pro、Team、Enterprise 系プランが必要になる可能性がある。無料プランで確実に使うなら公開リポジトリを検討する。
- サーバー、DB、認証、リアルタイム通信は初期スコープに含めない。
- 子プレイヤーはシステムを操作しない。質問や回答は口頭で自由に行う。
- 公式カードの全ワード・全キジュンはリポジトリに同梱しない。権利者の許諾がない限り、独自サンプルまたはユーザー入力で扱う。

## システムの役割

このツールは、親の手元に置く進行カード兼タイマーとして振る舞う。

- 親にルール説明を表示する。
- 親に2つのヒミツのキジュン候補を提示し、1つを選ばせる。
- 親に3つのワードを提示し、子へ口頭で出してもらう。
- 子には、その3つのワードの中からヒミツのキジュンに近そうなものを選んでもらう。
- 調査フェイズ中はタイマーを表示し、質問・会話の残り時間を親へ知らせる。
- タイマー終了時に、親へ決選フェイズへ進むよう促す。
- 決選後は、親がヒミツのキジュンを公開する案内を表示する。

管理しないこと:

- 子プレイヤーの名前、手札、入力、発言履歴
- 調査フェイズ中の全ワード履歴
- 子ごとの回答や得点
- オンライン同期、部屋作成、リアルタイム通信

## 技術スタック

- フレームワーク: Next.js App Router
- 言語: TypeScript
- UI: React
- スタイリング: Tailwind CSS のユーティリティクラスのみ
- PWA: Web App Manifest + Service Worker
- 永続化: `localStorage`
- デプロイ: GitHub Actions で `next build` し、`out` を GitHub Pages に公開

## Next.js 静的サイト要件

Next.js の Static Export は `next.config` で `output: "export"` を指定し、`next build` 後に `out` ディレクトリを生成する。静的配信では、Node.js サーバーが必要な機能を使わない。

推奨設定:

```ts
import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

制約:

- Server Actions は使用しない。
- API Routes / 動的 Route Handlers は使用しない。
- SSR、ISR、Cookie 依存、Headers、Redirects、Rewrites、Middleware/Proxy は使用しない。
- `window`、`navigator`、`localStorage` などの Browser API は Client Component の `useEffect` 内で扱う。
- `next/image` のデフォルト最適化は静的エクスポートと相性が悪いため、`images.unoptimized` を使うか通常の `img` を使う。

## PWA 要件

必須:

- `app/manifest.ts` または `app/manifest.json` を作成する。
- `name`、`short_name`、`description`、`start_url`、`scope`、`display`、`background_color`、`theme_color`、アイコンを定義する。
- 192x192 と 512x512 の PNG アイコンを `public/` に置く。可能なら maskable アイコンも用意する。
- Service Worker を登録し、アプリシェル、主要静的アセット、オフラインフォールバックをキャッシュする。
- HTTPS で配信する。GitHub Pages の `github.io` は HTTPS 配信に対応する。
- インストール可能性を Chrome DevTools / Lighthouse / Playwright で確認する。

注意:

- Push Notification や Server Actions は、静的サイトではバックエンドがないため初期スコープから外す。
- Service Worker のスコープとキャッシュ URL は GitHub Pages の `basePath` を考慮する。
- Service Worker は更新検知しやすいようにキャッシュ名へバージョンを含める。

## Tailwind CSS 要件

- Tailwind CSS を導入し、グローバル CSS には Tailwind の import だけを置く。
- CSS Modules、Sass、CSS-in-JS、Bootstrap、UI コンポーネントライブラリは使用しない。
- 共通見た目は React コンポーネントと Tailwind クラスで表現する。
- UI は親が片手で操作できる大きめのボタン、読みやすい文字サイズ、明確なフェイズ表示を優先する。

## 機能要件

### ルール説明

- 初回起動時、短いルール説明モーダルを表示する。
- いつでもルール説明モーダルを再表示できる。
- 説明は親の操作手順に絞る。
- 子に見せても問題ない説明と、親だけが見る説明を分ける。

### ラウンド開始

- 親が「新しくはじめる」を押すとラウンドを開始する。
- タイマー時間を選択できる。
  - 初期値: 5分
  - 選択肢例: 3分、5分、7分、10分

### ヒミツのキジュン選択

- システムは2つのヒミツのキジュン候補を親に提示する。
- 親はそのうち1つを選ぶ。
- 選ばなかったキジュンは以後表示しない。

### 3ワード提示

- キジュン選択後、システムは3つのワードを親に提示する。
- 親はその3つのワードを子へ口頭で伝える。
- 子は自由に相談・質問しながら、3つの中でヒミツのキジュンに近そうなワードを選ぶ。

### 調査タイマー

- 3ワード提示後、調査フェイズ用タイマーを開始できる。
- タイマーは開始、一時停止、再開、リセットができる。
- 残り時間を大きく表示する。
- 残り1分、残り30秒、終了時に視覚的な通知を出す。
- 音による通知は設定でオン/オフできる。
- タイマー終了時に「決選フェイズへ進みましょう」と表示する。

### 決選案内

- タイマー終了後、親に決選フェイズの進行文を表示する。
- 表示内容は、子へ最後のワードを考えてもらうこと、親がキジュンに最も近いワードを選ぶこと、最後にキジュンを公開することを短く案内する。
- 決選の入力管理は行わない。

### ラウンド終了

- ラウンド終了画面では、ヒミツのキジュン、提示した3ワード、タイマー時間を表示する。
- 「もう一度遊ぶ」で新しいキジュン候補と3ワードを用意する。

### PWA・オフライン

- 初回ロード後、主要画面をオフラインで開ける。
- 通信がなくてもルール説明、キジュン選択、ワード提示、タイマーが利用できる。
- ホーム画面へ追加できる。

## 非機能要件

- モバイルファーストで設計する。
- 親が端末を片手で持って操作しやすいことを優先する。
- 親だけが見る情報と、子に見せてもよい情報の状態を明確に分ける。
- 日本語 UI を基本にする。
- 入力中のデータは端末内に留め、外部送信しない。
- 初期表示は軽量にし、静的配信で高速に開けることを優先する。
- アクセシビリティとして、フォームラベル、フォーカスリング、十分なコントラストを確保する。

## 画面構成

基本的に画面は1画面のみとし、すべて `/` で完結させる。  
フェイズの切り替え、ルール説明、設定、キジュン確認は URL ではなく、同一画面内の表示状態とモーダルで管理する。

- `/`: アプリ本体。新規ラウンド、キジュン選択、3ワード提示、タイマー、決選案内、キジュン公開を同じURL内で切り替える。
- ルール説明: モーダルウィンドウで表示する。
- 設定: モーダルウィンドウで表示する。
- キジュン確認: 親だけが見るモーダルまたは折りたたみパネルで表示する。
- 決選案内: タイマー終了後に同じ画面内の案内パネルとして表示する。
- ラウンド終了: 同じ画面内の完了パネルとして表示する。

URL にはフェイズや状態を持たせない。状態は React state とローカルストレージで保持する。

## アプリ状態設計

状態遷移:

```text
idle -> setup -> secretSelection -> wordPrompt -> timedInvestigation -> finalGuide -> reveal -> done
```

主要ストア:

- `currentRound`
- `settings`
- `lastRound`

### Round

- `id`: string
- `phase`: `"setup" | "secretSelection" | "wordPrompt" | "timedInvestigation" | "finalGuide" | "reveal" | "done"`
- `criteriaCandidates`: string[]
- `secretCriterion`: string | null
- `promptWords`: string[]
- `timerSeconds`: number
- `timerStartedAt`: string | null
- `timerRemainingSeconds`: number
- `optionalMemo`: string | null
- `createdAt`: string
- `completedAt`: string | null

### Settings

- `soundEnabled`: boolean
- `defaultTimerSeconds`: number
- `dataMode`: `"manual" | "sample"`
- `hasSeenRules`: boolean

### UIState

- `activeModal`: `"rules" | "settings" | "secret" | null`
- `isSecretHidden`: boolean

実装方針:

- ゲーム進行は reducer で管理する。
- 永続化は reducer の状態をバージョン付き JSON として保存する。
- スキーマ変更に備えて `schemaVersion` を持たせる。
- 不正な保存データを読み込んだ場合は、確認後に初期化できるようにする。

## GitHub Pages デプロイ設計

想定ワークフロー:

1. `pnpm install`
2. `pnpm lint`
3. `pnpm test`
4. `pnpm build`
5. `out` ディレクトリを Pages artifact としてアップロード
6. GitHub Pages にデプロイ

プロジェクトサイトの場合:

- リポジトリ名が `wordocchi` なら `NEXT_PUBLIC_BASE_PATH=/wordocchi` を指定する。
- `manifest` の `start_url`、`scope`、Service Worker 登録パスも `/wordocchi/` を考慮する。

## テスト要件

- 単体テスト
  - ラウンド状態遷移
  - キジュン候補2件から1件を選ぶ処理
  - 3ワード提示の生成・入力バリデーション
  - タイマーの開始、一時停止、再開、リセット
  - localStorage 保存データの復元
- E2E テスト
  - 親が `/` だけで新規ラウンドを開始し、キジュンを選び、3ワードを提示し、タイマー終了後に決選案内へ進めること
  - 親専用のキジュン表示を同一画面内で隠せること
  - ルール説明モーダルをいつでも表示できること
  - モバイル幅でボタンやテキストが崩れないこと
- PWA テスト
  - Manifest が読めること
  - Service Worker が登録されること
  - オフライン再読み込みで主要画面が表示されること
- ビルド確認
  - `next build` で `out` が生成されること
  - GitHub Pages のサブパスでアセット参照が壊れないこと

## 受け入れ基準

- GitHub Pages 上でアプリが表示できる。
- スマートフォンでホーム画面に追加できる。
- オフライン状態でもルール説明、キジュン選択、3ワード提示、タイマーが利用できる。
- すべてのゲーム進行が `/` の単一URLで完結する。
- ルール説明と設定はモーダルウィンドウで表示される。
- 親が2つのヒミツのキジュンから1つを選べる。
- 親が3つのワードを子へ提示するための画面を利用できる。
- 子プレイヤーをシステム上で管理しない。
- タイマー終了後に決選フェイズへ進む案内が表示される。
- 公式カード全文をリポジトリに含めずに遊べる。
- Tailwind CSS 以外の CSS 手法や UI フレームワークに依存しない。

## 未決定事項

- GitHub リポジトリを公開にするか、Pages 対応プランのあるプライベートにするか。
- 公式カードデータの利用許諾を取るか、完全にユーザー入力・独自データで進めるか。
- 初期バージョンで独自サンプルのキジュンとワードをいくつ用意するか。
- 3ワード提示を完全ランダムにするか、親が手入力する方式を初期実装にするか。
- 音通知を初期実装に含めるか、視覚通知だけで始めるか。
