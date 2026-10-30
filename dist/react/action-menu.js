"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from "react";
/**
 * A row's "⋯" menu of actions (an admin table's Edit, Set up, Archive): one
 * 32px icon button that opens a short list, so a row shows one control
 * instead of four. Named by `label` ("Actions for Growth"). Opening focuses
 * the first action; the arrow keys move, Escape or a click elsewhere closes,
 * and focus goes back to the button. Running an action closes the menu.
 */
export function ActionMenu({ label, items, className = "" }) {
    const [open, setOpen] = useState(false);
    const button = useRef(null);
    const menu = useRef(null);
    const menuId = useId();
    function close(refocus) {
        setOpen(false);
        if (refocus)
            button.current?.focus();
    }
    useEffect(() => {
        if (!open)
            return;
        menu.current?.querySelector("[role='menuitem']:not(:disabled)")?.focus();
        const outside = (event) => {
            const target = event.target;
            if (!menu.current?.contains(target) && !button.current?.contains(target))
                setOpen(false);
        };
        document.addEventListener("mousedown", outside);
        return () => document.removeEventListener("mousedown", outside);
    }, [open]);
    function onKeyDown(event) {
        const all = [...(menu.current?.querySelectorAll("[role='menuitem']:not(:disabled)") ?? [])];
        const at = all.indexOf(document.activeElement);
        if (event.key === "Escape") {
            event.preventDefault();
            close(true);
        }
        else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const step = event.key === "ArrowDown" ? 1 : -1;
            all[(at + step + all.length) % all.length]?.focus();
        }
        else if (event.key === "Tab") {
            setOpen(false);
        }
    }
    return (_jsxs("div", { className: `relative inline-block ${className}`.trim(), children: [_jsx("button", { ref: button, type: "button", "aria-label": label, title: label, "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? menuId : undefined, onClick: () => setOpen((o) => !o), className: "flex size-8 items-center justify-center rounded-full text-(--color-content-secondary) transition-colors hover:bg-(--color-action-tertiary-hover) hover:text-(--color-content-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)", children: _jsxs("svg", { "aria-hidden": true, viewBox: "0 0 20 20", className: "size-5", fill: "currentColor", children: [_jsx("circle", { cx: "4.5", cy: "10", r: "1.5" }), _jsx("circle", { cx: "10", cy: "10", r: "1.5" }), _jsx("circle", { cx: "15.5", cy: "10", r: "1.5" })] }) }), open && (_jsx("div", { ref: menu, id: menuId, role: "menu", "aria-label": label, onKeyDown: onKeyDown, className: "absolute right-0 z-30 mt-1 flex min-w-44 flex-col rounded-(--radius-lg) border border-(--color-border-subtle) bg-(--color-surface-default) p-1 shadow-[0_var(--elevation-lg)_24px_rgb(0_0_0/0.16)]", children: items.map((item) => (_jsx("button", { type: "button", role: "menuitem", disabled: item.disabled, onClick: () => {
                        close(true);
                        item.onSelect();
                    }, className: `rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-(--color-action-tertiary-hover) focus-visible:bg-(--color-action-tertiary-hover) focus-visible:outline-none disabled:cursor-not-allowed disabled:text-(--color-content-disabled) disabled:hover:bg-transparent ${item.tone === "danger" ? "text-(--color-status-error)" : "text-(--color-content-primary)"}`, children: item.label }, item.label))) }))] }));
}
