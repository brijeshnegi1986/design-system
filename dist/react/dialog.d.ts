import { type ReactNode } from "react";
/**
 * The NDS Modal (Figma "Modal", 898:133): a dialog for a decision or a short
 * form that needs full attention; an inline panel is usually enough. Over the
 * overlay scrim: the default surface, radius-xl (16px), the lg elevation and
 * 24px padding. The title (18/28 semibold) and an optional line of context
 * sit beside the close button, then the content, then `actions` at the right
 * (Cancel first, the confirming button last).
 *
 * - size: "sm" (400px) for confirmations, "md" (560px) for forms.
 * - tone: "destructive" adds the warning mark in the error tint; pair it with
 *   a destructive confirm button.
 *
 * Escape, a click on the backdrop or the close button calls onClose. Focus
 * moves into the dialog when it opens, Tab stays inside it, and focus goes
 * back to whatever opened it when it closes - only on opening and closing,
 * never on a re-render, so typing in a field inside it keeps its focus.
 */
export declare function Dialog({ open, onClose, title, description, size, tone, actions, children, }: {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: ReactNode;
    size?: "sm" | "md";
    tone?: "default" | "destructive";
    /** The footer buttons, right-aligned. */
    actions?: ReactNode;
    children?: ReactNode;
}): import("react").JSX.Element | null;
