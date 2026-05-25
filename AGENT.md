# AGENT.md

## プロジェクト

- このリポジトリは、ボードゲーム「ワードッチ」を遊ぶ親プレイヤー向けの非公式進行補助ツールを作る。
- `docs/` をプロジェクトの主な判断材料とする。実装、設計変更、機能判断の前に、関連する `docs/` 配下の文書を確認する。
- 実装時は `docs/implementation-rules.md` も確認し、デザイン・スタイリング・画像生成・検証のルールに従う。
- 実装が `docs/` とズレる必要がある場合は、理由を明示し、必要なら同じ変更でドキュメントも更新する。

## プロダクト方針

- UI は日本語、モバイルファースト、親が片手で操作しやすいことを優先する。
- スコープは、ルール案内、ヒミツのキジュン選択、3ワード提示、タイマー、フェイズ案内、キジュン公開に絞る。
- `docs/` を意図的に変更しない限り、子プレイヤー管理、スコア管理、部屋作成、認証、サーバー、DB、リアルタイム同期は作らない。
- 公式カード本文、公式ワード一覧、公式キジュン一覧をリポジトリに含めない。独自サンプルデータまたはユーザー入力だけを扱う。

## 技術方針

- Next.js App Router、TypeScript、React、Tailwind CSS のユーティリティのみ、静的エクスポート、PWA、GitHub Pages デプロイを前提にする。
- 画面は `/` の単一ルートに保つ。フェイズ切り替え、ルール、設定、親専用のキジュン表示は React state、reducer、モーダルで扱う。
- Server Actions、API Routes、SSR/ISR 前提機能、Middleware、rewrites、redirects、cookies、サーバー側状態は使わない。
- `window`、`navigator`、`localStorage` などの Browser API は Client Component または effect 内で扱う。
- GitHub Pages のサブパス配信に備え、config、manifest、Service Worker、asset URL の `basePath` 対応を保つ。

## コード配置

- ファイル配置は `docs/nextjs-folder-structure-design.md` に従う。
- ラウンド進行は `src/features/round/`、タイマーは `src/features/timer/`、再利用 UI は `src/components/ui/`、PWA 登録は `src/components/pwa/`、横断 helper は `src/lib/`、独自サンプルデータは `src/data/` に置く。
- `src/app/page.tsx` は単一画面の合成に集中させ、ドメインロジックを埋め込みすぎない。

## 検証

- package scripts がある場合は、変更に応じて lint、test、build を実行してから完了する。
- reducer、タイマー、保存データ復元、親向けの重要フローを変更したら、焦点を絞ったテストを追加または更新する。
- UI 変更では、モバイル表示、日本語テキストの読みやすさ、フォーカス状態、親専用情報と子に見せてよい情報の区別を確認する。
