import type { ReactNode } from "react";
export type SnackbarLayout = "single-line" | "multi-line";
/**
 * The NDS Snackbar (Figma 865:1594): a short, quiet note about something
 * that just happened, on the raised surface with a 1px subtle edge, 8px
 * corners and the sm elevation; 14/20 regular text, 16px across and 8px
 * down. An optional action is a Plain SM button: after a divider on the
 * same line ("single-line"), or below the text at the right when the
 * message runs to two lines ("multi-line"). For a status (success, failure)
 * use a Toast; for a page-level message, a Banner.
 */
export declare function Snackbar({ action, layout, role, className, children, }: {
    action?: {
        label: string;
        onClick: () => void;
    };
    layout?: SnackbarLayout;
    role?: "status" | "alert" | null;
    className?: string;
    children: ReactNode;
}): import("react").JSX.Element;
