import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { iconMask } from "./icons.js";
function PlainLink({ href, className, children }) {
    return (_jsx("a", { href: href, className: className, children: children }));
}
/** NDS "Breadcrumbs" (Figma 140:719): a trail of muted links, the current
 * page in the primary text colour, 16px chevrons 8px apart.
 * - sm: caption 12/16, for inside a page (the design's default).
 * - md: body small 14/20, for a page header bar, where 12px reads as
 *   lost; links in the secondary colour and the current page medium. */
export function Breadcrumbs({ items, linkAs: LinkAs = PlainLink, size = "sm", }) {
    const md = size === "md";
    return (_jsx("nav", { "aria-label": "Breadcrumb", children: _jsx("ol", { className: `flex flex-wrap items-center gap-2 ${md
                ? "h-8 text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small)"
                : "h-7 text-(length:--type-font-size-caption) leading-(--type-line-height-caption)"}`, children: items.map((item, index) => {
                const last = index === items.length - 1;
                return (_jsxs("li", { className: "flex items-center gap-2", children: [item.href && !last ? (_jsx(LinkAs, { href: item.href, className: `${md ? "text-(--color-content-secondary)" : "text-(--color-content-muted)"} hover:text-(--color-content-primary) hover:underline`, children: item.label })) : (_jsx("span", { className: `text-(--color-content-primary) ${md ? "font-medium" : ""}`, "aria-current": last ? "page" : undefined, children: item.label })), !last && (_jsx("span", { "aria-hidden": true, className: "inline-block size-4 bg-current text-(--color-content-muted)", style: iconMask("chevron-forward") }))] }, item.label));
            }) }) }));
}
export { PlainLink };
