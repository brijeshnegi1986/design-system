import { type ReactNode } from "react";
export type ActionMenuItem = {
    label: string;
    onSelect: () => void;
    disabled?: boolean;
    /** "danger" for a destructive action (red text). */
    tone?: "default" | "danger";
    /** A 20px icon before the label (a channel's logo). */
    icon?: ReactNode;
};
/**
 * A row's "⋯" menu of actions (an admin table's Edit, Set up, Archive): one
 * 32px icon button that opens a short list, so a row shows one control
 * instead of four. Named by `label` ("Actions for Growth"). Opening focuses
 * the first action; the arrow keys move, Escape or a click elsewhere closes,
 * and focus goes back to the button. Running an action closes the menu.
 *
 * `kind="add"` makes it an Add button instead: a 44px dashed round "+" (a
 * row of channel toggles' "+ Add channel"), whose menu opens to the right.
 */
export declare function ActionMenu({ label, items, kind, className, }: {
    label: string;
    items: ActionMenuItem[];
    kind?: "more" | "add";
    className?: string;
}): import("react").JSX.Element;
