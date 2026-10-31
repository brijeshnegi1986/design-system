"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { iconMask } from "./icons.js";
import { Tooltip } from "./tooltip.js";
/**
 * One channel in a "Post to" row: the channel's logo as a 44px round toggle,
 * so a row of five or six channels stays tidy. Its account (`detail`) shows in
 * the NDS tooltip on hover and keyboard focus; the page should also name the
 * chosen accounts in a line under the row, since a phone can't hover.
 *
 * - Selected: a success ring and a tick at the top right (not colour alone);
 *   unselected, the logo is dimmed.
 * - `count` of 2 or more: a small count at the bottom right (two Pages).
 * - `flag` ("needs an image"): a warning dot at the bottom left, and the
 *   words in the button's name.
 *
 * `label` is the button's accessible name ("Facebook, Negiflow (Page)"); the
 * tooltip is hidden from screen readers, so the name carries the account.
 */
export function ChannelToggle({ icon, label, detail, selected, onChange, count = 1, flag, disabled = false, }) {
    return (_jsx(Tooltip, { label: detail, children: _jsxs("button", { type: "button", "aria-label": flag ? `${label}, ${flag}` : label, "aria-pressed": selected, disabled: disabled, onClick: () => onChange(!selected), className: `relative flex size-11 shrink-0 items-center justify-center rounded-full border bg-(--color-surface-default) transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus) disabled:cursor-not-allowed disabled:opacity-50 ${selected
                ? "border-(--color-status-success) ring-2 ring-(--color-status-success)"
                : "border-(--color-border-subtle) hover:bg-(--color-action-tertiary-hover)"}`, children: [_jsx("span", { "aria-hidden": true, className: `inline-flex transition-opacity ${selected ? "" : "opacity-60"}`, children: icon }), selected && (_jsx("span", { "data-part": "tick", "aria-hidden": true, className: "absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-(--color-status-success) text-(--color-content-inverse) ring-2 ring-(--color-surface-default)", children: _jsx("span", { className: "size-3 bg-current", style: iconMask("check") }) })), count > 1 && (_jsx("span", { "data-part": "count", "aria-hidden": true, className: "absolute -right-1 -bottom-1 min-w-4.5 rounded-full bg-(--color-surface-inverse) px-1 text-center text-[10px] leading-4.5 font-semibold text-(--color-content-inverse) ring-2 ring-(--color-surface-default)", children: count })), flag && (_jsx("span", { "data-part": "flag", "aria-hidden": true, className: "absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-(--color-status-warning) ring-2 ring-(--color-surface-default)" }))] }) }));
}
