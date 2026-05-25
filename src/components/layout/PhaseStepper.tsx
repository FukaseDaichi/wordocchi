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

function getStepState(phase: RoundPhase, index: number): StepState {
  const currentIndex = STEPS.findIndex(
    (step) => step.id === (phase === "done" ? "reveal" : phase),
  );

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
      className="sticky top-[3.5rem] z-20 border-b border-border-200/60 bg-cream-50/85 px-3 py-2 backdrop-blur"
    >
      <ol className="mx-auto flex max-w-screen-sm items-center gap-1 overflow-x-auto scrollbar-none lg:max-w-5xl lg:justify-center">
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
              <StepNode index={index + 1} label={step.short} state={state} />
              {!isLast && <StepConnector state={state} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepNode({
  index,
  label,
  state,
}: {
  readonly index: number;
  readonly label: string;
  readonly state: StepState;
}) {
  return (
    <div className="flex items-center gap-2 pr-1">
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-rounded font-extrabold transition",
          state === "done" && "bg-leaf-500 text-white shadow-card",
          state === "active" &&
            "bg-sun-400 text-ink-900 shadow-card ring-4 ring-sun-400/30 animate-[pop_300ms_ease-out]",
          state === "todo" && "border-2 border-border-200 bg-cream-100 text-ink-400",
        )}
        aria-hidden="true"
      >
        {state === "done" ? <CheckIcon className="h-4 w-4" /> : index}
      </span>
      <span
        className={cn(
          "whitespace-nowrap text-xs font-rounded font-bold",
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
        "h-0.5 w-6 rounded-full transition",
        state === "done" ? "bg-leaf-500" : "bg-border-200",
      )}
    />
  );
}
