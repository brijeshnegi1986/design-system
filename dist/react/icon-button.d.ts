import type { ButtonHTMLAttributes, ReactNode } from "react";
import { type ButtonVariant } from "./button.js";
export type IconButtonVariant = Extract<ButtonVariant, "primary" | "secondary" | "tertiary" | "destructive">;
/**
 * The NDS Icon Button (Figma "Icon Button", 140:648): a 40px round button
 * holding one 20px icon, in the Button colours (primary, secondary,
 * tertiary, destructive) with their hover, pressed, disabled and focus
 * states. `label` is required: it's the button's only name for screen
 * readers, and its tooltip.
 */
export declare function IconButton({ label, variant, className, children, ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
    label: string;
    variant?: IconButtonVariant;
    children: ReactNode;
}): import("react").JSX.Element;
