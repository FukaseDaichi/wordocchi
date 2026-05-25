# Next.js フォルダ構成設計書

最終更新日: 2026-05-25  
対象: ワードッチ親向け進行補助ツール

## 目的

Next.js App Router、静的エクスポート、PWA、GitHub Pages、Tailwind CSS を基本とする前提で、実装時に迷いにくいフォルダ構成を定義する。  
このプロジェクトは小規模な親向けツールなので、過度に階層を増やさず、単一画面、ゲーム進行、PWA、UI 部品の責務を分ける。

## 参照元

- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Next.js public Folder](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)
- [Next.js src Directory](https://nextjs.org/docs/15/pages/api-reference/file-conventions/src-folder)

## 採用方針

- `src/` ディレクトリを採用し、アプリケーションコードを設定ファイルから分離する。
- App Router を使うが、ゲーム本体の URL は `/` のみとする。`src/app/` は単一ページの合成に集中させる。
- ゲーム進行、タイマー、保存処理などの実装は `src/features/` に置く。
- 汎用 UI は `src/components/` に置く。
- 汎用関数、定数、環境差分吸収は `src/lib/` に置く。
- 公式カード全文は同梱しない。初期実装では独自サンプルデータだけを `src/data/` に置く。
- PWA アイコンや Service Worker など、ブラウザから直接参照される静的ファイルは root の `public/` に置く。
- 画像素材は原則として Codex の `imagegen` skill で生成した PNG を `public/illustrations/` に置く。初期実装では画像なしでも成立する構成にする。
- Tailwind CSS を基本にする。ポイント CSS は `src/app/globals.css` に必要最小限だけ置き、CSS Modules、Sass、CSS-in-JS は使わない。

## 推奨フォルダ構成

```text
wordocchi/
  .github/
    workflows/
      pages.yml
  docs/
    DESIGN.md
    implementation-rules.md
    nextjs-folder-structure-design.md
    system-requirements-design.md
    wordocchi-rule-definition.md
  public/
    icons/
      icon-192.png
      icon-512.png
      maskable-512.png
    illustrations/
      dog-detective.png
      cat-notekeeper.png
      lock-secret.png
    sw.js
  src/
    app/
      globals.css
      layout.tsx
      manifest.ts
      not-found.tsx
      page.tsx
    components/
      layout/
        AppHeader.tsx
        AppShell.tsx
      pwa/
        ServiceWorkerRegistrar.tsx
      ui/
        Button.tsx
        Card.tsx
        Dialog.tsx
        Field.tsx
        Modal.tsx
        SegmentedControl.tsx
        TimerDisplay.tsx
    data/
      sample-prompts.ts
    features/
      round/
        components/
          CriterionPicker.tsx
          PromptWords.tsx
          RevealPanel.tsx
        round-actions.ts
        round-reducer.ts
        round-storage.ts
        round-types.ts
      rules/
        RulesContent.tsx
        rules-copy.ts
      timer/
        components/
          CountdownControls.tsx
        timer-reducer.ts
        timer-types.ts
        use-countdown.ts
    lib/
      base-path.ts
      constants.ts
      storage.ts
    types/
      app.ts
  .gitignore
  eslint.config.mjs
  next.config.ts
  package.json
  playwright.config.ts
  postcss.config.mjs
  tsconfig.json
  vitest.config.ts
```

## 各ディレクトリの責務

### `.github/workflows`

GitHub Pages への静的デプロイ workflow を置く。

- `pages.yml`: `npm ci`、`npm run lint`、`npm test`、`npm run build`、Pages artifact upload、deploy を行う。

### `docs`

設計書とルール定義書を置く。実装コードから参照しない。

### `public`

ブラウザから直接配信される静的ファイルを置く。

- `icons/`: PWA 用アイコン。
- `illustrations/`: `imagegen` skill で後から生成する PNG イラスト。初期実装では空でもよい。
- `sw.js`: Service Worker。GitHub Pages の `basePath` を考慮してキャッシュ対象を定義する。

注意: `public` は root に置く。`src/public` にはしない。

### `src/app`

Next.js App Router のルート定義を置く。ただしゲーム本体は `/` の単一URLで完結させる。ページごとのビジネスロジックは持たせず、`features` のコンポーネントや関数を呼び出す。

- `layout.tsx`: 全体レイアウト、メタデータ、PWA 登録コンポーネントの配置。
- `globals.css`: Tailwind CSS の import のみ。
- `manifest.ts`: PWA manifest。
- `page.tsx`: アプリ本体。新規ラウンド、キジュン選択、3ワード提示、タイマー、決選案内、キジュン公開を同じURL内で切り替える。

ルーティング:

- `/`: アプリ本体。

ルール説明、設定、キジュン確認は route ではなくモーダルとして表示する。フェイズ切り替えも URL ではなく React state と reducer で扱う。

### `src/components`

特定機能に依存しない共通コンポーネントを置く。

- `layout/`: アプリ全体の枠、ヘッダー、ナビゲーション。
- `pwa/`: Service Worker 登録など、PWA 横断処理。
- `ui/`: Button、Dialog、Field などのプリミティブ UI。

ルール:

- ゲーム固有の文言や状態更新は入れない。
- Tailwind クラスで見た目を完結させる。
- 複雑な状態を持つ場合は、まず `features` 側に置けないか検討する。

### `src/features`

ドメイン単位の実装を置く。

- `round/`: ラウンド進行、キジュン選択、3ワード提示、公開処理。
- `rules/`: ルール説明の文言と表示。
- `timer/`: カウントダウン、視覚通知、一時停止・再開。

ルール:

- reducer、types、storage、feature-specific component を近くに置く。
- `app` から直接 reducer の細部を触らず、必要なら action/helper を通す。
- 子プレイヤー管理やスコア管理は作らない。

### `src/data`

独自サンプルデータを置く。初期実装ではこのデータだけを使い、手入力モードは作らない。

- `sample-prompts.ts`: 独自作成のキジュン候補とワード候補。

注意:

- 公式カードの全文データを置かない。
- 出典や権利が曖昧なデータは入れない。

### `src/lib`

アプリ横断の小さな関数や定数を置く。

- `base-path.ts`: GitHub Pages の `basePath` を扱う。
- `constants.ts`: アプリ名、既定タイマー秒数、ストレージキー。
- `storage.ts`: `localStorage` の読み書き共通処理。
### `src/types`

複数 feature で共有する型を置く。feature 内だけで使う型は、各 feature の `*-types.ts` に置く。

## ファイル配置ルール

- `page.tsx` は単一画面の合成だけにする。
- 状態遷移は `features/round/round-reducer.ts` に集約する。
- ルール説明、設定、キジュン確認は URL を分けず、モーダル状態で管理する。
- タイマーの時間計算は `features/timer/` に集約する。
- `localStorage` の直接アクセスは `round-storage.ts` または `lib/storage.ts` に閉じ込める。
- Client Component は必要な箇所だけにする。`useEffect`、`localStorage`、`navigator.serviceWorker` を使うコンポーネントは Client Component にする。
- Server Actions、API Routes、Middleware は静的エクスポート前提のため作らない。

## import 方針

TypeScript path alias は `@/*` を `src/*` に向ける。

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

推奨 import:

```ts
import { Button } from "@/components/ui/Button";
import { useCountdown } from "@/features/timer/use-countdown";
import { DEFAULT_TIMER_SECONDS } from "@/lib/constants";
```

避ける import:

```ts
import { Button } from "../../../components/ui/Button";
```

## PWA 関連配置

- `src/app/manifest.ts`: PWA manifest を返す。
- `public/icons/*`: manifest から参照するアイコン。
- `public/sw.js`: Service Worker 本体。
- `src/components/pwa/ServiceWorkerRegistrar.tsx`: Service Worker 登録用 Client Component。

`layout.tsx` では、直接 `navigator` を触らず、Client Component を配置する。

```tsx
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
```

## GitHub Pages 対応

プロジェクトサイトで `/wordocchi/` 配下に配信される可能性があるため、以下を共通化する。

- `next.config.ts`: `basePath` と `assetPrefix`
- `src/lib/base-path.ts`: アプリ内で使う basePath helper
- `src/app/manifest.ts`: `start_url` と `scope`
- `public/sw.js`: キャッシュ対象 URL

環境変数:

```text
NEXT_PUBLIC_BASE_PATH=/wordocchi
```

ローカル開発では空文字を使う。

## テスト配置

小規模なうちは、テストは実装ファイルの近くに置く。

```text
src/features/round/
  round-reducer.ts
  round-reducer.test.ts
src/features/timer/
  timer-reducer.ts
  timer-reducer.test.ts
```

E2E は root の `e2e/` を採用してもよいが、初期構築時は Playwright 設定だけ先に用意し、実装後に追加する。

```text
e2e/
  parent-flow.spec.ts
  pwa.spec.ts
```

## 初期実装時の最小構成

最初から全フォルダを作りすぎない場合は、以下で開始する。

```text
public/
  icons/
  illustrations/
  sw.js
src/
  app/
    globals.css
    layout.tsx
    manifest.ts
    page.tsx
  components/
    pwa/ServiceWorkerRegistrar.tsx
    ui/Button.tsx
    ui/Modal.tsx
    ui/TimerDisplay.tsx
  features/
    round/
      round-reducer.ts
      round-storage.ts
      round-types.ts
    timer/
      use-countdown.ts
  lib/
    constants.ts
    storage.ts
```

## 採用しない構成

- `pages/` Router は使わない。
- `/rules`、`/setup`、`/timer` などの画面別 route は作らない。
- `src/app/api/` は作らない。
- `middleware.ts` / `proxy.ts` は作らない。
- CSS Modules、Sass、CSS-in-JS 用フォルダは作らない。
- 初期実装では `public/sounds/` や音再生 helper は作らない。
- 子プレイヤーごとの状態管理フォルダは作らない。
- 公式カード全文を持つ `cards/official.ts` のようなファイルは作らない。

## 判断基準

新しいファイルを置く場所に迷ったら、以下で判断する。

- アプリ全体の画面合成なら `src/app/page.tsx`
- ルール説明や設定なら route ではなく `src/components/ui/Modal.tsx` と feature component
- ワードッチの進行ロジックなら `src/features/round/`
- タイマーのロジックなら `src/features/timer/`
- どの画面でも使う UI なら `src/components/ui/`
- PWA の登録や manifest 周辺なら `src/components/pwa/` または `src/app/manifest.ts`
- localStorage や basePath など横断処理なら `src/lib/`
- 公式由来でないサンプルデータなら `src/data/`
- 生成 PNG イラストなら `public/illustrations/`
