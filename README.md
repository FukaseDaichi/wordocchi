# wordocchi

アークライト『ワードッチ』を遊ぶ親プレイヤー向けの、非公式進行補助ツールです。単一画面で、ヒミツのキジュン選択、3ワード提示、調査タイマー、決選案内、キジュン公開まで進行できます。

## Development

```bash
npm install
npm run generate:icons
npm run dev
```

ローカルでは <http://localhost:3000> を開きます。

## Checks

```bash
npm run lint
npm test
npm run build
```

GitHub Pages のプロジェクトサイトとしてビルドする場合は、`NEXT_PUBLIC_BASE_PATH=/wordocchi` を指定します。
