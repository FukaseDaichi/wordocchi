import { cn } from "@/lib/cn";
import type { SamplePromptWord } from "@/data/sample-prompts";

const WORD_TONES = [
  {
    chip: "bg-rose-500 text-white",
    border: "border-rose-300",
    accent: "from-rose-100 via-cream-100 to-cream-100",
    rotate: "sm:-rotate-1",
  },
  {
    chip: "bg-sun-400 text-ink-900",
    border: "border-sun-400/60",
    accent: "from-sun-100 via-cream-100 to-cream-100",
    rotate: "sm:rotate-0",
  },
  {
    chip: "bg-sky-500 text-white",
    border: "border-sky-500/40",
    accent: "from-sky-100 via-cream-100 to-cream-100",
    rotate: "sm:rotate-1",
  },
] as const;

type PromptWordsProps = {
  readonly words: readonly SamplePromptWord[];
};

export function PromptWords({ words }: PromptWordsProps) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3" aria-label="3つのワード">
      {words.map((word, index) => {
        const tone = WORD_TONES[index] ?? WORD_TONES[0];

        return (
          <li
            key={word.id}
            className={cn(
              "group relative flex flex-col gap-3 overflow-hidden rounded-3xl border-2 bg-gradient-to-br px-5 py-6 text-center shadow-pop transition hover:-translate-y-0.5 motion-reduce:transition-none",
              tone.border,
              tone.accent,
              tone.rotate,
            )}
          >
            <span
              className={cn(
                "mx-auto flex h-9 w-9 items-center justify-center rounded-full font-rounded text-base font-black shadow-card",
                tone.chip,
              )}
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <p className="break-words font-rounded text-2xl font-extrabold leading-snug text-ink-900 sm:text-[1.7rem]">
              {word.text}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
