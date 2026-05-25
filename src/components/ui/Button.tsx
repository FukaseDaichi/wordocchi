import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/cn";

type ButtonIntent = "primary" | "secondary" | "ghost" | "danger" | "secret";
type ButtonSize = "md" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly children: ReactNode;
  readonly intent?: ButtonIntent;
  readonly size?: ButtonSize;
  readonly leadingIcon?: ReactNode;
  readonly trailingIcon?: ReactNode;
};

const intentClass: Record<ButtonIntent, string> = {
  primary: "bg-leaf-500 text-white shadow-cta hover:bg-leaf-600",
  secondary: "bg-cream-100 text-ink-900 shadow-card hover:bg-cream-200",
  ghost: "bg-transparent text-ink-900 hover:bg-cream-100",
  danger:
    "border-2 border-dashed border-rose-400 bg-rose-100 text-danger-500 hover:bg-rose-100/80",
  secret:
    "border-2 border-dashed border-rose-400 bg-rose-100/60 text-rose-500 hover:bg-rose-100",
};

const sizeClass: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 py-3 text-base",
  lg: "min-h-14 px-6 py-4 text-lg sm:text-xl",
  icon: "h-14 w-14 p-0 text-xs",
};

export function Button({
  children,
  className,
  intent = "primary",
  size = "lg",
  leadingIcon,
  trailingIcon,
  type = "button",
  ...props
}: ButtonProps) {
  const autoTrailingIcon =
    intent === "primary" && size !== "icon" ? (
      <ChevronRightIcon className="h-6 w-6 shrink-0 opacity-80 transition group-hover:translate-x-0.5" />
    ) : null;

  return (
    <button
      type={type}
      className={cn(
        "tap-highlight-none group inline-flex items-center justify-center gap-3 rounded-2xl font-rounded font-bold leading-none transition duration-100 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
        intentClass[intent],
        sizeClass[size],
        size !== "icon" && "w-full",
        className,
      )}
      {...props}
    >
      {leadingIcon}
      <span className={cn(size === "icon" && "text-[11px] leading-tight")}>{children}</span>
      {trailingIcon ?? autoTrailingIcon}
    </button>
  );
}
