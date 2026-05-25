import { CalendarClockIcon, ClockIcon, SparklesIcon } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { Round } from "@/features/round/round-types";
import { formatSeconds, secondsToMinutesLabel } from "@/features/timer/timer-utils";

type RevealPanelProps = {
  readonly round: Round;
};

export function RevealPanel({ round }: RevealPanelProps) {
  return (
    <div className="grid gap-4">
      <Card tone="accent" className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sun-400 text-ink-900 shadow-card">
          <SparklesIcon className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm font-bold text-ink-600">ヒミツのキジュン</p>
        <p className="mt-2 font-rounded text-2xl font-extrabold leading-snug text-rose-500 sm:text-3xl">
          {round.secretCriterion?.text ?? "キジュンは未選択です"}
        </p>
      </Card>

      <Card>
        <h3 className="font-rounded text-lg font-bold text-ink-900">今回の3ワード</h3>
        <ol className="mt-3 grid gap-2">
          {round.promptWords.map((word, index) => (
            <li
              key={word.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-cream-200 px-4 py-3"
            >
              <span className="text-sm font-bold text-ink-600">ワード {index + 1}</span>
              <span className="break-words text-right font-rounded text-lg font-extrabold text-ink-900">
                {word.text}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card as="div" className="flex items-center gap-3">
          <ClockIcon className="h-6 w-6 shrink-0 text-leaf-600" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold text-ink-600">タイマー設定</p>
            <p className="font-rounded text-lg font-extrabold text-ink-900">
              {secondsToMinutesLabel(round.timerSeconds)}
            </p>
          </div>
        </Card>
        <Card as="div" className="flex items-center gap-3">
          <CalendarClockIcon className="h-6 w-6 shrink-0 text-sky-500" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold text-ink-600">実際の残り時間</p>
            <p className="font-rounded text-lg font-extrabold text-ink-900">
              {formatSeconds(round.timerRemainingSeconds)}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
