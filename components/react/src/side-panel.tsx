"use client";

import type { ReactNode } from "react";

/** A chevron pointing the way the handle moves the panel. */
function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`size-5 ${direction === "left" ? "rotate-180" : ""}`} fill="none">
      <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const HANDLE =
  "flex size-10 shrink-0 items-center justify-center rounded-full text-(--color-content-secondary) transition-colors hover:bg-(--color-surface-default) hover:text-(--color-content-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)";

/**
 * A summary or secondary navigation beside a page's main content (Figma
 * "Side panel", page 35): a profile's steps and who it writes as, the free
 * trial's progress next to the setup checklist, a post's AI review. The
 * sidebar's raised grey with no edge or shadow, so it reads as secondary to
 * the white card being worked on rather than competing with it. Inside it,
 * a current item is white, like the sidebar's active item.
 *
 * Its partner is TipPanel (the aqua tip surface), for help and tips. Pick by
 * what it says: help is a TipPanel, a summary or navigation is a SidePanel.
 *
 * An <aside> named by `label`, or by a heading inside it via `labelledBy`.
 *
 * `collapse` lets people push it in and pull it out (a preview beside a
 * form, a tray beside a calendar). It then shows its own header: `label` as
 * the title and a 40px handle. Pushed in, it's a 48px strip with the handle
 * and the name on wide screens (xl), and a one-line "Show …" bar below that.
 * The page keeps the open/closed state (and may remember it).
 */
export function SidePanel({
  label,
  labelledBy,
  className = "",
  collapse,
  children,
}: {
  label?: string;
  labelledBy?: string;
  className?: string;
  collapse?: {
    open: boolean;
    onToggle: () => void;
    /** Which edge it sits on: the handle points that way to push it in. */
    side: "left" | "right";
    /** The id of the content it hides, for aria-controls. */
    controls?: string;
  };
  children: ReactNode;
}) {
  if (!collapse) {
    return (
      <aside
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        className={`flex flex-col gap-5 rounded-(--radius-lg) bg-(--color-surface-raised) p-6 ${className}`.trim()}
      >
        {children}
      </aside>
    );
  }

  const { open, onToggle, side, controls } = collapse;
  const name = label ?? "";
  // Pushing in moves it toward its own edge; pulling out, away from it.
  const pushIn = side;
  const pullOut = side === "right" ? "left" : "right";

  if (!open) {
    return (
      <aside
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        data-state="collapsed"
        className={`flex items-center gap-2 rounded-(--radius-lg) bg-(--color-surface-raised) p-1.5 xl:w-12 xl:flex-col xl:self-stretch xl:py-3 ${className}`.trim()}
      >
        <button
          type="button"
          aria-expanded={false}
          aria-controls={controls}
          aria-label={`Show ${name}`}
          title={`Show ${name}`}
          onClick={onToggle}
          className={HANDLE}
        >
          <Chevron direction={pullOut} />
        </button>
        <span aria-hidden className="text-sm font-medium text-(--color-content-secondary) xl:[writing-mode:vertical-rl]">
          {name}
        </span>
      </aside>
    );
  }

  return (
    <aside
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      data-state="expanded"
      className={`flex flex-col gap-5 rounded-(--radius-lg) bg-(--color-surface-raised) p-6 ${className}`.trim()}
    >
      <div className="-my-2 flex items-center justify-between gap-2">
        <h2 id={labelledBy} className="text-base font-semibold text-(--color-content-primary)">{name}</h2>
        <button
          type="button"
          aria-expanded
          aria-controls={controls}
          aria-label={`Hide ${name}`}
          title={`Hide ${name}`}
          onClick={onToggle}
          className={`${HANDLE} -mr-2`}
        >
          <Chevron direction={pushIn} />
        </button>
      </div>
      <div id={controls} className="flex flex-col gap-5">
        {children}
      </div>
    </aside>
  );
}
