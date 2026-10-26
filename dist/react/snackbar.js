import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./button.js";
/**
 * The NDS Snackbar (Figma 865:1594): a short, quiet note about something
 * that just happened, on the raised surface with a 1px subtle edge, 8px
 * corners and the sm elevation; 14/20 regular text, 16px across and 8px
 * down. An optional action is a Plain SM button: after a divider on the
 * same line ("single-line"), or below the text at the right when the
 * message runs to two lines ("multi-line"). For a status (success, failure)
 * use a Toast; for a page-level message, a Banner.
 */
export function Snackbar({ action, layout = "single-line", role = "status", className = "", children, }) {
    const stacked = layout === "multi-line";
    const button = action && (_jsx(Button, { variant: "plain", size: "sm", onClick: action.onClick, className: "shrink-0", children: action.label }));
    return (_jsxs("div", { role: role ?? undefined, className: `flex w-full max-w-[390px] rounded-(--radius-md) border border-(--color-border-subtle) bg-(--color-surface-raised) px-4 py-2 text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) text-(--color-content-primary) shadow-[0_var(--elevation-sm)_2px_rgb(0_0_0/0.1)] ${stacked ? "flex-col items-end gap-1" : "items-center gap-2"} ${className}`.trim(), children: [_jsx("p", { className: stacked ? "w-full" : "min-w-0 flex-1", children: children }), button && !stacked && _jsx("span", { "data-part": "divider", "aria-hidden": true, className: "h-6 w-px shrink-0 bg-(--color-border-subtle)" }), button] }));
}
