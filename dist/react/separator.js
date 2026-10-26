import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The NDS Separator (Figma "Seperator", 580:2224): a 1px line in
 * border-subtle, across or upright, or "withOR": 124px rules 8px either side
 * of a 14/20 semibold word in content-muted (the OR between sign-in options).
 */
export function Separator({ orientation = "horizontal", label, className = "", }) {
    if (label) {
        return (_jsxs("div", { role: "separator", className: `flex items-center justify-center gap-2 ${className}`.trim(), children: [_jsx("span", { "data-part": "line", "aria-hidden": true, className: "h-px w-31 shrink bg-(--color-border-subtle)" }), _jsx("span", { className: "text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) font-semibold tracking-[0.056px] text-(--color-content-muted)", children: label }), _jsx("span", { "data-part": "line", "aria-hidden": true, className: "h-px w-31 shrink bg-(--color-border-subtle)" })] }));
    }
    return orientation === "vertical" ? (_jsx("div", { role: "separator", "aria-orientation": "vertical", className: `w-px self-stretch bg-(--color-border-subtle) ${className}`.trim() })) : (_jsx("div", { role: "separator", className: `h-px w-full bg-(--color-border-subtle) ${className}`.trim() }));
}
