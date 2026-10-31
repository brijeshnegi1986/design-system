"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type ActionMenuItem = {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  /** "danger" for a destructive action (red text). */
  tone?: "default" | "danger";
  /** A 20px icon before the label (a channel's logo). */
  icon?: ReactNode;
};

/**
 * A row's "⋯" menu of actions (an admin table's Edit, Set up, Archive): one
 * 32px icon button that opens a short list, so a row shows one control
 * instead of four. Named by `label` ("Actions for Growth"). Opening focuses
 * the first action; the arrow keys move, Escape or a click elsewhere closes,
 * and focus goes back to the button. Running an action closes the menu.
 *
 * `kind="add"` makes it an Add button instead: a 44px dashed round "+" (a
 * row of channel toggles' "+ Add channel"), whose menu opens to the right.
 */
export function ActionMenu({
  label,
  items,
  kind = "more",
  className = "",
}: {
  label: string;
  items: ActionMenuItem[];
  kind?: "more" | "add";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuId = useId();

  function close(refocus: boolean) {
    setOpen(false);
    if (refocus) button.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLButtonElement>("[role='menuitem']:not(:disabled)")?.focus();
    const outside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!menu.current?.contains(target) && !button.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  function onKeyDown(event: React.KeyboardEvent) {
    const all = [...(menu.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']:not(:disabled)") ?? [])];
    const at = all.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      all[(at + step + all.length) % all.length]?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className={`relative inline-block ${className}`.trim()}>
      <button
        ref={button}
        type="button"
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-center rounded-full text-(--color-content-secondary) transition-colors hover:bg-(--color-action-tertiary-hover) hover:text-(--color-content-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus) ${
          kind === "add" ? "size-11 border border-dashed border-(--color-border-subtle)" : "size-8"
        }`}
      >
        {kind === "add" ? (
          <svg data-part="plus" aria-hidden viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M10 4v12M4 10h12" />
          </svg>
        ) : (
          <svg aria-hidden viewBox="0 0 20 20" className="size-5" fill="currentColor">
            <circle cx="4.5" cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="15.5" cy="10" r="1.5" />
          </svg>
        )}
      </button>
      {open && (
        <div
          ref={menu}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onKeyDown}
          className={`absolute ${kind === "add" ? "left-0" : "right-0"} z-30 mt-1 flex min-w-44 flex-col rounded-(--radius-lg) border border-(--color-border-subtle) bg-(--color-surface-default) p-1 shadow-[0_var(--elevation-lg)_24px_rgb(0_0_0/0.16)]`}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                close(true);
                item.onSelect();
              }}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-(--color-action-tertiary-hover) focus-visible:bg-(--color-action-tertiary-hover) focus-visible:outline-none disabled:cursor-not-allowed disabled:text-(--color-content-disabled) disabled:hover:bg-transparent ${
                item.tone === "danger" ? "text-(--color-status-error)" : "text-(--color-content-primary)"
              }`}
            >
              {item.icon && (
                <span aria-hidden className="inline-flex shrink-0">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
