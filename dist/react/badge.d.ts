import type { ReactNode } from "react";
export type BadgeTone = "neutral" | "info" | "success" | "warning" | "error" | "highlight";
/**
 * The NDS Badge (Figma "Badge", 860:4288): a 24px pill, 12px in, caption
 * 12/16 medium, with an optional 8px dot in the tone's colour 4px before the
 * text. Use it for statuses and labels (Active, Popular, Scheduled); a badge
 * is never a button.
 */
export declare function Badge({ tone, dot, className, children, }: {
    tone?: BadgeTone;
    dot?: boolean;
    className?: string;
    children: ReactNode;
}): import("react").JSX.Element;
