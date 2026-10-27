import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Each Figma variant (Badge, 860:4288): its fill and text. Status colours
 * are the status's text on its subtle fill. Neutral is action/disabled with
 * content/primary text: Figma's content/on-accent is near-black in both
 * modes and unreadable on Dark's neutral-700, so the text follows the mode.
 * Highlighted is the brand's lime (brand-color-accent-dark), one fixed
 * value, with on-accent text. */
const TONE_CLASSES = {
    neutral: "bg-(--color-action-disabled) text-(--color-content-primary)", // Figma Neutral
    info: "bg-(--color-status-info-subtle) text-(--color-status-info)", // Figma Required
    success: "bg-(--color-status-success-subtle) text-(--color-status-success)", // Figma Positive
    warning: "bg-(--color-status-warning-subtle) text-(--color-status-warning)", // Figma Action
    error: "bg-(--color-status-error-subtle) text-(--color-status-error)", // Figma Negative
    highlight: "bg-(--brand-color-accent-dark) text-(--color-content-on-accent)", // Figma Highlighted
};
/** The 8px dot (Figma Status=True): the tone's colour, but Neutral's is
 * muted, quieter than its text. */
const DOT_CLASSES = {
    neutral: "bg-(--color-content-muted)",
};
/**
 * The NDS Badge (Figma "Badge", 860:4288): a 24px pill, 12px in, caption
 * 12/16 regular, with an optional 8px dot (Status=True) 4px before the
 * text. With an `icon` (16px, like Highlighted's calendar) it's 32px tall.
 * Use it for statuses and labels (Active, Popular, Scheduled); a badge is
 * never a button.
 */
export function Badge({ tone = "neutral", dot = false, icon, className = "", children, }) {
    return (_jsxs("span", { className: `inline-flex ${icon ? "h-8" : "h-6"} shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 text-(length:--type-font-size-caption) leading-(--type-line-height-caption) font-normal ${TONE_CLASSES[tone]} ${className}`.trim(), children: [dot && _jsx("span", { "aria-hidden": true, className: `size-2 shrink-0 rounded-full ${DOT_CLASSES[tone] ?? "bg-current"}` }), icon && (_jsx("span", { "aria-hidden": true, className: "flex size-4 shrink-0 items-center justify-center", children: icon })), children] }));
}
