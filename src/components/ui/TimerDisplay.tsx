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

  return (
    <div className="flex flex-col items-center justify-center py-5 text-center">
      <div className="flex items-center gap-2 text-sm font-bold text-ink-600">
        <ClockIcon className="h-5 w-5" aria-hidden="true" />
        <span>のこり時間</span>
      </div>
      <span
        className={cn(
          "mt-2 font-rounded text-6xl font-black leading-none tabular-nums sm:text-8xl",
          isUrgent ? "animate-pulse text-rose-500 motion-reduce:animate-none" : "text-ink-900",
        )}
        aria-live="polite"
      >
        {formatSeconds(remainingSeconds)}
      </span>
      <div
        className="mt-5 h-3 w-full overflow-hidden rounded-full bg-cream-200"
        aria-hidden="true"
      >
        <div
          className={cn("h-full rounded-full", isUrgent ? "bg-rose-500" : "bg-leaf-500")}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
