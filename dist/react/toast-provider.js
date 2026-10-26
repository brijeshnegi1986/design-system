"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { PlainLink } from "./breadcrumbs.js";
const ToastContext = createContext(null);
const TONE_CLASSES = {
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
    return (_jsxs(ToastContext.Provider, { value: { showToast }, children: [children, _jsx("div", { "aria-live": "polite", className: "pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4", children: toasts.map((t) => (_jsxs("div", { role: t.persist && t.tone === "danger" ? "alert" : "status", className: `pointer-events-auto flex max-w-xl flex-wrap items-center gap-x-4 gap-y-1 rounded-md border px-4 py-2.5 text-sm font-medium shadow-sm ${TONE_CLASSES[t.tone]}`, children: [_jsx("span", { className: "min-w-0 flex-1", children: t.message }), t.action && (_jsx(LinkAs, { href: t.action.href, className: "underline underline-offset-2 hover:no-underline", children: t.action.label })), t.persist && (_jsx("button", { type: "button", "aria-label": "Dismiss", onClick: () => dismiss(t.id), className: "-mr-1 flex size-6 shrink-0 items-center justify-center rounded-full text-base leading-none opacity-80 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current", children: _jsx("span", { "aria-hidden": true, children: "\u00D7" }) }))] }, t.id))) })] }));
}
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}
