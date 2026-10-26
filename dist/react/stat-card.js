import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "./badge.js";
import { CARD_BASE_CLASS } from "./card.js";
/**
 * The NDS Stat card (Figma "Stat card", 893:113): one number and what it
 * counts, for dashboards, usage against a plan and admin analytics. The label
 * (14/20 medium, secondary) sits on top with an optional 36px icon tile at
 * the right, the value below it (32/40 semibold, tabular figures), then a
 * caption (12/16, muted). `trend` adds a Positive (up) or Negative (down)
 * badge with the change before the caption - pass `good: false` when going
 * up is bad news (say, failed posts). `meter` adds a bar under the value for
 * usage against a limit; it turns to the warning colour once the limit is
 * reached.
 */
export function StatCard({ label, value, caption, trend, meter, icon, className = "", }) {
    const positive = trend ? (trend.good ?? trend.direction === "up") : false;
    return (_jsxs("div", { className: `${CARD_BASE_CLASS} flex min-w-0 flex-col gap-2 p-6 ${className}`.trim(), children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { "data-part": "label", className: "min-w-0 flex-1 text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small) font-medium text-(--color-content-secondary)", children: label }), icon && (_jsx("span", { "data-part": "icon", "aria-hidden": true, className: "flex size-9 shrink-0 items-center justify-center rounded-(--radius-md) bg-(--color-surface-raised) text-(--color-content-secondary)", children: icon }))] }), _jsx("p", { "data-part": "value", className: "text-(length:--type-font-size-h2) leading-(--type-line-height-h2) font-semibold text-(--color-content-primary) tabular-nums", children: value }), meter && meter.max > 0 && (_jsx("div", { role: "progressbar", "aria-label": typeof label === "string" ? label : undefined, "aria-valuemin": 0, "aria-valuemax": meter.max, "aria-valuenow": meter.value, className: "h-1.5 w-full overflow-hidden rounded-full bg-(--color-surface-raised)", children: _jsx("div", { "data-part": "meter", className: `h-full rounded-full ${meter.value >= meter.max ? "bg-(--color-status-warning)" : "bg-(--color-action-primary)"}`, style: { width: `${Math.min(100, Math.round((meter.value / meter.max) * 100))}%` } }) })), (trend || caption) && (_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [trend && (_jsxs(Badge, { tone: positive ? "success" : "error", children: [_jsx("span", { className: "sr-only", children: trend.direction === "up" ? "Up " : "Down " }), trend.label] })), caption && (_jsx("p", { "data-part": "caption", className: "text-(length:--type-font-size-caption) leading-(--type-line-height-caption) text-(--color-content-muted)", children: caption }))] }))] }));
}
