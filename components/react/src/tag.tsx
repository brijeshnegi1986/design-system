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
export function Tag({
  icon,
  className = "",
  children,
}: {
  /** A 16px icon before the text (decorative: the text names it). */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex h-6 max-w-full min-w-0 shrink-0 items-center gap-1 rounded-full border border-(--color-border-subtle) bg-(--color-surface-raised) px-2 text-(length:--type-font-size-caption) leading-(--type-line-height-caption) text-(--color-content-primary) ${className}`.trim()}
    >
      {icon && (
        <span aria-hidden className="flex size-4 shrink-0 items-center justify-center">
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}
