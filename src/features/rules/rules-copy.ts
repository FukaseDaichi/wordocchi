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
    body: "親だけが知っているヒミツのキジュンに一番合う言葉を、子どもたちが親の判定をヒントに探していく会話あそびです。",
    illustration: {
      src: "/rules/what.png",
      alt: "ヒミツのキジュンをヒントに言葉を探す子どもたちのイラスト",
    },
    accent: "sun",
  },
  {
    id: "parent",
    heading: "親のやくわり",
    body: "親はキジュンを選び、最初の暫定チャンピオンになるワードを1つ読み上げます。子が出すワードと比べて、近いほうを判定します。",
    illustration: {
      src: "/rules/parent.png",
      alt: "親が2つのワードを比べて判定しているイラスト",
    },
    accent: "sky",
  },
  {
    id: "pick",
    heading: "キジュンを2つから選ぼう",
    body: "親は2つの候補から今回のヒミツのキジュンを1つ選びます。選ばなかったほうも含めて、子にはラウンド終了まで見せません。",
    illustration: {
      src: "/rules/pick.png",
      alt: "親が2枚のカードからヒミツのキジュンを選ぶイラスト",
    },
    accent: "rose",
  },
  {
    id: "timer",
    heading: "タイマーで調査しよう",
    body: "制限時間のあいだ、子は思いついたワードを出します。親は暫定チャンピオンと比べ、勝ったワードを新しいチャンピオンにします。",
    illustration: {
      src: "/rules/timer.png",
      alt: "タイマーを見ながらワードを出して比べる調査フェイズのイラスト",
    },
    accent: "leaf",
  },
  {
    id: "reveal",
    heading: "決選してキジュンを公開",
    body: "決選では、子どもたちがまだ出ていない最後のワードを1つずつ発表します。親が優勝ワードを選んだら、キジュンを公開して感想戦です。",
    illustration: {
      src: "/rules/reveal.png",
      alt: "決選のワードを選んでからヒミツのキジュンを公開するイラスト",
    },
    accent: "sun",
  },
];
