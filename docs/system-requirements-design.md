# ワードッチ Web ツール システム要件・設計書

最終調査日: 2026-05-25  
対象: Next.js 静的サイト / PWA / GitHub Pages デプロイ / Tailwind CSS のみ

## 目的

アークライト『ワードッチ』のプレイを補助する、ローカルファーストな Web ツールを作る。初期実装では、同じ端末を回して遊ぶパスアンドプレイを主対象とし、配布先は GitHub Pages を想定する。

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
- 公式カードの全ワード・全キジュンはリポジトリに同梱しない。権利者の許諾がない限り、独自サンプルまたはユーザー入力で扱う。

## 技術スタック

- フレームワーク: Next.js App Router
- 言語: TypeScript
- UI: React
- スタイリング: Tailwind CSS のユーティリティクラスのみ
- PWA: Web App Manifest + Service Worker
- 永続化: `localStorage` を基本とし、必要に応じて IndexedDB を検討
- デプロイ: GitHub Actions で `next build` し、`out` を GitHub Pages に公開

## Next.js 静的サイト要件

Next.js の Static Export は `next.config` で `output: "export"` を指定し、`next build` 後に `out` ディレクトリを生成する。静的配信では、Node.js サーバーが必要な機能を使わない。

推奨設定:

```ts
import type { NextConfig } from "next";

const repoName = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: repoName,
  assetPrefix: repoName ? `${repoName}/` : undefined,
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

- Next.js の PWA ガイドには Push Notification や Server Actions の例があるが、静的サイトではバックエンドがないため初期スコープから外す。
- Service Worker のスコープとキャッシュ URL は GitHub Pages の `basePath` を考慮する。
- Service Worker は更新検知しやすいようにキャッシュ名へバージョンを含める。

## Tailwind CSS 要件

- Tailwind CSS を導入し、グローバル CSS には Tailwind の import だけを置く。
- CSS Modules、Sass、CSS-in-JS、Bootstrap、UI コンポーネントライブラリは使用しない。
- 共通見た目は React コンポーネントと Tailwind クラスで表現する。
- アイコンが必要な場合も、CSS フレームワークは追加しない。SVG 直書きまたは軽量アイコンライブラリは別途判断する。

## 機能要件

### プレイヤー管理

- プレイヤー名を3-8人分登録できる。
- 親を手動選択またはランダム選択できる。
- ラウンド終了後に親を次のプレイヤーへ交代できる。

### デッキ・キジュン管理

- 独自カードデータを登録できる。
- カードは複数ワードと1つのキジュンを持つ。
- 親には2枚、子には1枚を配る。
- 公式モードではカード本文をアプリ内に同梱せず、ユーザー入力または物理カード参照で進められるようにする。

### セットアップ

- 親だけが2枚のキジュン候補を確認し、1つを選べる。
- 子にはキジュン候補を表示しない。
- 親のワードから最初の暫定チャンピオンを選べる。

### 調査フェイズ

- 子のワード入力を記録できる。
- 親が「暫定チャンピオンが勝ち」「新ワードが勝ち」を選べる。
- 勝ったワードを自動で次の暫定チャンピオンにする。
- 判定履歴を時系列で表示する。
- 親の判断で決選フェイズに移行できる。

### 決選フェイズ

- 子ごとに決選ワードを1つ入力できる。
- 全員が入力するまで他プレイヤーの決選ワードを隠す。
- 親が優勝ワードを選べる。
- 重複・空欄・過去に出たワードを検知し、警告する。

### 結果表示

- 優勝者、優勝ワード、ヒミツのキジュン、調査履歴を表示する。
- ラウンド履歴を端末内に保存できる。
- 新しいラウンドを開始できる。

### PWA・オフライン

- 初回ロード後、主要画面をオフラインで開ける。
- 通信がなくてもゲーム状態を保存・復元できる。
- ホーム画面へ追加できる。

## 非機能要件

- モバイルファーストで設計する。
- 片手操作しやすいボタンサイズを確保する。
- 親が端末を見せる場面と隠す場面を明確に分ける。
- 日本語 UI を基本にする。
- 入力中のデータは端末内に留め、外部送信しない。
- 初期表示は軽量にし、静的配信で高速に開けることを優先する。
- アクセシビリティとして、フォームラベル、フォーカスリング、十分なコントラストを確保する。

## 画面構成

- `/`: 現在のゲームまたは新規作成
- `/setup`: プレイヤー登録、親選択、カード入力またはデッキ選択
- `/parent-secret`: 親専用のキジュン選択
- `/investigation`: 暫定チャンピオン、ワード入力、判定履歴
- `/final`: 決選ワード入力と一斉公開
- `/result`: 優勝者、キジュン公開、履歴
- `/settings`: データリセット、サンプルデッキ管理、PWA 情報

静的エクスポートを優先するため、URL ルーティングは固定パス中心にする。状態は URL ではなくローカルストレージで保持する。

## アプリ状態設計

状態遷移:

```text
idle -> setup -> secretSelection -> investigation -> finalPrep -> finalReveal -> result
```

主要ストア:

- `players`
- `deck`
- `currentRound`
- `roundHistory`
- `settings`

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
  - 親・子の人数バリデーション
  - 暫定チャンピオン更新
  - 決選ワードの重複検知
  - localStorage 保存データのマイグレーション
- E2E テスト
  - 3人プレイの最短導線
  - 決選フェイズで入力が揃うまで隠れること
  - 結果画面でキジュンが公開されること
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
- オフライン状態でも直前のゲームを復元できる。
- 3-8人の公式想定人数で1ラウンドを完了できる。
- 親のキジュンが決選終了まで子画面に漏れない。
- 公式カード全文をリポジトリに含めずに遊べる。
- Tailwind CSS 以外の CSS 手法や UI フレームワークに依存しない。

## 未決定事項

- GitHub リポジトリを公開にするか、Pages 対応プランのあるプライベートにするか。
- 公式カードデータの利用許諾を取るか、完全にユーザー入力・独自データで進めるか。
- 初期バージョンでサンプルデッキを何枚分用意するか。
- 複数端末でのオンライン同期を将来対応するか。
- アイコンやロゴを独自に制作するか、テキストベースで開始するか。
