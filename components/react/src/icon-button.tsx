import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonLookClassName, type ButtonVariant } from "./button.js";
import { Tooltip, type TooltipPlacement } from "./tooltip.js";

export type IconButtonVariant = Extract<ButtonVariant, "primary" | "secondary" | "tertiary" | "destructive">;
export type IconButtonSize = "md" | "sm" | "xsm";

/** Figma's sizes: MD 48px, SM 40px, XSM 36px. The caller's icon is 24px at
 * MD, 20px at SM and 16px at XSM (Figma icon-size/md, sm, xsm). */
const SIZE_CLASSES: Record<IconButtonSize, string> = {
  md: "size-12",
  sm: "size-10",
  xsm: "size-9",
};

/**
 * The NDS Icon Button (Figma "Icon Button", 140:648): a round button
 * holding one icon, in the Button colours (primary, secondary,
 * tertiary, destructive) with their hover, pressed, disabled and focus
 * states. `label` is required: it's the button's only name for screen
 * readers, and its tooltip (the NDS Tooltip, on hover and keyboard focus).
 */
export function IconButton({
  label,
  variant = "tertiary",
  size = "sm",
  className = "",
  tooltipPlacement = "top",
  children,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  label: string;
  /** Where the tooltip opens; "top" unless that's off the edge. */
  tooltipPlacement?: TooltipPlacement;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  children: ReactNode;
}) {
  return (
    <Tooltip label={label} placement={tooltipPlacement}>
      <button
        type="button"
        aria-label={label}
        {...props}
        className={`${buttonLookClassName(variant)} ${SIZE_CLASSES[size]} shrink-0 p-0 ${className}`.trim()}
      >
        {children}
      </button>
    </Tooltip>
  );
}
