import { jsx as _jsx } from "react/jsx-runtime";
import { buttonLookClassName } from "./button.js";
/** Figma's sizes: MD 48px, SM 40px, XSM 36px. The caller's icon is 24px at
 * MD, 20px at SM and 16px at XSM (Figma icon-size/md, sm, xsm). */
const SIZE_CLASSES = {
    md: "size-12",
    sm: "size-10",
    xsm: "size-9",
};
/**
 * The NDS Icon Button (Figma "Icon Button", 140:648): a round button
 * holding one icon, in the Button colours (primary, secondary,
 * tertiary, destructive) with their hover, pressed, disabled and focus
 * states. `label` is required: it's the button's only name for screen
 * readers, and its tooltip.
 */
export function IconButton({ label, variant = "tertiary", size = "sm", className = "", children, ...props }) {
    return (_jsx("button", { type: "button", "aria-label": label, title: label, ...props, className: `${buttonLookClassName(variant)} ${SIZE_CLASSES[size]} shrink-0 p-0 ${className}`.trim(), children: children }));
}
