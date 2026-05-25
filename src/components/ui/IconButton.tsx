import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly icon: ReactNode;
  readonly label: string;
};

export function IconButton({
  icon,
  label,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "tap-highlight-none flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-2xl bg-cream-100 text-ink-900 shadow-card transition active:scale-[0.97] motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <span className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
        {icon}
      </span>
      <span className="text-[11px] font-bold leading-none">{label}</span>
    </button>
  );
}
