/**
 * The NDS Search field (Figma "SearchField", 836:1549): a 40px pill with the
 * input border, a 20px search icon and the query, for filtering a list in a
 * toolbar. A clear button appears once there's a query. The text is 16px on
 * phones (anything smaller makes iOS zoom the page) and 14px from `sm` up.
 * Needs an accessible name: `aria-label`, or `label` for a visible one.
 */
export declare function SearchField({ value, onChange, placeholder, label, "aria-label": ariaLabel, id, disabled, className, }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    /** A visible label above the field. */
    label?: string;
    "aria-label"?: string;
    id?: string;
    disabled?: boolean;
    className?: string;
}): import("react").JSX.Element;
