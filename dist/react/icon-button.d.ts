import type { ButtonHTMLAttributes, ReactNode } from "react";
import { type ButtonVariant } from "./button.js";
export type IconButtonVariant = Extract<ButtonVariant, "primary" | "secondary" | "tertiary" | "destructive">;
export type IconButtonSize = "md" | "sm" | "xsm";
/**
 * The NDS Icon Button (Figma "Icon Button", 140:648): a round button
 * holding one icon, in the Button colours (primary, secondary,
 * tertiary, destructive) with their hover, pressed, disabled and focus
 * states. `label` is required: it's the button's only name for screen
 * readers, and its tooltip.
 */
export declare function IconButton({ label, variant, size, className, children, ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
    label: string;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    children: ReactNode;
}): import("react").JSX.Element;
