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

/** NDS "Breadcrumbs" (Figma 140:719): a caption 12/16 trail, muted links,
 * the current page in the primary text colour, 16px chevrons 8px apart. */
export function Breadcrumbs({
  items,
  linkAs: LinkAs = PlainLink,
}: {
  items: { label: string; href?: string }[];
  linkAs?: LinkComponent;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex h-7 flex-wrap items-center gap-2 text-(length:--type-font-size-caption) leading-(--type-line-height-caption)">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !last ? (
                <LinkAs href={item.href} className="text-(--color-content-muted) hover:text-(--color-content-primary) hover:underline">
                  {item.label}
                </LinkAs>
              ) : (
                <span className="text-(--color-content-primary)" aria-current={last ? "page" : undefined}>
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
