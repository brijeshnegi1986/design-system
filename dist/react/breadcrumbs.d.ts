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
/** NDS "Breadcrumbs" (Figma 140:719): a caption 12/16 trail, muted links,
 * the current page in the primary text colour, 16px chevrons 8px apart. */
export declare function Breadcrumbs({ items, linkAs: LinkAs, }: {
    items: {
        label: string;
        href?: string;
    }[];
    linkAs?: LinkComponent;
}): import("react").JSX.Element;
export { PlainLink };
