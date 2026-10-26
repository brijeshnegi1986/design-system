/**
 * The NDS Separator (Figma "Seperator", 580:2224): a 1px line in
 * border-subtle, across or upright, or two lines with a word between them
 * (the "OR" between sign-in options), in the caption size.
 */
export function Separator({
  orientation = "horizontal",
  label,
  className = "",
}: {
  orientation?: "horizontal" | "vertical";
  /** A word between two lines, e.g. "OR". */
  label?: string;
  className?: string;
}) {
  if (label) {
    return (
      <div role="separator" className={`flex w-full items-center gap-3 ${className}`.trim()}>
        <span data-part="line" aria-hidden className="h-px flex-1 bg-(--color-border-subtle)" />
        <span className="text-(length:--type-font-size-caption) leading-(--type-line-height-caption) font-medium text-(--color-content-muted)">
          {label}
        </span>
        <span data-part="line" aria-hidden className="h-px flex-1 bg-(--color-border-subtle)" />
      </div>
    );
  }
  return orientation === "vertical" ? (
    <div role="separator" aria-orientation="vertical" className={`w-px self-stretch bg-(--color-border-subtle) ${className}`.trim()} />
  ) : (
    <div role="separator" className={`h-px w-full bg-(--color-border-subtle) ${className}`.trim()} />
  );
}
