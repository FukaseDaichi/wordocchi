import { cn } from "@/lib/cn";

type SegmentedOption<T extends string | number> = {
  readonly label: string;
  readonly value: T;
};

type SegmentedControlProps<T extends string | number> = {
  readonly label: string;
  readonly options: readonly SegmentedOption<T>[];
  readonly value: T;
  readonly onChange: (value: T) => void;
};

export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div>
      <p className="text-sm font-bold text-ink-600">{label}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label={label}>
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              className={cn(
                "min-h-12 rounded-2xl px-4 font-rounded font-bold transition active:scale-[0.98]",
                isSelected
                  ? "bg-leaf-500 text-white shadow-cta"
                  : "bg-cream-100 text-ink-900 shadow-card hover:bg-cream-200",
              )}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
