import { ButtonHTMLAttributes } from "react";
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "plain" | "ghost" | "danger" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";
/** A Button's classes, for a link that should look exactly like one (e.g.
 * "Add profile", which goes to a page rather than doing something). */
export declare function buttonClassName(variant?: ButtonVariant, size?: ButtonSize): string;
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
