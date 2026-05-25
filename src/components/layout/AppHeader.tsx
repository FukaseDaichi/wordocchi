import { HelpCircleIcon, MenuIcon } from "lucide-react";

import { IconButton } from "@/components/ui/IconButton";

type AppHeaderProps = {
  readonly onOpenRules: () => void;
  readonly onOpenSettings: () => void;
};

export function AppHeader({ onOpenRules, onOpenSettings }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-cream-50/85 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between lg:max-w-5xl">
        <IconButton
          label="設定"
          icon={<MenuIcon className="h-6 w-6" />}
          onClick={onOpenSettings}
        />
        <span className="sr-only">ワードッチ</span>
        <IconButton
          label="ルール"
          icon={<HelpCircleIcon className="h-6 w-6" />}
          onClick={onOpenRules}
        />
      </div>
    </header>
  );
}
