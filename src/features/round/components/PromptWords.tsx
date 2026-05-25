import type { SamplePromptWord } from "@/data/sample-prompts";

type PromptWordsProps = {
  readonly words: readonly SamplePromptWord[];
};

export function PromptWords({ words }: PromptWordsProps) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {words.map((word, index) => (
        <li
          key={word.id}
          className="rounded-2xl bg-cream-100 px-5 py-6 text-center shadow-card"
        >
          <span className="text-xs font-bold text-ink-600">ワード {index + 1}</span>
          <p className="mt-2 break-words font-rounded text-2xl font-extrabold leading-snug text-ink-900">
            {word.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
