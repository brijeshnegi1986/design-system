import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from "react";
/** Where the tooltip sits around its trigger. The transparent padding on the
 * trigger's side joins the two, so the pointer can move onto the tooltip
 * without it closing (WCAG 1.4.13, hoverable). */
const PLACEMENT = {
    top: "bottom-full left-1/2 -translate-x-1/2 flex-col pb-1",
    bottom: "top-full left-1/2 -translate-x-1/2 flex-col-reverse pt-1",
    left: "right-full top-1/2 -translate-y-1/2 flex-row pr-1",
    right: "left-full top-1/2 -translate-y-1/2 flex-row-reverse pl-1",
};
/** The 10x5 arrow, pointing at the trigger. */
const ARROW = {
    top: "border-x-[5px] border-t-[5px] border-x-transparent border-t-(--color-surface-inverse)",
    bottom: "border-x-[5px] border-b-[5px] border-x-transparent border-b-(--color-surface-inverse)",
    left: "border-y-[5px] border-l-[5px] border-y-transparent border-l-(--color-surface-inverse)",
    right: "border-y-[5px] border-r-[5px] border-y-transparent border-r-(--color-surface-inverse)",
};
/** How long the pointer rests before a tooltip opens, so passing over a row
 * of icons doesn't flash one after another. */
const HOVER_DELAY_MS = 400;
/**
 * The NDS Tooltip (Figma "Tooltip", page 34): a short name for an icon-only
 * control on the inverse surface, caption 12/16, a 4px corner, 8px across
 * and 4px down, with an arrow at the trigger.
 *
 * It opens after a short rest of the pointer, and at once on keyboard focus;
 * it stays while the pointer is over it, and closes on leaving, blur or
 * Escape (WCAG 1.4.13). Touch never opens it, since there's no hover, so it
 * must never be the only place something is said: the control keeps its own
 * accessible name, and the tooltip is hidden from screen readers to avoid
 * saying that name twice.
 */
export function Tooltip({ label, placement = "top", children, }) {
    const [open, setOpen] = useState(false);
    const timer = useRef(undefined);
    const id = useId();
    const show = (wait) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(true), wait);
    };
    const hide = () => {
        clearTimeout(timer.current);
        setOpen(false);
    };
    useEffect(() => () => clearTimeout(timer.current), []);
    useEffect(() => {
        if (!open)
            return;
        const onKey = (event) => {
            if (event.key === "Escape")
                hide();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);
    return (_jsxs("span", { className: "relative inline-flex", onPointerEnter: (event) => event.pointerType !== "touch" && show(HOVER_DELAY_MS), onPointerLeave: hide, onFocus: (event) => {
            // Keyboard focus only: a click also focuses, and shouldn't pop it up.
            const target = event.target;
            if (typeof target.matches !== "function" || target.matches(":focus-visible"))
                show(0);
        }, onBlur: hide, children: [children, open && (_jsxs("span", { id: id, role: "tooltip", "aria-hidden": true, className: `absolute z-50 flex items-center ${PLACEMENT[placement]}`, children: [_jsx("span", { className: "whitespace-nowrap rounded-[4px] bg-(--color-surface-inverse) px-2 py-1 text-(length:--type-font-size-caption) leading-(--type-line-height-caption) text-(--color-content-inverse) shadow-[0_var(--elevation-sm)_2px_rgb(0_0_0/0.1)]", children: label }), _jsx("span", { "aria-hidden": true, className: `size-0 ${ARROW[placement]}` })] }))] }));
}
