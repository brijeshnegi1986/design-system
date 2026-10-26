import { jsx as _jsx } from "react/jsx-runtime";
import { buttonLookClassName } from "./button.js";
/**
 * The NDS Icon Button (Figma "Icon Button", 140:648): a 40px round button
 * holding one 20px icon, in the Button colours (primary, secondary,
 * tertiary, destructive) with their hover, pressed, disabled and focus
 * states. `label` is required: it's the button's only name for screen
 * readers, and its tooltip.
 */
export function IconButton({ label, variant = "tertiary", className = "", children, ...props }) {
    return (_jsx("button", { type: "button", "aria-label": label, title: label, ...props, className: `${buttonLookClassName(variant)} size-10 shrink-0 p-0 ${className}`.trim(), children: children }));
}
