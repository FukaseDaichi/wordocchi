import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly icon: ReactNode;
  readonly label: string;
  readonly showLabel?: boolean;
};

export function IconButton({
  icon,
  label,
  showLabel = false,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "tap-highlight-none flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl bg-cream-100 text-ink-900 shadow-card transition active:scale-[0.97] hover:bg-cream-200 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <span className="flex items-center justify-center" aria-hidden="true">
        {icon}
      </span>
      {showLabel && <span className="text-[10px] font-bold leading-none">{label}</span>}
    </button>
  );
}
