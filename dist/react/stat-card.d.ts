import type { ReactNode } from "react";
/**
 * The NDS Stat card (Figma "Stat card", 893:113): one number and what it
 * counts, for dashboards, usage against a plan and admin analytics. The label
 * (14/20 medium, secondary) sits on top with an optional 36px icon tile at
 * the right, the value below it (32/40 semibold, tabular figures), then a
 * caption (12/16, muted). `trend` adds a Positive (up) or Negative (down)
 * badge with the change before the caption - pass `good: false` when going
 * up is bad news (say, failed posts). `meter` adds a bar under the value for
 * usage against a limit; it turns to the warning colour once the limit is
 * reached.
 *
 * It goes compact by itself when the card is narrow (under 15rem, say two to
 * a row on a phone): 16px padding and a 24px value. The label and caption
 * keep their sizes and wrap, so it reads the same, just smaller.
 */
export declare function StatCard({ label, value, caption, trend, meter, icon, className, }: {
    label: ReactNode;
    value: ReactNode;
    caption?: ReactNode;
    trend?: {
        direction: "up" | "down";
        label: string;
        good?: boolean;
    };
    /** Usage against a limit, drawn as a bar under the value. */
    meter?: {
        value: number;
        max: number;
    };
    /** A 20px icon, shown in the tile at the top right. */
    icon?: ReactNode;
    className?: string;
}): import("react").JSX.Element;
