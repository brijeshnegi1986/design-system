/**
 * The NDS Separator (Figma "Seperator", 580:2224): a 1px line in
 * border-subtle, across or upright, or "withOR": 124px rules 8px either side
 * of a 14/20 semibold word in content-muted (the OR between sign-in options).
 */
export declare function Separator({ orientation, label, className, }: {
    orientation?: "horizontal" | "vertical";
    /** A word between two lines, e.g. "OR". */
    label?: string;
    className?: string;
}): import("react").JSX.Element;
