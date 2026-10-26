import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The NDS Empty state card (Figma "Empty state card", 897:148): what a list
 * or page shows before it has anything in it. A dashed strong edge, an icon
 * in a 48px raised tile, the title (18/28 semibold), one or two lines on why
 * it matters (14/20, secondary, at most 400px wide), then the one action that
 * fills it. Use the orange Primary only for Create post or sign-up; anything
 * else is a Secondary button.
 */
export function EmptyState({ title, icon, action, children, className = "", }) {
    return (_jsxs("div", { className: `flex flex-col items-center gap-3 rounded-(--radius-lg) border border-dashed border-(--color-border-strong) bg-(--color-surface-default) px-8 py-10 text-center ${className}`.trim(), children: [icon && (_jsx("span", { "data-part": "icon", "aria-hidden": true, className: "flex size-12 items-center justify-center rounded-(--radius-lg) bg-(--color-surface-raised) text-(--color-content-secondary)", children: icon })), _jsxs("div", { className: "flex max-w-[400px] flex-col gap-1", children: [_jsx("p", { "data-part": "title", className: "text-(length:--type-font-size-body-large) leading-(--type-line-height-body-large) font-semibold text-(--color-content-primary)", children: title }), children && (_jsx("div", { className: "text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) text-(--color-content-secondary)", children: children }))] }), action && _jsx("div", { className: "pt-2", children: action })] }));
}
