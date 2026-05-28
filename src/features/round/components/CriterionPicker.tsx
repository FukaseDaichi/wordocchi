"use client";

import {
  EyeOffIcon,
  LockKeyholeIcon,
  SparklesIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import type { SampleSecretCriterion } from "@/data/sample-prompts";

type CriterionPickerProps = {
  readonly candidates: readonly SampleSecretCriterion[];
  readonly onPick: (criterionId: string) => void;
};

type Tone = {
  readonly label: string;
  readonly accent: string;
  readonly card: string;
  readonly stitch: string;
  readonly seal: string;
  readonly chip: string;
  readonly watermark: string;
  readonly confirmPill: string;
};

const CARD_TONES: readonly Tone[] = [
  {
    label: "A",
    accent: "text-rose-500",
    card:
      "bg-gradient-to-br from-rose-100 via-cream-100 to-cream-200 border-rose-400",
    stitch: "border-rose-300",
    seal: "bg-rose-500 text-white",
    chip: "bg-rose-500 text-white",
    watermark: "text-rose-300/40",
    confirmPill: "bg-rose-500 text-white",
  },
  {
    label: "B",
    accent: "text-sky-500",
    card:
      "bg-gradient-to-br from-sky-100 via-cream-100 to-cream-200 border-sky-500",
    stitch: "border-sky-500/50",
    seal: "bg-sky-500 text-white",
    chip: "bg-sky-500 text-white",
    watermark: "text-sky-500/30",
    confirmPill: "bg-sky-500 text-white",
  },
] as const;

// 確定演出の合計時間。motion-safe のとき、この長さだけ待ってから onPick を呼ぶ。
const PICK_ANIMATION_MS = 520;

export function CriterionPicker({ candidates, onPick }: CriterionPickerProps) {
  const [pickedId, setPickedId] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // 候補が差し替わったら(=もどる/はじめ直すで再表示)、選択状態を捨ててカードを元に戻す。
    setPickedId(null);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [candidates]);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const handlePick = useCallback(
    (id: string) => {
      if (pickedId !== null) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        onPick(id);
        return;
      }

      setPickedId(id);
      timeoutRef.current = window.setTimeout(() => {
        onPick(id);
      }, PICK_ANIMATION_MS);
    },
    [onPick, pickedId],
  );

  return (
    <div className="grid gap-4">
      <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-dashed border-rose-400 bg-rose-100/70 px-3 py-1 text-[11px] font-rounded font-extrabold uppercase tracking-[0.16em] text-rose-500">
        <EyeOffIcon className="h-3.5 w-3.5" aria-hidden="true" />
        親だけがそっと開く封筒
      </p>

      <ul
        className="grid gap-3.5"
        role="listbox"
        aria-label="ヒミツのキジュン候補2つ"
      >
        {candidates.map((candidate, index) => {
          const tone = CARD_TONES[index] ?? CARD_TONES[0];
          const isPicked = pickedId === candidate.id;
          const isFaded = pickedId !== null && !isPicked;

          return (
            <li key={candidate.id} className="contents">
              <button
                type="button"
                role="option"
                aria-selected={isPicked}
                disabled={pickedId !== null}
                onClick={() => handlePick(candidate.id)}
                className={cn(
                  "tap-highlight-none group relative w-full overflow-hidden rounded-3xl border-2 border-dashed p-5 text-left shadow-card transition active:scale-[0.98] motion-reduce:transition-none disabled:cursor-default sm:p-6",
                  tone.card,
                  // 通常時のホバー強調(ピック中は止める)
                  pickedId === null &&
                    "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-pop",
                  // 確定演出
                  isPicked &&
                    "z-10 motion-safe:animate-secret-card-stamp shadow-pop ring-4 ring-offset-2 ring-offset-cream-100",
                  isPicked && tone.label === "A" && "ring-rose-400/50",
                  isPicked && tone.label === "B" && "ring-sky-500/40",
                  // 選ばれなかった側
                  isFaded && "motion-safe:animate-secret-card-fade",
                )}
              >
                {/* 内側の縫い目(封筒っぽさ) */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-2 rounded-[1.4rem] border border-dashed",
                    tone.stitch,
                  )}
                />

                {/* 「ヒミツ」斜め透かし(子に見えても意味だけが伝わるレベルの薄さ) */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -left-3 bottom-2 -rotate-[8deg] font-rounded text-[2.2rem] font-black leading-none tracking-[-0.04em] sm:text-[2.6rem]",
                    tone.watermark,
                  )}
                >
                  ヒミツ
                </span>

                {/* 確定時の光(motion-safe のみ) */}
                {isPicked ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sun-100 via-cream-50 to-transparent opacity-0 mix-blend-screen motion-safe:animate-secret-card-shimmer motion-reduce:hidden"
                  />
                ) : null}

                <div className="relative flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-rounded text-[11px] font-extrabold uppercase tracking-[0.18em]",
                      tone.chip,
                    )}
                  >
                    <LockKeyholeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    封筒 {tone.label}
                  </span>

                  {/* 封蝋スタンプ(右上の丸シール) */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-rounded text-lg font-black shadow-pop",
                      tone.seal,
                      isPicked && "motion-safe:animate-secret-seal-pulse",
                    )}
                  >
                    {tone.label}
                    {/* 内側の二重リング(封蝋の縁) */}
                    <span className="pointer-events-none absolute inset-1 rounded-full border border-white/40" />
                  </span>
                </div>

                <p className="relative mt-5 break-words font-rounded text-[1.35rem] font-extrabold leading-snug text-ink-900 sm:text-2xl">
                  {candidate.text}
                </p>

                <p
                  className={cn(
                    "relative mt-4 inline-flex items-center gap-1.5 text-xs font-bold",
                    tone.accent,
                  )}
                >
                  <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  タップしてこのキジュンに封をする
                </p>

                {/* 確定時のピル */}
                {isPicked ? (
                  <span
                    role="status"
                    aria-live="polite"
                    className={cn(
                      "pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full px-3 py-1 font-rounded text-[11px] font-extrabold uppercase tracking-[0.16em] shadow-card motion-safe:animate-secret-card-confirm",
                      tone.confirmPill,
                    )}
                  >
                    <LockKeyholeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    封をしました
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-[11px] leading-relaxed text-ink-400">
        選ばなかった封筒は、このラウンドの間ずっと閉じたままにしておきます。
      </p>
    </div>
  );
}
