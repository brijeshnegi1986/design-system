import type { ReactNode } from "react";
/**
 * The NDS Empty state card (Figma "Empty state card", 897:148): what a list
 * or page shows before it has anything in it. A dashed strong edge, an icon
 * in a 48px raised tile, the title (18/28 semibold), one or two lines on why
 * it matters (14/20, secondary, at most 400px wide), then the one action that
 * fills it. Use the orange Primary only for Create post or sign-up; anything
 * else is a Secondary button.
 */
export declare function EmptyState({ title, icon, action, children, className, }: {
    title: ReactNode;
    /** A 24px icon for the tile. */
    icon?: ReactNode;
    /** A Button or a link styled as one. */
    action?: ReactNode;
    children?: ReactNode;
    className?: string;
}): import("react").JSX.Element;
