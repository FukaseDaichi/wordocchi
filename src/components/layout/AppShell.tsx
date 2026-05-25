import type { ReactNode } from "react";

type AppShellProps = {
  readonly children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="safe-screen min-h-dvh">
      <div className="mx-auto w-full max-w-screen-sm px-4 pb-6 lg:max-w-5xl">{children}</div>
    </div>
  );
}
