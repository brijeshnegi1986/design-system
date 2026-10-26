/**
 * A loading placeholder block - respects prefers-reduced-motion by falling
 * back to a static tint instead of a pulse (see globals.css). Used by
 * app/loading.tsx and anywhere a page needs to show shape before real data
 * arrives, instead of a blank screen.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-md bg-(--color-border-subtle)/60 motion-reduce:animate-none ${className}`}
    />
  );
}
