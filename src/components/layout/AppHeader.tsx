import { HelpCircleIcon, SettingsIcon } from "lucide-react";

import { IconButton } from "@/components/ui/IconButton";

type AppHeaderProps = {
  readonly onOpenRules: () => void;
  readonly onOpenSettings: () => void;
};

export function AppHeader({ onOpenRules, onOpenSettings }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border-200/40 bg-cream-50/85 px-3 py-2 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-screen-sm items-center justify-between lg:max-w-5xl">
        <IconButton
          label="設定"
          icon={<SettingsIcon className="h-5 w-5" />}
          onClick={onOpenSettings}
          className="h-11 w-11"
        />
        <h1
          className="font-rounded text-base font-extrabold tracking-wide text-ink-900"
          aria-label="ワードッチ"
        >
          <span className="text-rose-500">ワ</span>
          <span className="text-sun-400">ー</span>
          <span className="text-leaf-500">ド</span>
          <span className="text-sky-500">ッ</span>
          <span className="text-rose-500">チ</span>
        </h1>
        <IconButton
          label="ルール"
          icon={<HelpCircleIcon className="h-5 w-5" />}
          onClick={onOpenRules}
          className="h-11 w-11"
        />
      </div>
    </header>
  );
}
