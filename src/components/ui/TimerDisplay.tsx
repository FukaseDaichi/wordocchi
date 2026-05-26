import { ClockIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { formatSeconds } from "@/features/timer/timer-utils";

type TimerDisplayProps = {
  readonly remainingSeconds: number;
  readonly totalSeconds: number;
};

export function TimerDisplay({ remainingSeconds, totalSeconds }: TimerDisplayProps) {
  const isUrgent = remainingSeconds <= 60;
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, remainingSeconds / totalSeconds)) : 0;
  const radius = 88;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center py-3 text-center">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ink-600">
        <ClockIcon className="h-4 w-4" aria-hidden="true" />
        <span>のこり時間</span>
      </div>
      <div className="relative mt-3 flex h-52 w-52 items-center justify-center sm:h-60 sm:w-60">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#F0E2C8"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={isUrgent ? "#E36B6B" : "#5BA84A"}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            fill="none"
            className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
          />
        </svg>
        <div className="absolute inset-6 rounded-full bg-cream-100/60" aria-hidden="true" />
        <span
          className={cn(
            "relative font-rounded text-6xl font-black leading-none tabular-nums sm:text-7xl",
            isUrgent ? "animate-pulse text-rose-500 motion-reduce:animate-none" : "text-ink-900",
          )}
          aria-live="polite"
        >
          {formatSeconds(remainingSeconds)}
        </span>
      </div>
      {isUrgent && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-rounded font-extrabold text-rose-500">
          ラストスパート
        </p>
      )}
    </div>
  );
}
