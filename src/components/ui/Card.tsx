import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  readonly children: ReactNode;
  readonly as?: "section" | "aside" | "div";
  readonly tone?: "default" | "accent" | "secret";
};

const toneClass = {
  default: "bg-cream-100 shadow-card",
  accent: "bg-cream-200 shadow-card",
  secret: "border-2 border-dashed border-sun-400 bg-cream-200 shadow-card",
};

export function Card({
  as: Component = "section",
  tone = "default",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn("rounded-3xl p-5 sm:p-6", toneClass[tone], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
