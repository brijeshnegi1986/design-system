"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { PlainLink } from "./breadcrumbs.js";
import { iconMask } from "./icons.js";
const ToastContext = createContext(null);
/** The NDS Toast (Figma 857:3101): the status's subtle fill, a full 1px
 * border and the text in the status colour, with its filled icon. */
const TONES = {
    success: { classes: "border-(--color-border-success) bg-(--color-status-success-subtle) text-(--color-status-success)", icon: "check-circle-filled" },
    danger: { classes: "border-(--color-border-error) bg-(--color-status-error-subtle) text-(--color-status-error)", icon: "error-filled" },
    warning: { classes: "border-(--color-border-warning) bg-(--color-status-warning-subtle) text-(--color-status-warning)", icon: "warning-filled" },
    info: { classes: "border-(--color-border-info) bg-(--color-status-info-subtle) text-(--color-status-info)", icon: "info-filled" },
    muted: { classes: "border-(--color-border-subtle) bg-(--color-surface-default) text-(--color-content-primary)", icon: "info-filled" },
};
/**
 * Toasts: mount ToastProvider once near the root and call
 * useToast().showToast(...) from any client component.
 * Auto-dismisses after 4s (6s with a link, to leave time to use it). A
 * toast shown with { persist: true } instead stays until its close button
 * is used, and a persistent failure is announced as an alert.
 */
export function ToastProvider({ children, linkAs: LinkAs = PlainLink, }) {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(0);
    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const showToast = useCallback((message, tone = "muted", action, options) => {
        const id = nextId.current++;
        const persist = Boolean(options?.persist);
        setToasts((prev) => [...prev, { id, message, tone, action, persist }]);
        if (!persist)
            setTimeout(() => dismiss(id), action ? 6000 : 4000);
    }, [dismiss]);
    return (_jsxs(ToastContext.Provider, { value: { showToast }, children: [children, _jsx("div", { "aria-live": "polite", className: "pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4", children: toasts.map((t) => (_jsxs("div", { role: t.persist && t.tone === "danger" ? "alert" : "status", className: `pointer-events-auto flex w-full max-w-[390px] flex-wrap items-start gap-x-2 gap-y-1 rounded-(--radius-md) border p-4 text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) font-medium shadow-[0_var(--elevation-sm)_2px_rgb(0_0_0/0.1)] ${TONES[t.tone].classes}`, children: [_jsx("span", { "data-part": "icon", "data-icon": TONES[t.tone].icon, "aria-hidden": true, className: "mt-px inline-block size-5 shrink-0 bg-current", style: iconMask(TONES[t.tone].icon) }), _jsx("span", { className: "min-w-0 flex-1", children: t.message }), t.action && (_jsx(LinkAs, { href: t.action.href, className: "underline underline-offset-2 hover:no-underline", children: t.action.label })), t.persist && (_jsx("button", { type: "button", "aria-label": "Dismiss", onClick: () => dismiss(t.id), className: "-mr-1 flex size-6 shrink-0 items-center justify-center rounded-full text-base leading-none opacity-80 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current", children: _jsx("span", { "aria-hidden": true, "data-icon": "close", className: "inline-block size-4 bg-current", style: iconMask("close") }) }))] }, t.id))) })] }));
}
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}
