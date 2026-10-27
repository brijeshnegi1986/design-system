import { ButtonHTMLAttributes } from "react";
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "plain" | "ghost" | "danger" | "destructive";
export type ButtonSize = "xsm" | "sm" | "md" | "lg";
/** A Button's classes, for a link that should look exactly like one (e.g.
 * "Add profile", which goes to a page rather than doing something). */
export declare function buttonClassName(variant?: ButtonVariant, size?: ButtonSize): string;
/** A Button's look without its size: the shape, label, focus ring, colours
 * and disabled state (IconButton adds its own 40px square). */
export declare function buttonLookClassName(variant?: ButtonVariant, { solidDestructive }?: {
    solidDestructive?: boolean;
}): string;
/**
 * Callers pairing a label with an icon put both as children: the 8px gap
 * spaces them (flexbox drops a literal space between "Label <span>icon").
 * `loading` is the design's Loading state: a spinner before the label, and
 * the button busy and disabled until it's done.
 */
export declare function Button({ variant, size, loading, className, disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
}): import("react").JSX.Element;
