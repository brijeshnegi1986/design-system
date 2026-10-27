import type { ReactNode } from "react";
/**
 * The NDS Tag (Figma "Tag", Badge page): a content label such as a hashtag,
 * a channel or a topic. Neutral and outlined: the raised fill, a subtle
 * edge, caption 12/16 regular, 24px tall, 8px in, with an optional 16px
 * leading icon (a channel's logo) 4px before the text. A long label is cut
 * short with an ellipsis rather than overflowing.
 *
 * Not a status (that's a Badge, a tinted fill) and not interactive (a choice
 * is a Chip).
 */
export declare function Tag({ icon, className, children, }: {
    /** A 16px icon before the text (decorative: the text names it). */
    icon?: ReactNode;
    className?: string;
    children: ReactNode;
}): import("react").JSX.Element;
