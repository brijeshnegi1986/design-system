"use client";

import type { ReactNode } from "react";
import { iconMask } from "./icons.js";
import { Tooltip } from "./tooltip.js";

/**
 * One channel in a "Post to" row: the channel's logo as a 44px round toggle,
 * so a row of five or six channels stays tidy. Its account (`detail`) shows in
 * the NDS tooltip on hover and keyboard focus; the page should also name the
 * chosen accounts in a line under the row, since a phone can't hover.
 *
 * - Selected: a thin success edge and a tick at the top right (not colour
 *   alone); unselected, the logo is dimmed.
 * - `count` of 2 or more: a small count at the bottom right (two Pages).
 * - `flag` ("needs an image"): a warning dot at the bottom left, and the
 *   words in the button's name.
 *
 * `label` is the button's accessible name ("Facebook, Negiflow (Page)"); the
 * tooltip is hidden from screen readers, so the name carries the account.
 * `size="sm"` is 36px, for toolbars beside compact menus (a calendar filter).
 */
export function ChannelToggle({
  icon,
  label,
  detail,
  selected,
  onChange,
  count = 1,
  flag,
  disabled = false,
  size = "md",
}: {
  /** The channel's logo, about 22px. */
  icon: ReactNode;
  label: string;
  /** What the tooltip says: the channel and its account(s). */
  detail: string;
  selected: boolean;
  onChange: (selected: boolean) => void;
  count?: number;
  flag?: string;
  disabled?: boolean;
  size?: "md" | "sm";
}) {
  return (
    <Tooltip label={detail}>
      <button
        type="button"
        aria-label={flag ? `${label}, ${flag}` : label}
        aria-pressed={selected}
        disabled={disabled}
        onClick={() => onChange(!selected)}
        className={`relative flex ${size === "sm" ? "size-9" : "size-11"} shrink-0 items-center justify-center rounded-full bg-(--color-surface-default) transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus) disabled:cursor-not-allowed disabled:opacity-50 ${
          selected
            ? "border-[1.5px] border-(--color-status-success)"
            : "border border-(--color-border-subtle) hover:bg-(--color-action-tertiary-hover)"
        }`}
      >
        <span aria-hidden className={`inline-flex transition-opacity ${selected ? "" : "opacity-60"}`}>
          {icon}
        </span>
        {selected && (
          <span
            data-part="tick"
            aria-hidden
            className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-(--color-status-success) text-(--color-content-inverse) ring-2 ring-(--color-surface-default)"
          >
            <span className="size-3 bg-current" style={iconMask("check")} />
          </span>
        )}
        {count > 1 && (
          <span
            data-part="count"
            aria-hidden
            className="absolute -right-1 -bottom-1 min-w-4.5 rounded-full bg-(--color-surface-inverse) px-1 text-center text-[10px] leading-4.5 font-semibold text-(--color-content-inverse) ring-2 ring-(--color-surface-default)"
          >
            {count}
          </span>
        )}
        {flag && (
          <span
            data-part="flag"
            aria-hidden
            className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-(--color-status-warning) ring-2 ring-(--color-surface-default)"
          />
        )}
      </button>
    </Tooltip>
  );
}

/**
 * A channel not connected yet, beside the ChannelToggles: the same 44px round
 * logo, faded (greyed, a dashed edge) with a small "+", so the row shows every
 * channel. It looks off but isn't disabled: choosing it starts connecting.
 * `label` names what it does ("Connect Threads") and is also its tooltip.
 */
export function ChannelConnect({
  icon,
  label,
  onClick,
}: {
  /** The channel's logo, about 22px. */
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-dashed border-(--color-border-subtle) bg-(--color-surface-default) transition-colors hover:bg-(--color-action-tertiary-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)"
      >
        <span data-part="logo" aria-hidden className="inline-flex opacity-60 grayscale">
          {icon}
        </span>
        <span
          data-part="plus"
          aria-hidden
          className="absolute -right-1 -bottom-1 flex size-4.5 items-center justify-center rounded-full bg-(--color-surface-default) text-(--color-content-secondary) ring-1 ring-(--color-border-subtle)"
        >
          <svg viewBox="0 0 20 20" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M10 4v12M4 10h12" />
          </svg>
        </span>
      </button>
    </Tooltip>
  );
}

