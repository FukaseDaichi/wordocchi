"use client";

import { XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

type ModalProps = {
  readonly title: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly className?: string;
  readonly closeLabel?: string;
};

const CLOSE_ANIMATION_MS = 260;

export function Modal({
  title,
  isOpen,
  onClose,
  children,
  footer,
  className,
  closeLabel = "閉じる",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const id = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsVisible(true));
      });
      return () => window.cancelAnimationFrame(id);
    }

    if (isMounted) {
      setIsVisible(false);
      const timer = window.setTimeout(() => setIsMounted(false), CLOSE_ANIMATION_MS);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (!isVisible) {
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
  }, [isVisible, onClose]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink-900/45 backdrop-blur-sm transition-opacity duration-200 ease-out motion-reduce:transition-none",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative max-h-[90dvh] w-full max-w-screen-sm overflow-y-auto rounded-t-3xl bg-cream-50 p-5 shadow-float transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none sm:rounded-3xl sm:p-6",
          isVisible
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-full opacity-0 sm:translate-y-3 sm:scale-[0.96]",
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-rounded text-2xl font-extrabold text-ink-900">
            {title}
          </h2>
          <IconButton
            label={closeLabel}
            icon={<XIcon className="h-6 w-6" />}
            onClick={onClose}
            className="h-12 w-12 shrink-0"
          />
        </header>
        <div className="mt-5">{children}</div>
        {footer ? <footer className="mt-6">{footer}</footer> : null}
      </div>
    </div>
  );
}
