"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { IconButton } from "./icon-button.js";
import { iconMask } from "./icons.js";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The NDS Modal (Figma "Modal", 898:133): a dialog for a decision or a short
 * form that needs full attention; an inline panel is usually enough. Over the
 * overlay scrim: the default surface, radius-xl (16px), the lg elevation and
 * 24px padding. The title (18/28 semibold) and an optional line of context
 * sit beside the close button, then the content, then `actions` at the right
 * (Cancel first, the confirming button last).
 *
 * - size: "sm" (400px) for confirmations, "md" (560px) for forms.
 * - tone: "destructive" adds the warning mark in the error tint; pair it with
 *   a destructive confirm button.
 *
 * Escape, a click on the backdrop or the close button calls onClose. Focus
 * moves into the dialog when it opens, Tab stays inside it, and focus goes
 * back to whatever opened it when it closes - only on opening and closing,
 * never on a re-render, so typing in a field inside it keeps its focus.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  size = "sm",
  tone = "default",
  actions,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  size?: "sm" | "md";
  tone?: "default" | "destructive";
  /** The footer buttons, right-aligned. */
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  // The latest onClose, read by the key handler. Callers usually pass a new
  // function each render, and re-running the focus effect for that would
  // pull focus out of whatever field someone is typing in.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-overlay-scrim) p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        data-size={size}
        data-tone={tone}
        className={`flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-5 overflow-y-auto rounded-(--radius-xl) border border-(--color-border-subtle) bg-(--color-surface-default) p-6 shadow-[0_var(--elevation-lg)_24px_rgb(0_0_0/0.16)] outline-none ${
          size === "md" ? "max-w-[560px]" : "max-w-[400px]"
        }`}
      >
        <div className="flex items-start gap-3">
          {tone === "destructive" && (
            <span data-part="status-icon" aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-status-error-subtle) text-(--color-status-error)">
              <span className="size-5 bg-current" style={iconMask("warning-filled")} />
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 id={titleId} className="text-(length:--type-font-size-body-large) leading-(--type-line-height-body-large) font-semibold text-(--color-content-primary)">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) text-(--color-content-secondary)">
                {description}
              </div>
            )}
          </div>
          <IconButton label="Close" variant="tertiary" size="xsm" onClick={onClose}>
            <span aria-hidden data-icon="close" className="inline-block size-4 bg-current" style={iconMask("close")} />
          </IconButton>
        </div>
        {children && <div data-part="body">{children}</div>}
        {actions && (
          <div data-part="actions" className="flex flex-wrap items-center justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
