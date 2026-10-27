import type { ReactNode } from "react";
export type BadgeTone = "neutral" | "info" | "success" | "warning" | "error" | "highlight";
/**
 * The NDS Badge (Figma "Badge", 860:4288): a 24px pill, 12px in, caption
 * 12/16 regular, with an optional 8px dot (Status=True) 4px before the
 * text. With an `icon` (16px, like Highlighted's calendar) it's 32px tall.
 * Use it for statuses and labels (Active, Popular, Scheduled); a badge is
 * never a button.
 */
export declare function Badge({ tone, dot, icon, className, children, }: {
    tone?: BadgeTone;
    dot?: boolean;
    /** A 16px icon before the text (decorative: the text says it). */
    icon?: ReactNode;
    className?: string;
    children: ReactNode;
}): import("react").JSX.Element;
