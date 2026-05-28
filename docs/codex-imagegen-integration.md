# Codex 画像生成連携の調査

最終更新日: 2026-05-28
対象: ワードッチ親向け進行補助ツール
ステータス: 調査のみ（未実装）。本ドキュメントは「Codex を画像生成のときだけ呼ぶ」運用が可能かを検討した結果をまとめる。導入の意思決定後に別途実装する。

## 結論（要約）

- 「Codex を画像生成のときだけ呼ぶ」運用は **可能**。ただし実現方法によって精度・手間・課金が大きく変わる。
- ユーザーが挙げた `openai/codex-plugin-cc` は **画像生成用ではない**。コードレビュー / タスク委譲が目的で、画像生成コマンドを持たない。さらに `codex:codex-rescue` サブエージェントは「Claude が詰まったときに自動で Codex を呼ぶ」設計なので、**画像以外でも Codex が発火**しやすく、「画像のときだけ」という意図と逆向き。本目的には不向き。
- 「画像のときだけ」を素直に満たす選択肢は次の2つ。
  - **(推奨A) 自作のプロジェクトローカル Skill**: `.claude/skills/` に置く小さな SKILL.md ＋ `codex exec "@imagegen ..."` 呼び出し。発火条件・出力先・配色を本リポジトリの方針（[image-assets-plan.md](image-assets-plan.md)）に固定でき、レビュー可能で版管理に乗る。
  - **(推奨B) 専用プラグイン `colin-automates/Codex-ImageGen--Claude-Code`**: 画像生成専用。MCP サーバ経由で `codex exec @imagegen` を叩く。導入が最速だが第三者製で、広域トリガで自動発火する点と `--sandbox danger-full-access` の挙動に注意。
- 「Skill か MCP か」は二者択一ではない。**いつ呼ぶか=Skill（トリガ）、どう実行するか=Bash か MCP、配布形態=Plugin** と層が違う。本目的の肝は「Skill のトリガ範囲を画像に限定する」こと。
- 重要な課金分岐: Codex の `imagegen` には2経路ある。**ChatGPT プラン経由（API キー不要・モデル非固定・透過はクロマキー）** と **API キー経由（`gpt-image-2` 固定・ネイティブ透過）**。後者は本リポジトリの「`gpt-image-2` 固定」「背景透過 PNG 優先」と整合するが **API 課金が発生** する。前者は無料枠だが gpt-image-2 を保証しない。導入前にどちらを使うか決める必要がある。

## 背景 / やりたいこと

- 本ツールの画像は後続フェイズで生成する方針（[image-assets-plan.md](image-assets-plan.md)）。生成対象・配色・出力先は定義済み。
- AGENT.md は「画像生成が必要な場合は `image_gen` を使い、モデル指定可能なら `gpt-image-2` に固定」「失敗時は中断してユーザーに報告、勝手に代替へ切替えない」。
- [implementation-rules.md](implementation-rules.md):45 は「原則として Codex の `imagegen` skill を利用して生成する」。
- やりたいのは、Claude Code を主作業エージェントとしつつ、**画像を出すときだけ Codex（の gpt-image）に委譲**する運用。

## 前提: Claude Code 拡張の3層（Skill / MCP / Plugin）

| 層 | 役割 | 本目的での使いどころ |
|---|---|---|
| **Skill** | 「こういうときはこうする」という手順・判断を Claude に教える。`SKILL.md` の `description` にモデルが自動マッチして発火。 | **いつ Codex を呼ぶか**（=画像が必要なときだけ）の判定を担う中心。トリガ範囲はここで絞る。 |
| **MCP サーバ** | 外部システムへの接続を構造化ツールとして公開（Claude が tool として呼ぶ）。 | **どう実行するか** の一案。`codex exec` をラップしてパス返却や権限事前承認を綺麗にできる。Bash 直叩きでも代替可能。 |
| **Plugin** | 上記（Skill / MCP / hooks / slash コマンド）をまとめて配布する束。marketplace でインストール。 | **配布・パッケージング**。中身が Skill+MCP なだけで、新しい能力ではない。 |

要点: 「画像のときだけ」を決めるのは Skill のトリガ設計。MCP か Bash かは実行手段の違い。Plugin は梱包方法。

## Codex 側の画像生成の実体

- Codex CLI には組み込みの `imagegen` skill があり、`@imagegen <プロンプト>` で起動する。
- 2経路がある（[公式 SKILL.md](https://github.com/openai/codex/blob/main/codex-rs/skills/src/assets/samples/imagegen/SKILL.md)）。

| 経路 | 認証 | モデル | 透過 | 課金 |
|---|---|---|---|---|
| 組み込み `image_gen`（既定） | 不要（Codex ログイン= ChatGPT プラン） | 既定モデル（**gpt-image-2 を保証しない**） | クロマキー除去 | ChatGPT プランの利用枠を消費 |
| CLI フォールバック `scripts/image_gen.py` | `OPENAI_API_KEY` 必須 | **`gpt-image-2` 既定**（透過用に `gpt-image-1.5` 可） | ネイティブ透過 | OpenAI API の従量課金 |

- 既定の保存先は `$CODEX_HOME/generated_images/`。プロジェクト用は後でワークスペースへ移動。
- 生成は **1枚 30〜90 秒**、テキスト往復より **Codex 利用枠を約3〜5倍速く消費**。
- gpt-image-2 は 2026-04-21 リリースで、Codex CLI の既定モデル。

## 選択肢の比較

### A. 自作のプロジェクトローカル Skill（推奨／本命）

`.claude/skills/wordocchi-imagegen/SKILL.md` を本リポジトリに置き、`description` を「ワードッチの挿絵・アイコン・ヒーロー等の PNG アセットを生成するとき」に限定。中身は `codex exec "@imagegen ... Save to public/illustrations/..."` を呼ぶスクリプト。

- 長所
  - 発火条件を本プロジェクトに精密に限定できる（「画像のときだけ」を素直に満たす）。
  - 配色・線色・出力パス・命名規則を [image-assets-plan.md](image-assets-plan.md) に合わせて固定でき、版管理・レビュー可能。
  - 第三者プラグインの保守リスクに依存しない。ドキュメント駆動の本リポジトリ方針と相性が良い。
- 短所
  - 自分で保守する（`codex exec` 呼び出し、保存パス回収、失敗時ハンドリングを書く）。
  - 前提として Codex CLI とログインが必要。

### B. 専用プラグイン `colin-automates/Codex-ImageGen--Claude-Code`（最速）

画像生成専用の第三者プラグイン。仕組みは「広域トリガ SKILL ＋ MCP サーバ（`generate_image` / `edit_image` / `generate_image_set`）が `codex exec --sandbox danger-full-access ... @imagegen` を spawn」。ChatGPT プラン課金（API キー不要）。

```
/plugin marketplace add github.com/colin-automates/Codex-ImageGen--Claude-Code
/plugin install imagegen@imagegen-marketplace
/imagegen:setup
```

- 長所
  - 目的に直結。導入即運用。`/imagegen "..."`・`/imagegen:edit` の明示実行と、画像が要るときの自動発火の両方。
  - 複数枚要求を `generate_image_set` に自動ルーティング（配色一貫＆枠消費節約）。
  - MCP ツールを事前承認する `settings.json` 同梱（毎回の許可プロンプト回避）。
- 短所
  - 第三者製・保守と互換性のリスク（バージョン固定や監査を検討）。
  - **広域トリガ**で自動発火するため、本リポジトリの「画像生成は初期実装後」「勝手に代替へ切替えない」方針と擦り合わせが必要。
  - `--sandbox danger-full-access`（フルディスクアクセス）で `codex exec` する。ローカル個人ツールなら許容範囲だが要認識。
  - 既定の組み込み経路のため **gpt-image-2 を保証しない**（AGENT.md の固定要件と要調整）。

### C. 公式 `openai/codex-plugin-cc`（本目的には不向き）

- 提供物は `/codex:review`・`/codex:adversarial-review`・`/codex:rescue`・`/codex:status`・`/codex:result`・`/codex:cancel` と `codex:codex-rescue` サブエージェント。**画像コマンドは無い**。
- `/codex:rescue "画像を @imagegen で生成して public/illustrations/... に保存"` のように委譲すれば画像生成自体は不可能ではないが、自動でも限定でもなく、プラグインの主目的（レビュー・救援）と無関係。
- `codex-rescue` は自動発火しうるため「画像のときだけ」と逆。コードレビューにも Codex を併用したい場合に B/A と併設する価値はあるが、本目的単独では選ばない。

### D. 自作 MCP サーバ（過剰）

- 複数プロジェクト横断で再利用したい場合のみ妥当。単一ツールの個人用途には複雑すぎる。今回は不要。

### 比較表

| 観点 | A 自作Skill | B colin専用 | C codex-plugin-cc | D 自作MCP |
|---|---|---|---|---|
| 「画像のときだけ」適合 | ◎ | ○（広域トリガ要調整） | △（逆向き） | ○ |
| 導入の速さ | △（自作） | ◎ | ○ | ✗ |
| 発火範囲の制御 | ◎ | △ | ✗ | ◎ |
| 本リポジトリ方針との整合 | ◎ | △ | △ | ○ |
| 保守負担 | 中（自前） | 低（他者依存） | 低 | 高 |
| gpt-image-2 固定 | 経路選択で可 | ✗(既定) | ✗ | 経路選択で可 |
| 課金 | 経路次第 | ChatGPTプラン | ChatGPTプラン | 経路次第 |

## 「画像のときだけ呼ぶ」をどう実現するか

1. **トリガ（いつ）= Skill**。`description` を「ワードッチの挿絵/アイコン/ヒーロー/空状態/背景装飾の PNG を生成・編集するとき」に絞り、非対象（lucide のアイコン、データからのグラフ、スクショ、`SVG only`/`画像なし` 指示時）を明記する。これが「画像のときだけ」の本体。
2. **実行（どう）= Bash か MCP**。最小は `codex exec "@imagegen ..."` を Bash で呼ぶ。MCP なら権限事前承認とパス回収が綺麗。
3. **配布（どう配る）= Plugin かリポジトリ同梱**。本リポジトリは同梱（`.claude/`）でレビュー可能にするのが方針に合う。

## 推奨アーキテクチャ

- 既定線: **Codex CLI はグローバル導入**し、**トリガ判定はプロジェクトローカルの Skill** に置く（A）。理由は「画像のときだけ」を精密に守れ、配色・パス・命名を版管理でき、第三者保守に依存しないため。
- 速攻で試すなら **B（colin 専用プラグイン）をユーザーレベル導入**し、発火を絞るルール（後述の方針整合）を `.claude/` に補う。検証後に A へ寄せる判断もできる。
- コードレビューにも Codex を使いたくなったら **C を併設**（画像は A/B、レビューは C）。役割を分ければ「画像のときだけ」を崩さない。

## 気を付けるべきポイント

1. **codex-plugin-cc ≠ 画像生成**。ユーザーが挙げたコマンド列が入れるのはコード委譲プラグイン。画像目的には別物が必要。
2. **課金経路の選択**。ChatGPT プラン経由（無料枠・API キー不要だが gpt-image-2 非保証・透過はクロマキー）か、API キー経由（gpt-image-2 固定・ネイティブ透過だが従量課金）か。**AGENT.md の「gpt-image-2 固定」と image-assets-plan.md の「背景透過 PNG 優先」は後者（API キー経路）寄り**、「課金ゼロ」は前者寄り。両立しないので先に方針決定が必要。
3. **利用枠の消費**。画像はテキストの3〜5倍速く枠を消費、1枚30〜90秒。6枚生成で日次枠を大きく削りうる。一括生成はペース配分を。
4. **Windows 前提の検証**（本環境は Windows 11 / PowerShell）。
   - グローバル npm 導入（`npm i -g @openai/codex`）は管理者権限が要る場合あり。
   - Codex 認証は `C:\Users\119003\.codex\auth.json`。`codex login` で作成。
   - `--sandbox danger-full-access` 等のサンドボックス挙動は OS 差があるため要実機確認。
5. **サンドボックス/セキュリティ**。colin プラグインはフルディスクアクセスで `codex exec` する。生成物の保存先と書き込み範囲を把握する。
6. **本リポジトリ方針との整合**。
   - AGENT.md「失敗時は中断してユーザーに報告、勝手に再試行・代替へ切替えない」→ 自動発火・自動フォールバックする実装は方針と衝突しうる。失敗時はユーザー報告で止める設計にする。
   - 「画像生成は初期実装後」→ 常時自動発火は早すぎる発火を招く。明示コマンド主体にするか、トリガを強めに絞る。
7. **静的エクスポート/PWA とは非干渉**。これは **オーサリング時（開発時）のツール**で、アプリ実行時には関与しない。生成 PNG が `public/` に置かれるだけで、static export / GitHub Pages / Service Worker の制約に新たな影響はない。
8. **非決定性**。生成結果は毎回変わる。確定後の PNG をコミットして再現性を担保（[image-assets-plan.md](image-assets-plan.md) の方針どおり）。Skill/プラグインはビルド成果物ではなく制作補助。
9. **公式 IP の非模倣**。プロンプトに公式カード・ロゴ・イラストを混ぜない（既存方針の継続）。

## グローバル vs プロジェクトインストール

| 対象 | 推奨スコープ | 理由 |
|---|---|---|
| Codex CLI 本体 | **グローバル**（`npm i -g @openai/codex`） | OS 共通の道具。認証も `~/.codex` でグローバル。 |
| トリガ Skill（A 案） | **プロジェクトローカル**（`.claude/skills/`、リポジトリ同梱） | 配色・出力先・発火範囲をワードッチ専用に固定し、版管理・レビューに乗せたい。 |
| 専用プラグイン（B 案） | ユーザーレベル導入も可 | 複数プロジェクトで使い回すなら user スコープ。本リポジトリ専用に絞るなら発火制御を `.claude/` で補う。 |

## 既存ドキュメントとの不整合（要調整）

導入を決める際、次のドリフトを揃える。

- AGENT.md は「`image_gen`／`gpt-image-2` 固定」、[implementation-rules.md](implementation-rules.md):45 は「Codex の `imagegen` skill」。**ツール名と経路の表現が不一致**。
- 「gpt-image-2 固定」「透過 PNG 優先」を厳守するなら API キー経路（課金あり）。ChatGPT プラン経路を採るなら、この2要件を緩める旨を両ドキュメントに明記する必要がある。
- 採用方式（A/B/C）を決めたら、AGENT.md「画像生成」節と implementation-rules.md「画像・ビジュアル素材」節を同じ表現に更新する。

## 次のアクション候補（未実施）

1. 課金経路を決める（ChatGPT プラン無料枠 か API キー従量 か）。これが方式選択の前提。
2. 方式を選ぶ（A 自作 Skill 推奨 / B 専用プラグイン最速 / C は画像目的では非推奨）。
3. Windows 実機で Codex CLI 導入・`codex login`・`@imagegen` の1枚生成を検証（前提確認）。
4. 採用後、AGENT.md と implementation-rules.md の表現を統一。
5. A 案なら `.claude/skills/wordocchi-imagegen/` を作成（発火範囲・配色・出力先を image-assets-plan.md に固定）。

## 参考リンク

- [openai/codex-plugin-cc（コード委譲・レビュー用。画像非対応）](https://github.com/openai/codex-plugin-cc)
- [colin-automates/Codex-ImageGen--Claude-Code（画像生成専用プラグイン）](https://github.com/colin-automates/Codex-ImageGen--Claude-Code)
- [Codex 公式 imagegen SKILL.md](https://github.com/openai/codex/blob/main/codex-rs/skills/src/assets/samples/imagegen/SKILL.md)
- [Codex CLI の画像生成（gpt-image-2 / $imagegen 解説）](https://codex.danielvaughan.com/2026/04/27/codex-cli-image-generation-gpt-image-2-visual-development-workflows/)
- [Codex の image_gen を /codex-image:* スキルとして橋渡しする手法](https://dev.to/kinggyusuh/bridging-codexs-imagegen-tool-into-claude-code-as-codex-image-skills-5d72)
- [Claude Code: Skills vs MCP vs Plugins の使い分け](https://www.morphllm.com/claude-code-skills-mcp-plugins)
- [Claude Code 公式: Extend Claude Code](https://code.claude.com/docs/en/features-overview)
