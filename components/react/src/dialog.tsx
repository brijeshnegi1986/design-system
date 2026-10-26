"use client";

import { useEffect } from "react";
import { IconButton } from "./icon-button.js";
import { iconMask } from "./icons.js";

/**
 * A modal dialog for a step that has to interrupt the page (a destructive
 * action, say); an inline panel is usually enough. Escape or a click on the
 * backdrop closes it, and so does the close Icon Button.
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
          <IconButton label="Close" variant="tertiary" onClick={onClose}>
            <span aria-hidden data-icon="close" className="inline-block size-5 bg-current" style={iconMask("close")} />
          </IconButton>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
