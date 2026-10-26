import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Status-coloured text on the status's subtle fill: readable in both
 * modes (Figma's near-black badge text isn't, in Dark - audit M14). */
const TONE_CLASSES = {
    neutral: "border border-(--color-border-subtle) bg-(--color-surface-raised) text-(--color-content-secondary)",
    info: "bg-(--color-status-info-subtle) text-(--color-status-info)",
    success: "bg-(--color-status-success-subtle) text-(--color-status-success)",
    warning: "bg-(--color-status-warning-subtle) text-(--color-status-warning)",
    error: "bg-(--color-status-error-subtle) text-(--color-status-error)",
    highlight: "bg-(--color-action-primary) text-(--color-content-on-primary)",
};
/**
 * The NDS Badge (Figma "Badge", 860:4288): a 24px pill, 12px in, caption
 * 12/16 medium, with an optional 8px dot in the tone's colour 4px before the
 * text. Use it for statuses and labels (Active, Popular, Scheduled); a badge
 * is never a button.
 */
export function Badge({ tone = "neutral", dot = false, className = "", children, }) {
    return (_jsxs("span", { className: `inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 text-(length:--type-font-size-caption) leading-(--type-line-height-caption) font-medium ${TONE_CLASSES[tone]} ${className}`.trim(), children: [dot && _jsx("span", { "aria-hidden": true, className: "size-2 shrink-0 rounded-full bg-current" }), children] }));
}
