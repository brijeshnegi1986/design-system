"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
/**
 * The NDS Tabs (Figma "Tab item", 124:1558): a tab list of 44px tabs, 12px
 * across and 8px down, 14/20 medium. The active tab is marked by a 2px
 * orange underline, its label in the primary text colour (orange text would
 * be under 4.5:1 on white). Arrow keys, Home and End move between tabs; only
 * the active tab is in the Tab order. Pass `panelId` for the content each
 * tab shows (give that element role="tabpanel").
 */
export function Tabs({ label, items, value, onChange, panelId, className = "", }) {
    const refs = useRef([]);
    const index = Math.max(0, items.findIndex((item) => item.value === value));
    function move(event) {
        const last = items.length - 1;
        const next = event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
            : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
                : event.key === "Home" ? 0
                    : event.key === "End" ? last
                        : null;
        if (next === null)
            return;
        event.preventDefault();
        onChange(items[next].value);
        refs.current[next]?.focus();
    }
    return (_jsx("div", { role: "tablist", "aria-label": label, className: `flex flex-wrap gap-1 border-b border-(--color-border-subtle) ${className}`.trim(), children: items.map((item, i) => {
            const active = i === index;
            return (_jsxs("button", { ref: (el) => {
                    refs.current[i] = el;
                }, type: "button", role: "tab", "aria-selected": active, "aria-controls": panelId, tabIndex: active ? 0 : -1, onClick: () => onChange(item.value), onKeyDown: move, className: `-mb-px inline-flex h-11 items-center gap-1.5 border-b-2 px-3 py-2 text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--color-border-focus) ${active
                    ? "border-(--color-action-primary) text-(--color-content-primary)"
                    : "border-transparent text-(--color-content-secondary) hover:text-(--color-content-primary)"}`, children: [item.label, item.count !== undefined && (_jsx("span", { className: "text-(length:--type-font-size-caption) leading-(--type-line-height-caption) font-normal text-(--color-content-muted) tabular-nums", children: item.count }))] }, item.value));
        }) }));
}
