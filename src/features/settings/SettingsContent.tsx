import { CheckIcon, TimerIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { TIMER_OPTIONS_SECONDS } from "@/lib/constants";

type TimerOption = {
  readonly value: number;
  readonly minutes: number;
  readonly title: string;
  readonly subtitle: string;
  readonly tone: TimerTone;
};

type TimerTone = "sun" | "leaf" | "sky" | "rose";

const timerOptions: readonly TimerOption[] = [
  { value: 3 * 60, minutes: 3, title: "3分", subtitle: "サクッと一勝負", tone: "sun" },
  { value: 5 * 60, minutes: 5, title: "5分", subtitle: "ちょうどよい長さ", tone: "leaf" },
  { value: 7 * 60, minutes: 7, title: "7分", subtitle: "じっくり話し合う", tone: "sky" },
  { value: 10 * 60, minutes: 10, title: "10分", subtitle: "たっぷりゆったり", tone: "rose" },
];

const TIMER_MAX_MINUTES = 10;

type SettingsContentProps = {
  readonly defaultTimerSeconds: number;
  readonly onChangeTimer: (seconds: number) => void;
};

export function SettingsContent({
  defaultTimerSeconds,
  onChangeTimer,
}: SettingsContentProps) {
  const knownValues = new Set<number>(TIMER_OPTIONS_SECONDS);
  const safeSelected = knownValues.has(defaultTimerSeconds)
    ? defaultTimerSeconds
    : TIMER_OPTIONS_SECONDS[1];

  return (
    <div className="space-y-5">
      <section aria-labelledby="settings-timer-heading" className="space-y-3">
        <header className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sun-100 text-sun-400 shadow-card"
          >
            <TimerIcon className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <div>
            <h3
              id="settings-timer-heading"
              className="font-rounded text-lg font-extrabold text-ink-900"
            >
              既定のタイマー
            </h3>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-600 sm:text-sm">
              ラウンドを始めたときに使う、話し合いの時間を選んでください。
            </p>
          </div>
        </header>

        <div
          role="radiogroup"
          aria-labelledby="settings-timer-heading"
          className="grid grid-cols-2 gap-3"
        >
          {timerOptions.map((option) => {
            const isSelected = option.value === safeSelected;
            return (
              <TimerOptionCard
                key={option.value}
                option={option}
                isSelected={isSelected}
                onSelect={() => onChangeTimer(option.value)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

type TimerOptionCardProps = {
  readonly option: TimerOption;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
};

function TimerOptionCard({ option, isSelected, onSelect }: TimerOptionCardProps) {
  const palette = tonePalette(option.tone);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={cn(
        "tap-highlight-none group relative flex flex-col items-center gap-2 overflow-hidden rounded-3xl px-3 py-4 text-center transition duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none",
        isSelected
          ? cn(palette.selectedBg, "text-white shadow-cta")
          : "bg-cream-100 text-ink-900 shadow-card hover:bg-cream-200",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-xl transition-opacity duration-200",
          palette.glow,
          isSelected ? "opacity-80" : "opacity-0 group-hover:opacity-40",
        )}
      />
      <DurationRing
        minutes={option.minutes}
        isSelected={isSelected}
        tone={option.tone}
      />
      <div className="relative space-y-0.5">
        <p className="font-rounded text-xl font-black leading-none sm:text-2xl">
          {option.title}
        </p>
        <p
          className={cn(
            "text-[11px] font-bold leading-tight sm:text-xs",
            isSelected ? "text-white/85" : "text-ink-600",
          )}
        >
          {option.subtitle}
        </p>
      </div>
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-2.5 top-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-leaf-500 shadow-card transition-all duration-200",
          isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        <CheckIcon className="h-3.5 w-3.5" strokeWidth={3.5} />
      </span>
    </button>
  );
}

type DurationRingProps = {
  readonly minutes: number;
  readonly isSelected: boolean;
  readonly tone: TimerTone;
};

function DurationRing({ minutes, isSelected, tone }: DurationRingProps) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, minutes / TIMER_MAX_MINUTES);
  const offset = circumference * (1 - progress);
  const palette = tonePalette(tone);

  return (
    <div
      aria-hidden="true"
      className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16"
    >
      <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          strokeWidth={5}
          className={cn(isSelected ? "stroke-white/30" : "stroke-cream-200")}
        />
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none",
            isSelected ? "stroke-white" : palette.ringStroke,
          )}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-rounded text-base font-black leading-none",
          isSelected ? "text-white" : "text-ink-900",
        )}
      >
        {minutes}
      </span>
    </div>
  );
}

function tonePalette(tone: TimerTone): {
  readonly selectedBg: string;
  readonly ringStroke: string;
  readonly glow: string;
} {
  switch (tone) {
    case "sun":
      return {
        selectedBg: "bg-sun-400",
        ringStroke: "stroke-sun-400",
        glow: "bg-sun-400/30",
      };
    case "leaf":
      return {
        selectedBg: "bg-leaf-500",
        ringStroke: "stroke-leaf-500",
        glow: "bg-leaf-500/25",
      };
    case "sky":
      return {
        selectedBg: "bg-sky-500",
        ringStroke: "stroke-sky-500",
        glow: "bg-sky-500/25",
      };
    case "rose":
    default:
      return {
        selectedBg: "bg-rose-500",
        ringStroke: "stroke-rose-500",
        glow: "bg-rose-500/25",
      };
  }
}
