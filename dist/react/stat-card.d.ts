import type { ReactNode } from "react";
/**
 * The NDS Stat card (Figma "Stat card", 893:113): one number and what it
 * counts, for dashboards, usage against a plan and admin analytics. The label
 * (14/20 medium, secondary) sits on top with an optional 36px icon tile at
 * the right, the value below it (32/40 semibold, tabular figures), then a
 * caption (12/16, muted). `trend` adds a Positive (up) or Negative (down)
 * badge with the change before the caption - pass `good: false` when going
 * up is bad news (say, failed posts).
 */
export declare function StatCard({ label, value, caption, trend, icon, className, }: {
    label: ReactNode;
    value: ReactNode;
    caption?: ReactNode;
    trend?: {
        direction: "up" | "down";
        label: string;
        good?: boolean;
    };
    /** A 20px icon, shown in the tile at the top right. */
    icon?: ReactNode;
    className?: string;
}): import("react").JSX.Element;
