import type { ReactNode } from "react";
/**
 * A summary or secondary navigation beside a page's main content (Figma
 * "Side panel", page 35): a profile's steps and who it writes as, the free
 * trial's progress next to the setup checklist, a post's AI review. The
 * sidebar's raised grey with no edge or shadow, so it reads as secondary to
 * the white card being worked on rather than competing with it. Inside it,
 * a current item is white, like the sidebar's active item.
 *
 * Its partner is TipPanel (the aqua tip surface), for help and tips. Pick by
 * what it says: help is a TipPanel, a summary or navigation is a SidePanel.
 *
 * An <aside> named by `label`, or by a heading inside it via `labelledBy`.
 *
 * `collapse` lets people push it in and pull it out (a preview beside a
 * form, a tray beside a calendar). It then shows its own header: `label` as
 * the title and a 40px handle. Pushed in, it's a 48px strip with the handle
 * and the name on wide screens (xl), and a one-line "Show …" bar below that.
 * The page keeps the open/closed state (and may remember it).
 */
export declare function SidePanel({ label, labelledBy, className, collapse, children, }: {
    label?: string;
    labelledBy?: string;
    className?: string;
    collapse?: {
        open: boolean;
        onToggle: () => void;
        /** Which edge it sits on: the handle points that way to push it in. */
        side: "left" | "right";
        /** The id of the content it hides, for aria-controls. */
        controls?: string;
    };
    children: ReactNode;
}): import("react").JSX.Element;
