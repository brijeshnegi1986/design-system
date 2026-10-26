import { HTMLAttributes } from "react";
/**
 * The raw class strings, exported for the rare case a "card" needs to be
 * a different element (a Link or button acting as a clickable card, which
 * <Card> - always a <div> - can't become) - still one source of truth for
 * the visual, just not always this component.
 */
export declare const CARD_BASE_CLASS = "rounded-lg border border-(--color-border-subtle) bg-(--color-surface-default) shadow-sm";
export declare const CARD_INTERACTIVE_CLASS = "transition-colors hover:border-(--color-action-primary)/40";
/**
 * The bordered `bg-(--color-surface-default)` container used throughout the app for list
 * containers, detail panels, and grouped content - previously the exact
 * class string `rounded-lg border border-(--color-border-subtle) bg-(--color-surface-default)` copy-pasted
 * independently across a dozen+ files (see the Phase 1 audit). Centralized
 * here so a future visual change (radius, border weight, shadow) is one
 * edit, not a grep-and-replace.
 *
 * `padded` covers the common case (an isolated card with its own
 * breathing room); pass `padded={false}` for a container whose children
 * already manage their own padding per row (most list containers, which
 * add `px-5` and rely on each row for vertical padding).
 */
export declare function Card({ padded, interactive, className, ...props }: HTMLAttributes<HTMLDivElement> & {
    padded?: boolean;
    interactive?: boolean;
}): import("react").JSX.Element;
