import { HTMLAttributes } from "react";
/**
 * The raw class strings, exported for the rare case a "card" needs to be
 * a different element (a Link or button acting as a clickable card, which
 * <Card> - always a <div> - can't become) - still one source of truth for
 * the visual, just not always this component.
 *
 * The NDS Card (Figma "Card", 892:128): the default surface, a 1px subtle
 * edge, radius-lg (12px), the sm elevation and 24px padding.
 */
export declare const CARD_BASE_CLASS = "rounded-(--radius-lg) border border-(--color-border-subtle) bg-(--color-surface-default) shadow-[0_var(--elevation-sm)_2px_rgb(0_0_0/0.1)]";
/** Hover (Figma State=Hover): the strong edge and the md elevation, for a
 * card that is itself a link or button. */
export declare const CARD_INTERACTIVE_CLASS = "transition-[border-color,box-shadow] hover:border-(--color-border-strong) hover:shadow-[0_var(--elevation-md)_6px_rgb(0_0_0/0.1)]";
/** Selected (Figma State=Selected): a 2px primary edge, drawn as an inset
 * ring so the card doesn't grow. */
export declare const CARD_SELECTED_CLASS = "border-(--color-border-primary) ring-1 ring-inset ring-(--color-border-primary)";
/**
 * The bordered container used throughout an app for list containers, detail
 * panels and grouped content.
 *
 * `padded` covers the common case (an isolated card with its own 24px of
 * breathing room); pass `padded={false}` for a container whose children
 * manage their own padding per row (most list containers, which add `px-6`
 * and rely on each row for vertical padding). `interactive` adds the hover
 * state, `selected` the chosen state.
 */
export declare function Card({ padded, interactive, selected, className, ...props }: HTMLAttributes<HTMLDivElement> & {
    padded?: boolean;
    interactive?: boolean;
    selected?: boolean;
}): import("react").JSX.Element;
