export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
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
 * `size="inline"` is the 24px pill (Figma Size=Inline) used inside a sentence (e.g. Create post's tone),
 * opening the Dropdown SM menu (835:1406) with its pointer.
 */
export declare function Select({ value, onChange, options, placeholder, disabled, id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, invalid, size, surface, className, }: {
    value: string;
    onChange: (value: string) => void;
    options: readonly SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    invalid?: boolean;
    size?: "md" | "inline";
    surface?: "default" | "raised";
    /** Width and spacing for the whole control. */
    className?: string;
}): import("react").JSX.Element;
