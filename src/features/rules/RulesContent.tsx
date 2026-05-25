import { ruleSections } from "@/features/rules/rules-copy";

export function RulesContent() {
  return (
    <div className="space-y-3">
      {ruleSections.map((section, index) => (
        <details
          key={section.title}
          className="group rounded-2xl bg-cream-100 p-4 shadow-card"
          open={index === 0}
        >
          <summary className="cursor-pointer list-none font-rounded text-lg font-bold text-ink-900">
            <span className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sun-400 text-sm text-ink-900">
                {index + 1}
              </span>
              {section.title}
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">{section.body}</p>
        </details>
      ))}
    </div>
  );
}
