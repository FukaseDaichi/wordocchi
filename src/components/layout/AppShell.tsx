import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type AppShellProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-sm flex-1 px-4 pb-4 pt-3 lg:max-w-5xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
