"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from "react";
import { iconMask } from "./icons.js";
/** The NDS icon files, drawn as masks so they take the current text colour. */
function Icon({ file, className }) {
    return (_jsx("span", { "aria-hidden": true, className: `inline-block shrink-0 bg-current ${className}`, style: iconMask(file) }));
}
/**
 * The NDS dropdown (Figma "Dropdown Example", node 820:453, and its
 * SelectField, 127:3439), in place of the browser's own <select>:
 *
 * - The field: a 48px pill on `border-(--color-border-input)`, 12px in, the value (or a muted
 *   placeholder), then a divider and a chevron that turns up while open.
 *   Hover turns the border `border-focus`; focus draws the 2px ring.
 * - The menu, 4px below: `surface-default`, an 8px corner, 12px in, the
 *   elevation/sm shadow, with a divider between items. An item (Dropdown
 *   Item, 637:1480) is 14px regular, 12px in; hover is
 *   `action-secondary-hover`, the chosen one stays white with the orange
 *   tick at the right, a disabled one is `action-disabled` with
 *   `content-disabled` text.
 *
 * Keyboard and screen readers follow the ARIA "select-only combobox"
 * pattern: the field is a combobox button, the menu a listbox. Arrow keys,
 * Home/End and typing a letter move the highlight; Enter or Space chooses;
 * Escape or Tab closes. It opens upwards when there isn't room below.
 *
 * Sizes follow Figma: "md" 48px (LG, forms), "sm" 40px and "compact" 36px
 * (toolbars and filters), and `size="inline"`, the 24px pill (Figma Size=Inline) used inside a sentence (e.g. Create post's tone),
 * opening the Dropdown SM menu (835:1406) with its pointer.
 */
export function Select({ value, onChange, options, placeholder = "Select", disabled = false, id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, invalid = false, size = "md", prefix, surface = "default", className = "", }) {
    const fallbackId = useId();
    const buttonId = id ?? `select-${fallbackId}`;
    const listId = `${buttonId}-list`;
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const [above, setAbove] = useState(false);
    // Where the menu sits on screen. It's pinned there (position: fixed), not
    // placed inside the field's box, so a dialog or panel that scrolls its
    // content can't clip it.
    const [place, setPlace] = useState(null);
    // The menu opens on the chosen item, which stays white with its tick (the
    // design's Selected state); the grey hover appears once someone moves.
    const [moved, setMoved] = useState(false);
    const rootRef = useRef(null);
    const buttonRef = useRef(null);
    const listRef = useRef(null);
    const typed = useRef({ text: "", at: 0 });
    const selectedIndex = options.findIndex((o) => o.value === value);
    const selected = selectedIndex >= 0 ? options[selectedIndex] : null;
    // A click anywhere else closes the menu.
    useEffect(() => {
        if (!open)
            return;
        function onPointerDown(event) {
            if (!rootRef.current?.contains(event.target))
                setOpen(false);
        }
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);
    // Pinned to the screen, it would drift from its field if the page or a
    // dialog scrolled, so a scroll anywhere but the list itself closes it.
    useEffect(() => {
        if (!open)
            return;
        function onScroll(event) {
            if (event.target instanceof Node && listRef.current?.contains(event.target))
                return;
            setOpen(false);
        }
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onScroll);
        };
    }, [open]);
    // Keep the highlighted item in view in a long list.
    useEffect(() => {
        if (!open || active < 0)
            return;
        listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView?.({ block: "nearest" });
    }, [open, active]);
    function enabledFrom(start, step) {
        for (let i = start; i >= 0 && i < options.length; i += step) {
            if (!options[i].disabled)
                return i;
        }
        return -1;
    }
    function openMenu(highlight = selectedIndex >= 0 ? selectedIndex : enabledFrom(0, 1)) {
        if (disabled)
            return;
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
            const up = window.innerHeight - rect.bottom < 280 && rect.top > window.innerHeight - rect.bottom;
            setAbove(up);
            setPlace(up
                ? { left: rect.left, width: rect.width, bottom: window.innerHeight - rect.top }
                : { left: rect.left, width: rect.width, top: rect.bottom });
        }
        setMoved(false);
        setActive(highlight);
        setOpen(true);
    }
    function choose(index) {
        const option = options[index];
        if (!option || option.disabled)
            return;
        setOpen(false);
        buttonRef.current?.focus();
        if (option.value !== value)
            onChange(option.value);
    }
    // `now` is the key event's timestamp: typing pauses are timed from the
    // events themselves, not the clock.
    function typeAhead(key, now) {
        typed.current = { text: now - typed.current.at < 600 ? typed.current.text + key : key, at: now };
        const match = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(typed.current.text.toLowerCase()));
        if (match >= 0) {
            if (open)
                setActive(match);
            else
                openMenu(match);
        }
    }
    function onKeyDown(event) {
        if (disabled)
            return;
        const { key } = event;
        if (!open) {
            if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
                event.preventDefault();
                openMenu(key === "ArrowUp" ? enabledFrom(options.length - 1, -1) : undefined);
            }
            else if (key.length === 1) {
                typeAhead(key, event.timeStamp);
            }
            return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key) || key.length === 1)
            setMoved(true);
        if (key === "ArrowDown") {
            event.preventDefault();
            setActive((i) => (enabledFrom(i + 1, 1) >= 0 ? enabledFrom(i + 1, 1) : i));
        }
        else if (key === "ArrowUp") {
            event.preventDefault();
            setActive((i) => (enabledFrom(i - 1, -1) >= 0 ? enabledFrom(i - 1, -1) : i));
        }
        else if (key === "Home") {
            event.preventDefault();
            setActive(enabledFrom(0, 1));
        }
        else if (key === "End") {
            event.preventDefault();
            setActive(enabledFrom(options.length - 1, -1));
        }
        else if (key === "Enter" || key === " ") {
            event.preventDefault();
            choose(active);
        }
        else if (key === "Escape") {
            event.preventDefault();
            setOpen(false);
        }
        else if (key === "Tab") {
            setOpen(false);
        }
        else if (key.length === 1) {
            typeAhead(key, event.timeStamp);
        }
    }
    const small = size === "inline";
    const field = {
        inline: "h-6 gap-1.5 px-2 text-xs",
        compact: "h-9 gap-2 px-3 text-sm",
        sm: "h-10 gap-2 px-3 text-sm",
        md: "h-12 gap-2 px-3 text-base",
    }[size];
    const background = surface === "raised" ? "bg-(--color-surface-raised)" : "bg-(--color-surface-default)";
    const border = invalid ? "border-(--color-border-error)" : "border-(--color-border-input) hover:border-(--color-border-focus)";
    const optionItems = options.map((option, index) => {
        const isSelected = index === selectedIndex;
        const isActive = index === active;
        return (_jsxs("li", { id: `${listId}-${index}`, "data-index": index, role: "option", "aria-selected": isSelected, "aria-disabled": option.disabled || undefined, "data-separator": option.separatorBefore || undefined, 
            // Mouse down, not click, so the button keeps focus.
            onMouseDown: (event) => event.preventDefault(), onClick: () => choose(index), onMouseEnter: () => {
                if (option.disabled)
                    return;
                setMoved(true);
                setActive(index);
            }, className: `flex items-center justify-between border-b border-(--color-border-subtle) font-normal last:border-b-0 ${option.separatorBefore ? "mt-1.5 border-t-2 border-t-(--color-border-strong) pt-1.5" : ""} ${small ? "h-[34px] gap-2 px-3 py-1 text-xs" : "gap-3 p-3 text-sm"} ${option.disabled
                ? "cursor-not-allowed bg-(--color-action-disabled) text-(--color-content-disabled)"
                : `cursor-pointer text-(--color-content-primary) ${isActive && (moved || !isSelected) ? "bg-(--color-action-tertiary-hover)" : "bg-(--color-surface-default)"}`}`, children: [option.icon && (_jsx("span", { "aria-hidden": true, className: "flex size-5 shrink-0 items-center justify-center text-(--color-content-secondary)", children: option.icon })), _jsx("span", { className: "min-w-0 flex-1", children: option.label }), isSelected && _jsx(Icon, { file: "check", className: `text-(--color-content-link) ${small ? "size-4" : "size-5"}` })] }, option.value));
    });
    return (_jsxs("div", { ref: rootRef, className: `relative ${small ? "inline-block" : "w-full"} ${className}`, children: [_jsxs("button", { ref: buttonRef, id: buttonId, type: "button", role: "combobox", "aria-haspopup": "listbox", "aria-expanded": open, "aria-controls": listId, "aria-activedescendant": open && active >= 0 ? `${listId}-${active}` : undefined, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, "aria-invalid": invalid || undefined, disabled: disabled, onClick: () => (open ? setOpen(false) : openMenu()), onKeyDown: onKeyDown, className: `flex w-full items-center rounded-full border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus) disabled:cursor-not-allowed disabled:border-(--color-border-disabled) disabled:bg-(--color-action-disabled) disabled:text-(--color-content-disabled) ${field} ${background} ${border}`, children: [selected?.icon && (_jsx("span", { "aria-hidden": true, className: "flex size-5 shrink-0 items-center justify-center text-(--color-content-secondary)", children: selected.icon })), _jsxs("span", { className: `min-w-0 flex-1 truncate ${selected ? "text-(--color-content-primary)" : "text-(--color-content-muted)"}`, children: [prefix && _jsxs("span", { "data-part": "prefix", className: "text-(--color-content-secondary)", children: [prefix, ": "] }), selected ? selected.label : placeholder] }), _jsx("span", { "aria-hidden": true, className: `w-px shrink-0 bg-(--color-border-subtle) ${small ? "h-3.5" : size === "md" ? "h-[22.5px]" : "h-5"}` }), _jsx(Icon, { file: "keyboard-arrow-down", className: `text-(--color-content-secondary) transition-transform ${small ? "size-4" : "size-5"} ${open ? "rotate-180" : ""}` })] }), open && small && (
            // Dropdown SM (Figma 835:1406): 163px wide, centred under the field
            // with the pointer ("nob") aiming at it, 8px top and bottom, rows of
            // 12px regular text 34px tall. The shadow is a drop-shadow on the
            // wrapper so it follows the pointer too.
            _jsxs("div", { className: `fixed z-50 -translate-x-1/2 drop-shadow-[0_var(--elevation-sm)_1px_rgb(0_0_0/0.1)] ${above ? "mb-3" : "mt-3"}`, style: place ? { left: place.left + place.width / 2, top: place.top, bottom: place.bottom } : undefined, children: [_jsx("span", { "aria-hidden": true, "data-dropdown-nob": true, className: `absolute left-1/2 h-[11.625px] w-[17.75px] -translate-x-1/2 bg-(--color-surface-default) ${above ? "-bottom-2.5 rotate-180" : "-top-2.5"}`, style: iconMask("dropdown-nob") }), _jsx("ul", { ref: listRef, id: listId, role: "listbox", "aria-labelledby": ariaLabelledBy ?? buttonId, className: "relative flex max-h-72 w-[163px] flex-col overflow-y-auto rounded-md bg-(--color-surface-default) py-2", children: optionItems })] })), open && !small && (_jsx("ul", { ref: listRef, id: listId, role: "listbox", "aria-labelledby": ariaLabelledBy ?? buttonId, className: `fixed z-50 flex max-h-72 flex-col overflow-y-auto rounded-md bg-(--color-surface-default) p-3 shadow-[0_var(--elevation-sm)_1px_rgb(0_0_0/0.1),0_4px_16px_rgb(0_0_0/0.08)] ${above ? "mb-1" : "mt-1"}`, style: place ? { left: place.left, minWidth: place.width, top: place.top, bottom: place.bottom } : undefined, children: optionItems }))] }));
}
