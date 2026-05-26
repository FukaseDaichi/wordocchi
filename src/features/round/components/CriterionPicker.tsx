import { EyeOffIcon, KeyRoundIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import type { SampleSecretCriterion } from "@/data/sample-prompts";

type CriterionPickerProps = {
  readonly candidates: readonly SampleSecretCriterion[];
  readonly onPick: (criterionId: string) => void;
};

const CARD_TONES = [
  {
    label: "A",
    accent: "text-rose-500",
    border: "border-rose-300/70 hover:border-rose-500",
    glow: "bg-rose-100",
    chip: "bg-rose-100 text-rose-500",
  },
  {
    label: "B",
    accent: "text-sky-500",
    border: "border-sky-500/40 hover:border-sky-500",
    glow: "bg-sky-100",
    chip: "bg-sky-100 text-sky-500",
  },
] as const;

export function CriterionPicker({ candidates, onPick }: CriterionPickerProps) {
  return (
    <div className="grid gap-3">
      <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-cream-200 px-3 py-1 text-xs font-rounded font-bold text-ink-600">
        <EyeOffIcon className="h-3.5 w-3.5" aria-hidden="true" />
        親だけが見るカード
      </p>
      <div className="grid gap-3">
        {candidates.map((candidate, index) => {
          const tone = CARD_TONES[index] ?? CARD_TONES[0];

          return (
            <button
              key={candidate.id}
              type="button"
              className={cn(
                "group relative w-full overflow-hidden rounded-3xl border-2 bg-cream-100 p-5 text-left shadow-card transition active:scale-[0.98] motion-reduce:transition-none",
                tone.border,
              )}
              onClick={() => onPick(candidate.id)}
            >
              <span
                className={cn(
                  "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-60 transition group-hover:opacity-80",
                  tone.glow,
                )}
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-2xl font-rounded text-lg font-black",
                    tone.chip,
                  )}
                  aria-hidden="true"
                >
                  {tone.label}
                </span>
                <span className={cn("text-xs font-rounded font-bold uppercase tracking-[0.18em]", tone.accent)}>
                  候補 {index + 1}
                </span>
              </div>
              <p className="relative mt-4 font-rounded text-xl font-extrabold leading-snug text-ink-900 sm:text-2xl">
                {candidate.text}
              </p>
              <p className="relative mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-ink-600">
                <KeyRoundIcon className={cn("h-3.5 w-3.5", tone.accent)} aria-hidden="true" />
                タップでこのキジュンに決定
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
