/**
 * The NDS Separator (Figma "Seperator", 580:2224): a 1px line in
 * border-subtle, across or upright, or "withOR": 124px rules 8px either side
 * of a 14/20 semibold word in content-muted (the OR between sign-in options).
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
      <div role="separator" className={`flex items-center justify-center gap-2 ${className}`.trim()}>
        <span data-part="line" aria-hidden className="h-px w-31 shrink bg-(--color-border-subtle)" />
        <span className="text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) font-semibold tracking-[0.056px] text-(--color-content-muted)">
          {label}
        </span>
        <span data-part="line" aria-hidden className="h-px w-31 shrink bg-(--color-border-subtle)" />
      </div>
    );
  }
  return orientation === "vertical" ? (
    <div role="separator" aria-orientation="vertical" className={`w-px self-stretch bg-(--color-border-subtle) ${className}`.trim()} />
  ) : (
    <div role="separator" className={`h-px w-full bg-(--color-border-subtle) ${className}`.trim()} />
  );
}
