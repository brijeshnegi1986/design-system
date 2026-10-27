import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The NDS Tag (Figma "Tag", Badge page): a content label such as a hashtag,
 * a channel or a topic. Neutral and outlined: the raised fill, a subtle
 * edge, caption 12/16 regular, 24px tall, 8px in, with an optional 16px
 * leading icon (a channel's logo) 4px before the text. A long label is cut
 * short with an ellipsis rather than overflowing.
 *
 * Not a status (that's a Badge, a tinted fill) and not interactive (a choice
 * is a Chip).
 */
export function Tag({ icon, className = "", children, }) {
    return (_jsxs("span", { className: `inline-flex h-6 max-w-full min-w-0 shrink-0 items-center gap-1 rounded-full border border-(--color-border-subtle) bg-(--color-surface-raised) px-2 text-(length:--type-font-size-caption) leading-(--type-line-height-caption) text-(--color-content-primary) ${className}`.trim(), children: [icon && (_jsx("span", { "aria-hidden": true, className: "flex size-4 shrink-0 items-center justify-center", children: icon })), _jsx("span", { className: "truncate", children: children })] }));
}
