import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { TimerStatus } from "@/features/round/round-types";

type CountdownControlsProps = {
  readonly status: TimerStatus;
  readonly remainingSeconds: number;
  readonly onStart: () => void;
  readonly onPause: () => void;
  readonly onResume: () => void;
  readonly onReset: () => void;
};

export function CountdownControls({
  status,
  remainingSeconds,
  onStart,
  onPause,
  onResume,
  onReset,
}: CountdownControlsProps) {
  const canRun = remainingSeconds > 0;
  const primaryAction =
    status === "running"
      ? { label: "一時停止", onClick: onPause, icon: <PauseIcon className="h-6 w-6" /> }
      : status === "paused"
        ? { label: "再開する", onClick: onResume, icon: <PlayIcon className="h-6 w-6" /> }
        : { label: "開始する", onClick: onStart, icon: <PlayIcon className="h-6 w-6" /> };

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <Button
        intent="primary"
        leadingIcon={primaryAction.icon}
        onClick={primaryAction.onClick}
        disabled={!canRun && status !== "running"}
      >
        {primaryAction.label}
      </Button>
      <Button
        intent="secondary"
        size="lg"
        leadingIcon={<RotateCcwIcon className="h-6 w-6" />}
        onClick={onReset}
        className="sm:w-auto"
      >
        リセット
      </Button>
    </div>
  );
}
