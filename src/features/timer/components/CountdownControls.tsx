import { PauseIcon, PlayIcon, RotateCcwIcon, StopCircleIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import type { TimerStatus } from "@/features/round/round-types";

type CountdownControlsProps = {
  readonly status: TimerStatus;
  readonly remainingSeconds: number;
  readonly onStart: () => void;
  readonly onPause: () => void;
  readonly onResume: () => void;
  readonly onReset: () => void;
  readonly onEnd: () => void;
};

type ControlButtonProps = {
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly intent?: "primary" | "secondary" | "danger";
};

function ControlButton({
  label,
  icon,
  onClick,
  disabled,
  intent = "secondary",
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "tap-highlight-none flex h-16 flex-col items-center justify-center gap-1 rounded-2xl font-rounded text-sm font-bold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
        intent === "primary" && "bg-leaf-500 text-white shadow-cta hover:bg-leaf-600",
        intent === "secondary" && "bg-cream-100 text-ink-900 shadow-card hover:bg-cream-200",
        intent === "danger" &&
          "border-2 border-dashed border-rose-400 bg-rose-100 text-danger-500 hover:bg-rose-100/70",
      )}
    >
      <span className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

export function CountdownControls({
  status,
  remainingSeconds,
  onStart,
  onPause,
  onResume,
  onReset,
  onEnd,
}: CountdownControlsProps) {
  const canRun = remainingSeconds > 0;
  const primary =
    status === "running"
      ? {
          label: "一時停止",
          icon: <PauseIcon className="h-6 w-6" />,
          onClick: onPause,
          intent: "primary" as const,
        }
      : status === "paused"
        ? {
            label: "再開する",
            icon: <PlayIcon className="h-6 w-6" />,
            onClick: onResume,
            intent: "primary" as const,
          }
        : {
            label: "開始する",
            icon: <PlayIcon className="h-6 w-6" />,
            onClick: onStart,
            intent: "primary" as const,
            disabled: !canRun,
          };

  return (
    <div className="grid grid-cols-3 gap-2">
      <ControlButton
        label={primary.label}
        icon={primary.icon}
        onClick={primary.onClick}
        intent={primary.intent}
        disabled={"disabled" in primary ? primary.disabled : false}
      />
      <ControlButton
        label="リセット"
        icon={<RotateCcwIcon className="h-6 w-6" />}
        onClick={onReset}
        intent="secondary"
      />
      <ControlButton
        label="終了"
        icon={<StopCircleIcon className="h-6 w-6" />}
        onClick={onEnd}
        intent="danger"
      />
    </div>
  );
}
