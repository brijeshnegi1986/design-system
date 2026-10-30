"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** A chevron pointing the way the handle moves the panel. */
function Chevron({ direction }) {
    return (_jsx("svg", { "aria-hidden": true, viewBox: "0 0 20 20", className: `size-5 ${direction === "left" ? "rotate-180" : ""}`, fill: "none", children: _jsx("path", { d: "M8 5l5 5-5 5", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
const HANDLE = "flex size-10 shrink-0 items-center justify-center rounded-full text-(--color-content-secondary) transition-colors hover:bg-(--color-surface-default) hover:text-(--color-content-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)";
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
export function SidePanel({ label, labelledBy, className = "", collapse, children, }) {
    if (!collapse) {
        return (_jsx("aside", { "aria-label": labelledBy ? undefined : label, "aria-labelledby": labelledBy, className: `flex flex-col gap-5 rounded-(--radius-lg) bg-(--color-surface-raised) p-6 ${className}`.trim(), children: children }));
    }
    const { open, onToggle, side, controls } = collapse;
    const name = label ?? "";
    // Pushing in moves it toward its own edge; pulling out, away from it.
    const pushIn = side;
    const pullOut = side === "right" ? "left" : "right";
    if (!open) {
        return (_jsxs("aside", { "aria-label": labelledBy ? undefined : label, "aria-labelledby": labelledBy, "data-state": "collapsed", className: `flex items-center gap-2 rounded-(--radius-lg) bg-(--color-surface-raised) p-1.5 xl:w-12 xl:flex-col xl:self-stretch xl:py-3 ${className}`.trim(), children: [_jsx("button", { type: "button", "aria-expanded": false, "aria-controls": controls, "aria-label": `Show ${name}`, title: `Show ${name}`, onClick: onToggle, className: HANDLE, children: _jsx(Chevron, { direction: pullOut }) }), _jsx("span", { "aria-hidden": true, className: "text-sm font-medium text-(--color-content-secondary) xl:[writing-mode:vertical-rl]", children: name })] }));
    }
    return (_jsxs("aside", { "aria-label": labelledBy ? undefined : label, "aria-labelledby": labelledBy, "data-state": "expanded", className: `flex flex-col gap-5 rounded-(--radius-lg) bg-(--color-surface-raised) p-6 ${className}`.trim(), children: [_jsxs("div", { className: "-my-2 flex items-center justify-between gap-2", children: [_jsx("h2", { className: "text-base font-semibold text-(--color-content-primary)", children: name }), _jsx("button", { type: "button", "aria-expanded": true, "aria-controls": controls, "aria-label": `Hide ${name}`, title: `Hide ${name}`, onClick: onToggle, className: `${HANDLE} -mr-2`, children: _jsx(Chevron, { direction: pushIn }) })] }), _jsx("div", { id: controls, className: "flex flex-col gap-5", children: children })] }));
}
