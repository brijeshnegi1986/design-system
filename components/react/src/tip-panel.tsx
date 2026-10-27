import type { ReactNode } from "react";

/**
 * Tips and help beside a task (Connectors' "Before you connect", a Settings
 * page's help column): the tip surface, the brand's aqua (color/surface/tip
 * and color/border/tip), so it reads as guidance rather than one more card
 * to act on. A 16px corner and 24px in, no shadow. A summary or navigation
 * beside the content (not help) is a SidePanel instead. An <aside> named by
 * `label`; `live` announces it when its content changes with what's picked.
 */
export function TipPanel({
  label,
  live = false,
  className = "",
  children,
}: {
  label: string;
  live?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <aside
      aria-label={label}
      aria-live={live ? "polite" : undefined}
      className={`flex flex-col gap-4 rounded-2xl border border-(--color-border-tip) bg-(--color-surface-tip) p-6 ${className}`.trim()}
    >
      {children}
    </aside>
  );
}
