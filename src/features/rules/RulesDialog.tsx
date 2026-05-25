"use client";

import { useEffect, useRef } from "react";

import { RulesCarousel } from "@/features/rules/RulesCarousel";

type RulesDialogProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export function RulesDialog({ isOpen, onClose }: RulesDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousActive = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const targets = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (targets.length === 0) {
        return;
      }

      const first = targets[0];
      const last = targets[targets.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousActive?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="閉じる"
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm motion-safe:animate-[overlay-fade_200ms_ease-out]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-dialog-title"
        className="relative flex h-[88dvh] w-full max-w-screen-sm flex-col overflow-hidden rounded-t-3xl bg-cream-50 shadow-float motion-safe:animate-[sheet-up_350ms_cubic-bezier(0.32,0.72,0,1)] sm:h-auto sm:max-h-[640px] sm:rounded-3xl"
      >
        <span id="rules-dialog-title" className="sr-only">
          あそびかた
        </span>
        <RulesCarousel onClose={onClose} />
      </div>
    </div>
  );
}
