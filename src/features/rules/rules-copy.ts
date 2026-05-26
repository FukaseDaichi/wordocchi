export type RuleStep = {
  readonly id: string;
  readonly heading: string;
  readonly body: string;
  readonly illustration: {
    readonly src: string;
    readonly alt: string;
  };
  readonly accent: "sun" | "rose" | "sky" | "leaf";
};

export const ruleSteps: readonly RuleStep[] = [
  {
    id: "what",
    heading: "ワードッチってどんなあそび？",
    body: "親だけが知っているヒミツのキジュンに一番合う言葉を、みんなで探していく会話あそびです。親の判定をヒントに、どんな言葉が強いかを考えます。",
    illustration: {
      src: "/rules/what.png",
      alt: "ヒミツのキジュンをヒントに言葉を探す子どもたちのイラスト",
    },
    accent: "sun",
  },
  {
    id: "pick",
    heading: "キジュンを2つから選ぼう",
    body: "親は2つの候補から今回のヒミツのキジュンを1つ選びます。選ばなかったほうも含めて、ゲーム終了まで子には公開しません。",
    illustration: {
      src: "/rules/pick.png",
      alt: "親が2枚のカードからヒミツのキジュンを選ぶイラスト",
    },
    accent: "rose",
  },
  {
    id: "champion",
    heading: "暫定チャンピオンを読み上げよう",
    body: "親は3つの単語から、ヒミツのキジュンにもっとも近いと思うものを1つ選びます。その単語を暫定チャンピオンとして、みんなに宣言します。",
    illustration: {
      src: "/rules/parent.png",
      alt: "親が暫定チャンピオンのワードを宣言しているイラスト",
    },
    accent: "sky",
  },
  {
    id: "search",
    heading: "暫定チャンピオン候補を探そう",
    body: "子は順番に、思いついたワードを出します。親はそのワードを暫定チャンピオンと比べ、勝ったワードを新しいチャンピオンにします。",
    illustration: {
      src: "/rules/timer.png",
      alt: "タイマーを見ながらワードを出して比べる調査フェイズのイラスト",
    },
    accent: "leaf",
  },
  {
    id: "final",
    heading: "チャンピオンを決めよう",
    body: "決選では、子どもたちがまだ出ていない最後のワードを1つずつ発表します。親はヒミツのキジュンに一番合う優勝ワードを選び、最後にキジュンを公開します。",
    illustration: {
      src: "/rules/reveal.png",
      alt: "決選のワードを選んでからヒミツのキジュンを公開するイラスト",
    },
    accent: "sun",
  },
];
