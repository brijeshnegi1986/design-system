"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { iconMask } from "./icons.js";
/** The global native-field rules in styles.css size every <input> at 48px
 * and are unlayered, so they beat utility classes; the inner input of this
 * field is sized and stripped inline instead, and the visible box is the
 * wrapper. */
const BARE_INPUT = {
    height: "100%",
    border: 0,
    borderRadius: 0,
    background: "transparent",
    outline: "none",
    padding: 0,
    boxShadow: "none",
};
/**
 * The NDS Search field (Figma "SearchField", 836:1549): a 40px pill with the
 * input border, a 20px search icon and the query, for filtering a list in a
 * toolbar. A clear button appears once there's a query. The text is 16px on
 * phones (anything smaller makes iOS zoom the page) and 14px from `sm` up.
 * Needs an accessible name: `aria-label`, or `label` for a visible one.
 */
export function SearchField({ value, onChange, placeholder = "Search", label, "aria-label": ariaLabel, id, disabled = false, className = "", }) {
    const inputRef = useRef(null);
    const field = (_jsxs("div", { className: `flex h-10 items-center gap-2 rounded-full border px-3 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--color-border-focus) ${disabled
            ? "border-(--color-border-disabled) bg-(--color-action-disabled) text-(--color-content-disabled)"
            : "border-(--color-border-input) bg-(--color-surface-default) hover:border-(--color-border-focus)"} ${label ? "" : className}`.trim(), children: [_jsx("span", { "aria-hidden": true, className: "size-5 shrink-0 bg-current text-(--color-content-muted)", style: iconMask("search") }), _jsx("input", { ref: inputRef, id: id, type: "search", "data-shape": "bare", value: value, onChange: (e) => onChange(e.target.value), onKeyDown: (e) => {
                    if (e.key === "Escape" && value) {
                        e.preventDefault();
                        onChange("");
                    }
                }, placeholder: placeholder, "aria-label": label ? undefined : ariaLabel, disabled: disabled, style: BARE_INPUT, className: "min-w-0 flex-1 text-base text-(--color-content-primary) placeholder:text-(--color-content-muted) sm:text-sm [&::-webkit-search-cancel-button]:appearance-none" }), value && !disabled && (_jsx("button", { type: "button", "aria-label": "Clear search", onClick: () => {
                    onChange("");
                    inputRef.current?.focus();
                }, className: "flex size-6 shrink-0 items-center justify-center rounded-full text-(--color-content-secondary) hover:bg-(--color-action-tertiary-hover) focus-visible:outline-2 focus-visible:outline-(--color-border-focus)", children: _jsx("span", { "aria-hidden": true, className: "size-4 bg-current", style: iconMask("close") }) }))] }));
    if (!label)
        return field;
    return (_jsxs("label", { className: `flex flex-col gap-2 ${className}`.trim(), children: [_jsx("span", { className: "text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) font-medium text-(--color-content-primary)", children: label }), field] }));
}
