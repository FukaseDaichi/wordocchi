import { EyeOffIcon } from "lucide-react";

import type { SampleSecretCriterion } from "@/data/sample-prompts";

type CriterionPickerProps = {
  readonly candidates: readonly SampleSecretCriterion[];
  readonly onPick: (criterionId: string) => void;
};

export function CriterionPicker({ candidates, onPick }: CriterionPickerProps) {
  return (
    <div className="grid gap-3">
      {candidates.map((candidate, index) => (
        <button
          key={candidate.id}
          type="button"
          className="w-full rounded-3xl border-2 border-border-200 bg-cream-100 p-5 text-left shadow-card transition active:scale-[0.98] hover:border-rose-300 hover:bg-rose-100/40"
          onClick={() => onPick(candidate.id)}
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold text-rose-500">
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
            候補 {index + 1}
          </span>
          <p className="mt-2 font-rounded text-xl font-extrabold leading-snug text-ink-900">
            {candidate.text}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            選んだら、もう一方はこのラウンドでは伏せたままにします。
          </p>
        </button>
      ))}
    </div>
  );
}
