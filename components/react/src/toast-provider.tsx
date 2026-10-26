"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { PlainLink, type LinkComponent } from "./breadcrumbs.js";

type ToastTone = "success" | "danger" | "muted";
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

const TONE_CLASSES: Record<ToastTone, string> = {
  success: "border-(--color-border-success)/40 bg-(--color-status-success-subtle) text-(--color-status-success)",
  danger: "border-(--color-border-error)/40 bg-(--color-status-error-subtle) text-(--color-status-error)",
  muted: "border-(--color-border-subtle) bg-(--color-surface-default) text-(--color-content-primary)",
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
            className={`pointer-events-auto flex max-w-xl flex-wrap items-center gap-x-4 gap-y-1 rounded-md border px-4 py-2.5 text-sm font-medium shadow-sm ${TONE_CLASSES[t.tone]}`}
          >
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
                <span aria-hidden>×</span>
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
