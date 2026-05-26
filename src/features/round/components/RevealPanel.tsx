import { CalendarClockIcon, ClockIcon, KeyRoundIcon, SparklesIcon } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { Round } from "@/features/round/round-types";
import { formatSeconds, secondsToMinutesLabel } from "@/features/timer/timer-utils";

type RevealPanelProps = {
  readonly round: Round;
};

export function RevealPanel({ round }: RevealPanelProps) {
  return (
    <div className="grid gap-4">
      <section
        className="relative overflow-hidden rounded-3xl border-2 border-dashed border-rose-400 bg-gradient-to-br from-cream-200 via-rose-100 to-cream-200 p-6 text-center shadow-pop"
        aria-label="ヒミツのキジュン公開"
      >
        <span
          className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-sun-400/20"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute -bottom-10 -right-6 h-36 w-36 rounded-full bg-rose-500/15"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1 font-rounded text-xs font-extrabold uppercase tracking-[0.18em] text-white">
            <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
            正解はこちら
          </div>
          <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-50 text-rose-500 shadow-card">
            <KeyRoundIcon className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-ink-600">
            ヒミツのキジュン
          </p>
          <p className="mt-2 font-rounded text-3xl font-black leading-snug text-rose-500 sm:text-4xl">
            {round.secretCriterion?.text ?? "キジュンは未選択です"}
          </p>
        </div>
      </section>

      <Card phaseTone="leaf">
        <h3 className="font-rounded text-lg font-bold text-ink-900">今回の3ワード</h3>
        <ol className="mt-3 grid gap-2">
          {round.promptWords.map((word, index) => (
            <li
              key={word.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-cream-200 px-4 py-3"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-50 font-rounded text-xs font-extrabold text-ink-900 shadow-card">
                  {index + 1}
                </span>
                <span className="text-xs font-bold text-ink-600">ワード</span>
              </span>
              <span className="break-words text-right font-rounded text-lg font-extrabold text-ink-900">
                {word.text}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card as="div" className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-600">
            <ClockIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold text-ink-600">タイマー設定</p>
            <p className="font-rounded text-lg font-extrabold text-ink-900">
              {secondsToMinutesLabel(round.timerSeconds)}
            </p>
          </div>
        </Card>
        <Card as="div" className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-500">
            <CalendarClockIcon className="h-5 w-5" aria-hidden="true" />
          </span>
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
