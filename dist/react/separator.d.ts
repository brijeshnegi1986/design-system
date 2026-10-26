/**
 * The NDS Separator (Figma "Seperator", 580:2224): a 1px line in
 * border-subtle, across or upright, or two lines with a word between them
 * (the "OR" between sign-in options), in the caption size.
 */
export declare function Separator({ orientation, label, className, }: {
    orientation?: "horizontal" | "vertical";
    /** A word between two lines, e.g. "OR". */
    label?: string;
    className?: string;
}): import("react").JSX.Element;
