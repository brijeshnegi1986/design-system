import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The NDS Separator (Figma "Seperator", 580:2224): a 1px line in
 * border-subtle, across or upright, or two lines with a word between them
 * (the "OR" between sign-in options), in the caption size.
 */
export function Separator({ orientation = "horizontal", label, className = "", }) {
    if (label) {
        return (_jsxs("div", { role: "separator", className: `flex w-full items-center gap-3 ${className}`.trim(), children: [_jsx("span", { "data-part": "line", "aria-hidden": true, className: "h-px flex-1 bg-(--color-border-subtle)" }), _jsx("span", { className: "text-(length:--type-font-size-caption) leading-(--type-line-height-caption) font-medium text-(--color-content-muted)", children: label }), _jsx("span", { "data-part": "line", "aria-hidden": true, className: "h-px flex-1 bg-(--color-border-subtle)" })] }));
    }
    return orientation === "vertical" ? (_jsx("div", { role: "separator", "aria-orientation": "vertical", className: `w-px self-stretch bg-(--color-border-subtle) ${className}`.trim() })) : (_jsx("div", { role: "separator", className: `h-px w-full bg-(--color-border-subtle) ${className}`.trim() }));
}
