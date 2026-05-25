"use client";

import {
  ChevronRightIcon,
  EyeIcon,
  FastForwardIcon,
  PlayIcon,
  RotateCcwIcon,
  SparklesIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { RoundPhase } from "@/features/round/round-types";

type FooterBarProps = {
  readonly phase: RoundPhase;
  readonly canAdvance: boolean;
  readonly onRestart: () => void;
  readonly onAdvance: () => void;
};

type PrimaryActionConfig = {
  readonly label: string;
  readonly icon: ReactNode;
  readonly hint?: string;
};

const PRIMARY_ACTION: Record<RoundPhase, PrimaryActionConfig | null> = {
  setup: { label: "はじめる", icon: <PlayIcon className="h-5 w-5" /> },
  secretSelection: {
    label: "キジュンを選ぶと進めます",
    icon: <ChevronRightIcon className="h-5 w-5" />,
    hint: "上のカードから1つ選んでください",
  },
  wordPrompt: { label: "タイマー開始", icon: <PlayIcon className="h-5 w-5" /> },
  timedInvestigation: {
    label: "決選へ進む",
    icon: <FastForwardIcon className="h-5 w-5" />,
  },
  finalGuide: { label: "キジュンを公開", icon: <EyeIcon className="h-5 w-5" /> },
  reveal: { label: "もう一度遊ぶ", icon: <SparklesIcon className="h-5 w-5" /> },
  done: { label: "新しいラウンドへ", icon: <PlayIcon className="h-5 w-5" /> },
};

export function FooterBar({ phase, canAdvance, onRestart, onAdvance }: FooterBarProps) {
  const action = PRIMARY_ACTION[phase];
  const disabled = !canAdvance;

  return (
    <footer
      className="sticky bottom-0 z-30 border-t border-border-200/60 bg-cream-50/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-4px_12px_rgba(110,80,40,0.10)] backdrop-blur"
      role="contentinfo"
      aria-label="主要アクション"
    >
      <div className="mx-auto flex max-w-screen-sm items-stretch gap-3 lg:max-w-5xl">
        <button
          type="button"
          onClick={onRestart}
          className="tap-highlight-none group flex h-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl bg-cream-100 px-3 text-ink-900 shadow-card transition active:scale-[0.97] motion-reduce:transition-none"
          aria-label="新しくはじめる"
        >
          <RotateCcwIcon className="h-5 w-5 text-rose-500" aria-hidden="true" />
          <span className="text-[10px] font-rounded font-bold leading-tight">
            新しく
            <br />
            はじめる
          </span>
        </button>

        {action ? (
          <button
            type="button"
            onClick={onAdvance}
            disabled={disabled}
            className={cn(
              "tap-highlight-none group flex h-14 flex-1 items-center justify-between gap-2 rounded-2xl px-4 font-rounded font-bold transition active:scale-[0.98] motion-reduce:transition-none",
              disabled
                ? "cursor-not-allowed bg-cream-100 text-ink-400 shadow-none"
                : "bg-leaf-500 text-white shadow-cta hover:bg-leaf-600",
            )}
            aria-disabled={disabled}
          >
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 motion-reduce:transition-none">
                {action.icon}
              </span>
              <span className="flex flex-col text-left">
                <span className="text-base sm:text-lg">{action.label}</span>
                {action.hint ? (
                  <span className="text-[11px] font-bold text-ink-400">{action.hint}</span>
                ) : null}
              </span>
            </span>
            {!disabled && (
              <ChevronRightIcon
                className="h-5 w-5 shrink-0 opacity-90 transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            )}
          </button>
        ) : (
          <div className="flex-1" aria-hidden="true" />
        )}
      </div>
    </footer>
  );
}
