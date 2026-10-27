import type { ComponentType, ReactNode } from "react";
/** A link component: a plain <a> by default, or the app's router link
 * (e.g. Next.js `Link`) so moving between pages stays client-side. */
export type LinkComponent = ComponentType<{
    href: string;
    className?: string;
    children?: ReactNode;
}>;
declare function PlainLink({ href, className, children }: {
    href: string;
    className?: string;
    children?: ReactNode;
}): import("react").JSX.Element;
/** NDS "Breadcrumbs" (Figma 140:719): a trail of muted links, the current
 * page in the primary text colour, 16px chevrons 8px apart.
 * - sm: caption 12/16, for inside a page (the design's default).
 * - md: body small 14/20, for a page header bar, where 12px reads as
 *   lost; links in the secondary colour and the current page medium. */
export declare function Breadcrumbs({ items, linkAs: LinkAs, size, }: {
    items: {
        label: string;
        href?: string;
    }[];
    linkAs?: LinkComponent;
    size?: "sm" | "md";
}): import("react").JSX.Element;
export { PlainLink };
