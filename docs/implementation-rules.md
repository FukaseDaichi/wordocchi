# 実装ルール

最終更新日: 2026-05-25  
対象: ワードッチ親向け進行補助ツール

## 目的

この文書は、実装時に守るルールと、実装前に確認すべき未決事項・懸念点をまとめる。  
上位方針は `docs/DESIGN.md`、要件は `docs/system-requirements-design.md`、構成は `docs/nextjs-folder-structure-design.md`、ゲーム理解は `docs/wordocchi-rule-definition.md` に従う。

## 実装前に読むもの

実装、設計変更、UI 変更、データ追加の前に、次を確認する。

1. `docs/system-requirements-design.md`
2. `docs/wordocchi-rule-definition.md`
3. `docs/nextjs-folder-structure-design.md`
4. `docs/DESIGN.md`
5. この文書

ドキュメント間で矛盾がある場合は、作業前に矛盾点を明示し、必要ならドキュメントを更新してから実装する。

## 基本ルール

- `docs/DESIGN.md` に準じて実装する。
- UI は日本語、モバイルファースト、親が片手で操作しやすいことを優先する。
- パッケージマネージャーは npm を使う。
- 画面は `/` の単一ルートで完結させる。
- フェイズ切り替え、ルール説明、設定、親専用のキジュン表示は route ではなく state とモーダルで扱う。
- 子プレイヤー、スコア、部屋、認証、サーバー、DB、リアルタイム同期は初期スコープに含めない。
- 公式カード本文、公式ワード一覧、公式キジュン一覧をリポジトリへ入れない。
- 初期データは独自サンプルのみで始める。手入力モードは初期実装に含めない。
- 音通知は初期実装に含めない。

## スタイリング

- 基本は Tailwind CSS のユーティリティクラスで実装する。
- `docs/DESIGN.md` のデザイントークン、スペーシング、角丸、タイポグラフィ、配色を優先する。
- Tailwind だけでは読みづらい、または擬似要素・細かいアニメーション・safe area などで CSS の方が明確な場合は、ポイント実装として CSS を使ってよい。
- CSS を使う場合も、グローバルに広げすぎず、用途が分かる class 名に限定する。
- CSS Modules、Sass、CSS-in-JS、UI コンポーネントライブラリは導入しない。

## 画像・ビジュアル素材

- 画像を作成する場合は、原則として Codex の `imagegen` skill を利用して生成する。
- 生成画像は PNG 形式を積極的に利用する。
- `docs/DESIGN.md` のイラスト方針、色、雰囲気に合わせる。
- 生成画像は `public/illustrations/` など、ブラウザから直接参照できる場所に置く。
- PWA アイコンなど用途が固定された画像は、必要サイズを明示して PNG で用意する。
- 公式 IP、公式カード、公式イラストを模倣・転用しない。
- 画像ファイル名は用途が分かる kebab-case にする。例: `detective-dog-hero.png`
- 画像生成は初期実装後に行う。初期実装では画像なしでも崩れない UI を作る。

SVG は lucide-react のアイコン、単純な装飾、またはコードで保守しやすい小さな UI 部品に限定する。

## 実装方針

- Next.js App Router、TypeScript、React、静的エクスポート、PWA、GitHub Pages 配信を前提にする。
- Server Actions、API Routes、SSR/ISR 前提機能、Middleware、rewrites、redirects、cookies、サーバー側状態は使わない。
- `window`、`navigator`、`localStorage` などの Browser API は Client Component または `useEffect` 内で扱う。
- ラウンド進行は reducer に集約する。
- 保存データは schema version を持つ JSON として `localStorage` に保存する。
- GitHub Pages のサブパス配信を前提に、`basePath`、manifest、Service Worker、asset URL を壊さない。
- ファイル配置は `docs/nextjs-folder-structure-design.md` に従う。

## 品質確認

- package scripts がある場合、変更内容に応じて `lint`、`test`、`build` を実行する。
- reducer、タイマー、保存データ復元、重要な親向けフローを変更したら、焦点を絞ったテストを追加または更新する。
- UI 変更では、少なくともスマートフォン幅で表示崩れ、文字あふれ、タップ領域、フォーカス状態を確認する。
- 親だけが見る情報と、子に見せてよい情報が視覚的に区別できることを確認する。
- PWA 関連を変更した場合は、manifest、Service Worker 登録、オフライン表示、GitHub Pages サブパスを確認する。

## 追加の決定

- Next.js / React / Tailwind CSS / Vitest / Playwright は基本的最新。
- 独自サンプルの必要量: キジュン候補は１００件とワード候補は３００件。
- 後から生成する画像の対象: ヒーロー、キャラクター、PWA アイコン、空状態、背景装飾のどこまで作るか。最初は画像生成したい。画像生成したい一覧を定義し、/docs/配下でどういう画像がほしいかのドキュメントを最初は出力する。
- Service Worker のキャッシュ戦略: app shell、画像、フォント、更新時の cache version はいい感じに任せる

## 懸念点

- `docs/DESIGN.md` はあたたかいクリーム系を中心にしているため、画面全体が単調にならないよう、アクセント色と画像を適度に使う。
- 画像を多用すると初回ロードとオフラインキャッシュが重くなる。サイズ、圧縮、遅延読み込み、キャッシュ対象を管理する。
- 親専用情報が子に見えやすい場面がある。表示・非表示、確認モーダル、色分けを慎重に扱う。
- PWA と GitHub Pages のサブパスは壊れやすい。manifest、Service Worker、asset path はまとめて検証する。
- 公式ゲームに近い題材を扱うため、公式カードデータや公式イラストの扱いは常に慎重にする。
