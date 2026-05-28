import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type CardTone = "default" | "accent";
type PhaseTone = "sun" | "rose" | "sky" | "leaf";

type CardProps = HTMLAttributes<HTMLElement> & {
  readonly children: ReactNode;
  readonly as?: "section" | "aside" | "div";
  readonly tone?: CardTone;
  readonly phaseTone?: PhaseTone;
};

const toneClass: Record<CardTone, string> = {
  default: "bg-cream-100 shadow-card",
  accent: "bg-cream-200 shadow-card",
};

const phaseStripClass: Record<PhaseTone, string> = {
  sun: "bg-gradient-to-r from-sun-400 via-rose-400 to-leaf-500",
  rose: "bg-gradient-to-r from-rose-500 via-rose-400 to-sun-400",
  sky: "bg-gradient-to-r from-sky-500 via-sky-500/70 to-leaf-500",
  leaf: "bg-gradient-to-r from-leaf-500 via-sun-400 to-rose-400",
};

export function Card({
  as: Component = "section",
  tone = "default",
  phaseTone,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-3xl p-5 sm:p-6",
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {phaseTone && (
        <span
          aria-hidden="true"
          className={cn("absolute inset-x-0 top-0 h-1.5", phaseStripClass[phaseTone])}
        />
      )}
      {children}
    </Component>
  );
}
