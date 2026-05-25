import {
  ClockIcon,
  EyeIcon,
  LockKeyholeIcon,
  MessagesSquareIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react";

export type RuleStep = {
  readonly id: string;
  readonly heading: string;
  readonly body: string;
  readonly icon: LucideIcon;
  readonly accent: "sun" | "rose" | "sky" | "leaf";
};

export const ruleSteps: readonly RuleStep[] = [
  {
    id: "what",
    heading: "ワードッチってどんなあそび？",
    body: "親だけが知っているヒミツのキジュンに、3つのワードのうちどれが一番近いかを子どもたちが話し合いながら探していく会話あそびです。",
    icon: SparklesIcon,
    accent: "sun",
  },
  {
    id: "parent",
    heading: "親のやくわり",
    body: "親はキジュンを選び、3つのワードを声に出して子に伝えます。話し合いを聞きながらタイマーで進行をサポートします。",
    icon: MessagesSquareIcon,
    accent: "sky",
  },
  {
    id: "pick",
    heading: "キジュンを2つから選ぼう",
    body: "2つの候補から今回のヒミツのキジュンを1つ選びます。選ばなかったほうは伏せたままで、子には見せません。",
    icon: LockKeyholeIcon,
    accent: "rose",
  },
  {
    id: "timer",
    heading: "タイマーで話し合おう",
    body: "3〜10分のあいだに、子どもたちが3つのワードから1つを話し合いで選びます。途中でやめたいときは「終了」を押すとすぐに決選フェイズへ。",
    icon: ClockIcon,
    accent: "leaf",
  },
  {
    id: "reveal",
    heading: "キジュンを公開して感想戦",
    body: "タイマーが終わったら、親がヒミツのキジュンを公開します。みんなでどこで気づいたかを話して、感想戦を楽しみましょう。",
    icon: EyeIcon,
    accent: "sun",
  },
];
