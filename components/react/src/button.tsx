import { ButtonHTMLAttributes } from "react";
import { iconMask } from "./icons.js";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "plain" | "ghost" | "danger" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * The NDS Button (Figma "Button", node 105:885). Every boxed variant shares
 * the size, the label (14/20 semibold, 0.056px tracking), the 8px gap to an
 * icon, the disabled look (action-disabled fill, border-disabled edge,
 * content-disabled text) and the 2px border-focus ring, 2px out.
 *
 * - primary: the orange call to action, kept for the few that start
 *   something: Create post / Generate post, Sign in and sign-up, and buying
 *   (Start trial, a plan). Never for an ordinary Save or Continue.
 * - secondary: near-black, the action button: a form's or page's main
 *   action (Save, Continue, Approve, Publish), at MD unless it sits in a
 *   compact row. Colours are --color-button-secondary-* in globals.css.
 * - tertiary: the light, outlined button for everything else (Back,
 *   Cancel, Edit).
 * - plain: orange text, no fill or border.
 * - ghost: an orange outline on white.
 * - destructive: filled red, only for the confirm step of a destructive
 *   action; the trigger that opens that confirmation uses `danger`, a
 *   red text link (not in the design: an inline "Delete" link).
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-(--color-action-primary) text-(--color-content-on-primary) hover:bg-(--color-action-primary-hover) active:bg-(--color-action-primary-pressed)",
  secondary:
    "border border-(--color-border-subtle) bg-(--color-button-secondary) text-(--color-on-button-secondary) hover:bg-(--color-button-secondary-hover) active:bg-(--color-button-secondary-pressed)",
  tertiary:
    "border border-(--color-border-subtle) bg-(--color-action-secondary) text-(--color-content-on-secondary) hover:bg-(--color-action-secondary-hover) active:bg-(--color-action-secondary-pressed)",
  plain:
    "text-(--color-action-primary) hover:bg-(--color-action-secondary-hover) hover:text-(--color-action-primary-hover) active:bg-(--color-action-secondary-pressed) active:text-(--color-action-primary-pressed)",
  ghost:
    "border border-(--color-border-primary) bg-(--color-surface-default) text-(--color-action-primary) hover:bg-(--color-action-secondary-hover) active:bg-(--color-action-secondary-pressed)",
  destructive:
    "border border-(--color-border-error) bg-(--color-action-destructive) text-(--color-content-on-destructive) hover:bg-(--color-action-destructive-hover) active:bg-(--color-action-destructive-pressed)",
  danger: "text-(--color-status-error) hover:underline disabled:opacity-60",
};

/** The NDS disabled state, for the boxed variants; Plain has no fill to
 * grey out, so only its text goes to the disabled colour. */
const BOXED_DISABLED =
  "disabled:border-(--color-border-disabled) disabled:bg-(--color-action-disabled) disabled:text-(--color-content-disabled)";
const PLAIN_DISABLED = "disabled:text-(--color-content-disabled) disabled:hover:bg-transparent disabled:active:bg-transparent";

/** The design's sizes: SM 40px, MD 48px, LG 56px, each with its own padding. */
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-10 px-3",
  md: "h-12 px-4",
  lg: "h-14 px-6",
};

/** The red text link keeps the padding it always had. */
const TEXT_ONLY_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-5 text-base",
};

/** The design's progress_activity icon, drawn in the label's colour. */
function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block size-5 shrink-0 animate-spin bg-current"
      style={{
        ...iconMask("progress-activity"),
      }}
    />
  );
}

/** A Button's classes, for a link that should look exactly like one (e.g.
 * "Add profile", which goes to a page rather than doing something). */
export function buttonClassName(variant: ButtonVariant = "primary", size: ButtonSize = "md"): string {
  const sized = variant === "danger" ? TEXT_ONLY_SIZE_CLASSES[size] : SIZE_CLASSES[size];
  return `${buttonLookClassName(variant)} ${sized}`;
}

/** A Button's look without its size: the shape, label, focus ring, colours
 * and disabled state (IconButton adds its own 40px square). */
export function buttonLookClassName(variant: ButtonVariant = "primary"): string {
  const boxed =
    variant === "danger"
      ? ""
      : `rounded-full transition-colors font-semibold tracking-[0.056px] text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus) ${variant === "plain" ? PLAIN_DISABLED : BOXED_DISABLED}`;
  return `inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed ${variant === "danger" ? "font-medium" : ""} ${boxed} ${VARIANT_CLASSES[variant]}`
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Callers pairing a label with an icon put both as children: the 8px gap
 * spaces them (flexbox drops a literal space between "Label <span>icon").
 * `loading` is the design's Loading state: a spinner before the label, and
 * the button busy and disabled until it's done.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean }) {
  return (
    <button
      type="button"
      className={`${buttonClassName(variant, size)} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
