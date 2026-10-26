"use client";

import { useEffect } from "react";

/**
 * The app's first real modal primitive - every confirmation today
 * (delete a draft, publish, schedule) is done via an inline expanding
 * panel within the page instead (see the Phase 1 audit). Built for Phase
 * 4 to adopt where an inline panel genuinely isn't enough (a destructive
 * action, or a flow that needs to interrupt the whole page) - not a mass
 * retrofit of every existing inline confirmation, which mostly work fine
 * as-is.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-overlay-scrim) p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-lg border border-(--color-border-subtle) bg-(--color-surface-default) p-6 shadow-lg"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-sm font-medium text-(--color-content-primary)">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-lg leading-none text-(--color-content-muted) hover:text-(--color-content-primary)"
          >
            &times;
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
