# 画像アセット作成メモ

最終更新日: 2026-05-25

このメモは、後続で `imagegen` skill を使って作る画像の方針をまとめる。初期実装では画像なしでも遊べる UI を優先し、PWA アイコンだけは自前生成 PNG を使う。

## 優先して生成したい画像

| 優先 | パス | 用途 | 目安 |
|---|---|---|---|
| 1 | `public/illustrations/dog-detective.png` | ヒーロー左側の親役サポートキャラクター | 512x512 PNG |
| 2 | `public/illustrations/cat-notekeeper.png` | ヒーロー右側や調査フェイズの観察キャラクター | 512x512 PNG |
| 3 | `public/illustrations/lock-secret.png` | 親専用カードの秘匿アイコン | 512x512 PNG |
| 4 | `public/illustrations/decor-star.png` | 背景の控えめな装飾 | 256x256 PNG |
| 5 | `public/illustrations/decor-heart.png` | 背景の控えめな装飾 | 256x256 PNG |

## 生成プロンプト方針

- 絵本風のやわらかい線画と塗り。
- 線色は `#3D2E1F` に近い濃い茶色。
- 塗りは `cream / leaf / sun / rose / sky` のパレットに寄せる。
- 公式カード、公式ロゴ、公式イラストを模倣しない。
- 背景透過 PNG を優先し、UI 上では画像がなくても崩れない余白を保つ。
