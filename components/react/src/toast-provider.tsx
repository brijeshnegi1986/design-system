"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { PlainLink, type LinkComponent } from "./breadcrumbs.js";
import { iconMask, type IconName } from "./icons.js";

/** "danger" and "muted" are the older names for error and neutral. */
type ToastTone = "success" | "danger" | "warning" | "info" | "muted";
/** A link after the message, to where the outcome can be seen. */
type ToastAction = { label: string; href: string };
/** persist: stays until closed, for something the person needs to read
 * (a failure and its reason), rather than disappearing on a timer. */
type ToastOptions = { persist?: boolean };
type Toast = { id: number; message: string; tone: ToastTone; action?: ToastAction; persist: boolean };

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone, action?: ToastAction, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/** The NDS Toast (Figma 857:3101): the status's subtle fill, a full 1px
 * border and the text in the status colour, with its filled icon. */
const TONES: Record<ToastTone, { classes: string; icon: IconName }> = {
  success: { classes: "border-(--color-border-success) bg-(--color-status-success-subtle) text-(--color-status-success)", icon: "check-circle-filled" },
  danger: { classes: "border-(--color-border-error) bg-(--color-status-error-subtle) text-(--color-status-error)", icon: "error-filled" },
  warning: { classes: "border-(--color-border-warning) bg-(--color-status-warning-subtle) text-(--color-status-warning)", icon: "warning-filled" },
  info: { classes: "border-(--color-border-info) bg-(--color-status-info-subtle) text-(--color-status-info)", icon: "info-filled" },
  muted: { classes: "border-(--color-border-subtle) bg-(--color-surface-default) text-(--color-content-primary)", icon: "info" },
};

/**
 * Toasts: mount ToastProvider once near the root and call
 * useToast().showToast(...) from any client component.
 * Auto-dismisses after 4s (6s with a link, to leave time to use it). A
 * toast shown with { persist: true } instead stays until its close button
 * is used, and a persistent failure is announced as an alert.
 */
export function ToastProvider({
  children,
  linkAs: LinkAs = PlainLink,
}: {
  children: React.ReactNode;
  /** The app's router link for a toast's action (default: a plain <a>). */
  linkAs?: LinkComponent;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastTone = "muted", action?: ToastAction, options?: ToastOptions) => {
      const id = nextId.current++;
      const persist = Boolean(options?.persist);
      setToasts((prev) => [...prev, { id, message, tone, action, persist }]);
      if (!persist) setTimeout(() => dismiss(id), action ? 6000 : 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.persist && t.tone === "danger" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full max-w-[390px] flex-wrap items-start gap-x-2 gap-y-1 rounded-(--radius-md) border p-4 text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) font-medium shadow-[0_var(--elevation-sm)_2px_rgb(0_0_0/0.1)] ${TONES[t.tone].classes}`}
          >
            <span data-part="icon" data-icon={TONES[t.tone].icon} aria-hidden className="mt-px inline-block size-5 shrink-0 bg-current" style={iconMask(TONES[t.tone].icon)} />
            <span className="min-w-0 flex-1">{t.message}</span>
            {t.action && (
              <LinkAs href={t.action.href} className="underline underline-offset-2 hover:no-underline">
                {t.action.label}
              </LinkAs>
            )}
            {t.persist && (
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
                className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded-full text-base leading-none opacity-80 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              >
                <span aria-hidden data-icon="close" className="inline-block size-4 bg-current" style={iconMask("close")} />
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
