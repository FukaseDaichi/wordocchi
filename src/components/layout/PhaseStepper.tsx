"use client";

import { CheckIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import type { RoundPhase } from "@/features/round/round-types";
import { cn } from "@/lib/cn";

type StepDef = {
  readonly id: RoundPhase;
  readonly short: string;
  readonly full: string;
};

const STEPS: readonly StepDef[] = [
  { id: "setup", short: "準備", full: "新しいラウンドを準備する" },
  { id: "secretSelection", short: "キジュン", full: "ヒミツのキジュンを選ぶ" },
  { id: "wordPrompt", short: "ワード", full: "3つのワードを伝える" },
  { id: "timedInvestigation", short: "調査", full: "タイマーで話し合う" },
  { id: "finalGuide", short: "決選", full: "最後のワードを選ぶ" },
  { id: "reveal", short: "公開", full: "キジュンを公開する" },
] as const;

type StepState = "done" | "active" | "todo";

function getActiveIndex(phase: RoundPhase): number {
  return STEPS.findIndex((step) => step.id === (phase === "done" ? "reveal" : phase));
}

function getStepState(phase: RoundPhase, index: number): StepState {
  const currentIndex = getActiveIndex(phase);

  if (currentIndex === -1) {
    return "todo";
  }

  if (index < currentIndex) {
    return "done";
  }

  if (index === currentIndex) {
    return "active";
  }

  return "todo";
}

type PhaseStepperProps = {
  readonly phase: RoundPhase;
};

export function PhaseStepper({ phase }: PhaseStepperProps) {
  const activeRef = useRef<HTMLLIElement>(null);
  const activeIndex = getActiveIndex(phase);
  const progressPercent =
    activeIndex >= 0 ? Math.max(0, (activeIndex / (STEPS.length - 1)) * 100) : 0;

  useEffect(() => {
    const node = activeRef.current;

    if (!node) {
      return;
    }

    node.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [phase]);

  return (
    <nav
      aria-label="進行ステップ"
      className="sticky top-[3rem] z-20 border-b border-border-200/60 bg-cream-50/85 px-3 pt-2 pb-2.5 backdrop-blur"
    >
      <div className="mx-auto max-w-screen-sm lg:max-w-5xl">
        <div className="mb-2 flex items-center gap-3 px-1">
          <span className="text-[11px] font-rounded font-extrabold uppercase tracking-[0.18em] text-ink-400">
            Phase {Math.max(1, activeIndex + 1)} / {STEPS.length}
          </span>
          <div
            className="relative h-1 flex-1 overflow-hidden rounded-full bg-border-200/80"
            aria-hidden="true"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-leaf-500 via-sun-400 to-rose-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <ol className="flex items-center gap-1 overflow-x-auto scrollbar-none lg:justify-center">
          {STEPS.map((step, index) => {
            const state = getStepState(phase, index);
            const isLast = index === STEPS.length - 1;

            return (
              <li
                key={step.id}
                ref={state === "active" ? activeRef : null}
                className="flex shrink-0 items-center gap-1"
                aria-current={state === "active" ? "step" : undefined}
              >
                <StepNode index={index + 1} label={step.short} state={state} fullLabel={step.full} />
                {!isLast && <StepConnector state={getStepState(phase, index + 1)} />}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

function StepNode({
  index,
  label,
  state,
  fullLabel,
}: {
  readonly index: number;
  readonly label: string;
  readonly state: StepState;
  readonly fullLabel: string;
}) {
  return (
    <div className="flex items-center gap-1.5 pr-0.5" title={fullLabel}>
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-rounded font-extrabold transition",
          state === "done" && "bg-leaf-500 text-white shadow-card",
          state === "active" &&
            "bg-sun-400 text-ink-900 shadow-pop ring-4 ring-sun-400/30 animate-[pop_300ms_ease-out]",
          state === "todo" && "border-2 border-border-200 bg-cream-100 text-ink-400",
        )}
        aria-hidden="true"
      >
        {state === "done" ? <CheckIcon className="h-3.5 w-3.5" /> : index}
      </span>
      <span
        className={cn(
          "whitespace-nowrap text-[11px] font-rounded font-bold",
          state === "done" && "text-leaf-600",
          state === "active" && "text-ink-900",
          state === "todo" && "text-ink-400",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function StepConnector({ state }: { readonly state: StepState }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "h-[3px] w-5 rounded-full transition",
        state === "done" || state === "active" ? "bg-leaf-500" : "bg-border-200",
      )}
    />
  );
}
