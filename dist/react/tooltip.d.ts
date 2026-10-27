import { type ReactNode } from "react";
export type TooltipPlacement = "top" | "bottom" | "left" | "right";
/**
 * The NDS Tooltip (Figma "Tooltip", page 34): a short name for an icon-only
 * control on the inverse surface, caption 12/16, a 4px corner, 8px across
 * and 4px down, with an arrow at the trigger.
 *
 * It opens after a short rest of the pointer, and at once on keyboard focus;
 * it stays while the pointer is over it, and closes on leaving, blur or
 * Escape (WCAG 1.4.13). Touch never opens it, since there's no hover, so it
 * must never be the only place something is said: the control keeps its own
 * accessible name, and the tooltip is hidden from screen readers to avoid
 * saying that name twice.
 */
export declare function Tooltip({ label, placement, children, }: {
    label: string;
    placement?: TooltipPlacement;
    children: ReactNode;
}): import("react").JSX.Element;
