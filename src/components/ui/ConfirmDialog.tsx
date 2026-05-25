"use client";

import { AlertTriangleIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

type ConfirmDialogProps = {
  readonly isOpen: boolean;
  readonly title: string;
  readonly description: ReactNode;
  readonly confirmLabel: string;
  readonly cancelLabel?: string;
  readonly tone?: "danger" | "primary";
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = "やめる",
  tone = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onCancel}
      className="sm:max-w-md"
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button intent="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            intent={tone === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            className={cn(
              tone === "danger" && "border-none bg-rose-500 text-white hover:bg-rose-500/90",
            )}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex gap-4">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            tone === "danger" ? "bg-rose-100 text-rose-500" : "bg-leaf-100 text-leaf-600",
          )}
          aria-hidden="true"
        >
          <AlertTriangleIcon className="h-6 w-6" />
        </span>
        <div className="text-sm leading-relaxed text-ink-600">{description}</div>
      </div>
    </Modal>
  );
}
