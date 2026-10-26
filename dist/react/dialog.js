"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { IconButton } from "./icon-button.js";
import { iconMask } from "./icons.js";
/**
 * A modal dialog for a step that has to interrupt the page (a destructive
 * action, say); an inline panel is usually enough. Escape or a click on the
 * backdrop closes it, and so does the close Icon Button.
 */
export function Dialog({ open, onClose, title, children, }) {
    useEffect(() => {
        if (!open)
            return;
        function onKeyDown(e) {
            if (e.key === "Escape")
                onClose();
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-(--color-overlay-scrim) p-4", onClick: (e) => {
            if (e.target === e.currentTarget)
                onClose();
        }, children: _jsxs("div", { role: "dialog", "aria-modal": "true", "aria-label": title, className: "w-full max-w-md rounded-lg border border-(--color-border-subtle) bg-(--color-surface-default) p-6 shadow-lg", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsx("h2", { className: "text-sm font-medium text-(--color-content-primary)", children: title }), _jsx(IconButton, { label: "Close", variant: "tertiary", onClick: onClose, children: _jsx("span", { "aria-hidden": true, "data-icon": "close", className: "inline-block size-5 bg-current", style: iconMask("close") }) })] }), _jsx("div", { className: "mt-4", children: children })] }) }));
}
