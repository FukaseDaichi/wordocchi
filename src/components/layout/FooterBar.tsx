"use client";

import {
  ChevronLeftIcon,
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
  readonly canGoBack: boolean;
  readonly onRestart: () => void;
  readonly onBack: () => void;
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
    label: "キジュンを選んでね",
    icon: <ChevronRightIcon className="h-5 w-5" />,
    hint: "上のカードから1つ選択",
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

export function FooterBar({
  phase,
  canAdvance,
  canGoBack,
  onRestart,
  onBack,
  onAdvance,
}: FooterBarProps) {
  const action = PRIMARY_ACTION[phase];
  const disabled = !canAdvance;

  return (
    <footer
      className="sticky bottom-0 z-30 border-t border-border-200/60 bg-cream-50/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2.5 shadow-bar backdrop-blur"
      role="contentinfo"
      aria-label="主要アクション"
    >
      <div className="mx-auto flex max-w-screen-sm items-stretch gap-2.5 lg:max-w-5xl">
        <button
          type="button"
          onClick={onRestart}
          className="tap-highlight-none group flex h-14 w-14 shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-cream-100 px-0 text-ink-900 shadow-card transition active:scale-[0.97] hover:bg-cream-200 motion-reduce:transition-none sm:w-auto sm:px-3.5"
          aria-label="新しくはじめる"
        >
          <RotateCcwIcon className="h-5 w-5 text-rose-500" aria-hidden="true" />
          <span className="hidden font-rounded text-sm font-bold whitespace-nowrap sm:inline">
            はじめ直す
          </span>
        </button>

        {canGoBack ? (
          <button
            type="button"
            onClick={onBack}
            className="tap-highlight-none flex h-14 shrink-0 items-center justify-center gap-1 rounded-2xl bg-cream-100 px-4 text-ink-900 shadow-card transition active:scale-[0.97] hover:bg-cream-200 motion-reduce:transition-none"
            aria-label="前のフェイズへ戻る"
          >
            <ChevronLeftIcon className="h-5 w-5 text-ink-600" aria-hidden="true" />
            <span className="font-rounded text-sm font-bold whitespace-nowrap">もどる</span>
          </button>
        ) : null}

        {action ? (
          <button
            type="button"
            onClick={onAdvance}
            disabled={disabled}
            className={cn(
              "tap-highlight-none group relative flex h-14 flex-1 items-center justify-between gap-2 overflow-hidden rounded-2xl px-4 font-rounded font-bold transition active:scale-[0.98] motion-reduce:transition-none",
              disabled
                ? "cursor-not-allowed border-2 border-dashed border-border-200 bg-cream-100/70 text-ink-400 shadow-none"
                : "bg-leaf-500 text-white shadow-cta hover:bg-leaf-600",
            )}
            aria-disabled={disabled}
          >
            {!disabled && (
              <span
                className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10"
                aria-hidden="true"
              />
            )}
            <span className="relative flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  disabled ? "bg-cream-200/60" : "bg-white/15",
                )}
              >
                {action.icon}
              </span>
              <span className="flex flex-col text-left">
                <span className="text-base leading-tight sm:text-lg">{action.label}</span>
                {action.hint ? (
                  <span
                    className={cn(
                      "text-[11px] font-bold leading-tight",
                      disabled ? "text-ink-400" : "text-white/80",
                    )}
                  >
                    {action.hint}
                  </span>
                ) : null}
              </span>
            </span>
            {!disabled && (
              <ChevronRightIcon
                className="relative h-5 w-5 shrink-0 opacity-90 transition group-hover:translate-x-0.5"
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
