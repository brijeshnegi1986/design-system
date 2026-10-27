import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "error" | "highlight";

/** Each Figma variant (Badge, 860:4288): its fill and text. Status colours
 * are the status's text on its subtle fill. Neutral is action/disabled with
 * content/primary text: Figma's content/on-accent is near-black in both
 * modes and unreadable on Dark's neutral-700, so the text follows the mode.
 * Highlighted is the brand's lime (brand-color-accent-dark), one fixed
 * value, with on-accent text. */
const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-(--color-action-disabled) text-(--color-content-primary)", // Figma Neutral
  info: "bg-(--color-status-info-subtle) text-(--color-status-info)", // Figma Required
  success: "bg-(--color-status-success-subtle) text-(--color-status-success)", // Figma Positive
  warning: "bg-(--color-status-warning-subtle) text-(--color-status-warning)", // Figma Action
  error: "bg-(--color-status-error-subtle) text-(--color-status-error)", // Figma Negative
  highlight: "bg-(--brand-color-accent-dark) text-(--color-content-on-accent)", // Figma Highlighted
};

/** The 8px dot (Figma Status=True): the tone's colour, but Neutral's is
 * muted, quieter than its text. */
const DOT_CLASSES: Partial<Record<BadgeTone, string>> = {
  neutral: "bg-(--color-content-muted)",
};

/**
 * The NDS Badge (Figma "Badge", 860:4288): a 24px pill, 12px in, caption
 * 12/16 regular, with an optional 8px dot (Status=True) 4px before the
 * text. With an `icon` (16px, like Highlighted's calendar) it's 32px tall.
 * Use it for statuses and labels (Active, Popular, Scheduled); a badge is
 * never a button.
 */
export function Badge({
  tone = "neutral",
  dot = false,
  icon,
  className = "",
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  /** A 16px icon before the text (decorative: the text says it). */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex ${icon ? "h-8" : "h-6"} shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 text-(length:--type-font-size-caption) leading-(--type-line-height-caption) font-normal ${TONE_CLASSES[tone]} ${className}`.trim()}
    >
      {dot && <span aria-hidden className={`size-2 shrink-0 rounded-full ${DOT_CLASSES[tone] ?? "bg-current"}`} />}
      {icon && (
        <span aria-hidden className="flex size-4 shrink-0 items-center justify-center">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
