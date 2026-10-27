import type { ComponentType, ReactNode } from "react";
import { iconMask } from "./icons.js";

/** A link component: a plain <a> by default, or the app's router link
 * (e.g. Next.js `Link`) so moving between pages stays client-side. */
export type LinkComponent = ComponentType<{ href: string; className?: string; children?: ReactNode }>;

function PlainLink({ href, className, children }: { href: string; className?: string; children?: ReactNode }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

/** NDS "Breadcrumbs" (Figma 140:719): a trail of muted links, the current
 * page in the primary text colour, 16px chevrons 8px apart.
 * - sm: caption 12/16, for inside a page (the design's default).
 * - md: body small 14/20, for a page header bar, where 12px reads as
 *   lost; links in the secondary colour and the current page medium. */
export function Breadcrumbs({
  items,
  linkAs: LinkAs = PlainLink,
  size = "sm",
}: {
  items: { label: string; href?: string }[];
  linkAs?: LinkComponent;
  size?: "sm" | "md";
}) {
  const md = size === "md";
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={`flex flex-wrap items-center gap-2 ${
          md
            ? "h-8 text-(length:--type-font-size-body-small) leading-(--type-line-height-body-small)"
            : "h-7 text-(length:--type-font-size-caption) leading-(--type-line-height-caption)"
        }`}
      >
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !last ? (
                <LinkAs
                  href={item.href}
                  className={`${md ? "text-(--color-content-secondary)" : "text-(--color-content-muted)"} hover:text-(--color-content-primary) hover:underline`}
                >
                  {item.label}
                </LinkAs>
              ) : (
                <span className={`text-(--color-content-primary) ${md ? "font-medium" : ""}`} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden className="inline-block size-4 bg-current text-(--color-content-muted)" style={iconMask("chevron-forward")} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { PlainLink };
