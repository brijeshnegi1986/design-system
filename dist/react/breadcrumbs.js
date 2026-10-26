import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { iconMask } from "./icons.js";
function PlainLink({ href, className, children }) {
    return (_jsx("a", { href: href, className: className, children: children }));
}
/** NDS "Breadcrumbs" (Figma 140:719): a caption 12/16 trail, muted links,
 * the current page in the primary text colour, 16px chevrons 8px apart. */
export function Breadcrumbs({ items, linkAs: LinkAs = PlainLink, }) {
    return (_jsx("nav", { "aria-label": "Breadcrumb", children: _jsx("ol", { className: "flex h-7 flex-wrap items-center gap-2 text-(length:--type-font-size-caption) leading-(--type-line-height-caption)", children: items.map((item, index) => {
                const last = index === items.length - 1;
                return (_jsxs("li", { className: "flex items-center gap-2", children: [item.href && !last ? (_jsx(LinkAs, { href: item.href, className: "text-(--color-content-muted) hover:text-(--color-content-primary) hover:underline", children: item.label })) : (_jsx("span", { className: "text-(--color-content-primary)", "aria-current": last ? "page" : undefined, children: item.label })), !last && (_jsx("span", { "aria-hidden": true, className: "inline-block size-4 bg-current text-(--color-content-muted)", style: iconMask("chevron-forward") }))] }, item.label));
            }) }) }));
}
export { PlainLink };
