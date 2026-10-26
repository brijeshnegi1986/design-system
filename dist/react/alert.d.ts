import type { ReactNode } from "react";
export type AlertTone = "neutral" | "info" | "success" | "warning" | "error";
/**
 * The NDS Alert (Figma "Alert", 426:540): the status's subtle fill, a 4px
 * stripe in the status colour down the left, a 20px filled status icon (info,
 * check circle, warning, error) beside an optional 14/20 medium title in the
 * status colour, then the 14/20 message in the primary text colour. 8px
 * corners, the sm elevation, 16px across and 12px down. An error is announced
 * at once (role="alert"); the others politely (role="status"); pass role={null}
 * for a step the person is already looking at, like a delete confirmation.
 */
export declare function Alert({ tone, title, icon, role, className, children, ...rest }: {
    tone?: AlertTone;
    title?: ReactNode;
    /** Replaces the tone's icon (e.g. the safety notice's shield). */
    icon?: ReactNode;
    role?: "alert" | "status" | null;
    className?: string;
    children?: ReactNode;
    "data-testid"?: string;
}): import("react").JSX.Element;
