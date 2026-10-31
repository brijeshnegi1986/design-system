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
export function ChannelToggle({ icon, label, detail, selected, onChange, count = 1, flag, disabled = false, size = "md", }) {
    return (_jsx(Tooltip, { label: detail, children: _jsxs("button", { type: "button", "aria-label": flag ? `${label}, ${flag}` : label, "aria-pressed": selected, disabled: disabled, onClick: () => onChange(!selected), className: `relative flex ${size === "sm" ? "size-9" : "size-11"} shrink-0 items-center justify-center rounded-full bg-(--color-surface-default) transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus) disabled:cursor-not-allowed disabled:opacity-50 ${selected
                ? "border-[1.5px] border-(--color-status-success)"
                : "border border-(--color-border-subtle) hover:bg-(--color-action-tertiary-hover)"}`, children: [_jsx("span", { "aria-hidden": true, className: `inline-flex transition-opacity ${selected ? "" : "opacity-60"}`, children: icon }), selected && (_jsx("span", { "data-part": "tick", "aria-hidden": true, className: "absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-(--color-status-success) text-(--color-content-inverse) ring-2 ring-(--color-surface-default)", children: _jsx("span", { className: "size-3 bg-current", style: iconMask("check") }) })), count > 1 && (_jsx("span", { "data-part": "count", "aria-hidden": true, className: "absolute -right-1 -bottom-1 min-w-4.5 rounded-full bg-(--color-surface-inverse) px-1 text-center text-[10px] leading-4.5 font-semibold text-(--color-content-inverse) ring-2 ring-(--color-surface-default)", children: count })), flag && (_jsx("span", { "data-part": "flag", "aria-hidden": true, className: "absolute -bottom-0.5 -left-0.5 size-3 rounded-full bg-(--color-status-warning) ring-2 ring-(--color-surface-default)" }))] }) }));
}
/**
 * A channel not connected yet, beside the ChannelToggles: the same 44px round
 * logo in its own brand colours, just faded (half opacity, a dashed edge) with
 * a small "+", so the row shows every channel. It looks off but isn't disabled: choosing it starts connecting.
 * `label` names what it does ("Connect Threads") and is also its tooltip.
 */
export function ChannelConnect({ icon, label, onClick, }) {
    return (_jsx(Tooltip, { label: label, children: _jsxs("button", { type: "button", "aria-label": label, onClick: onClick, className: "relative flex size-11 shrink-0 items-center justify-center rounded-full border border-dashed border-(--color-border-subtle) bg-(--color-surface-default) transition-colors hover:bg-(--color-action-tertiary-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)", children: [_jsx("span", { "data-part": "logo", "aria-hidden": true, className: "inline-flex opacity-50", children: icon }), _jsx("span", { "data-part": "plus", "aria-hidden": true, className: "absolute -right-1 -bottom-1 flex size-4.5 items-center justify-center rounded-full bg-(--color-surface-default) text-(--color-content-secondary) ring-1 ring-(--color-border-subtle)", children: _jsx("svg", { viewBox: "0 0 20 20", className: "size-3", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", children: _jsx("path", { d: "M10 4v12M4 10h12" }) }) })] }) }));
}
