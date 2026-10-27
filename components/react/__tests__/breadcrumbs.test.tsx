/** Breadcrumbs (Figma 140:719): caption 12/16, the current page marked. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Breadcrumbs } from "../src/index.js";

describe("Breadcrumbs (audit L10)", () => {
  it("sets the trail at the NDS caption size and marks the current page", () => {
    const html = renderToStaticMarkup(<Breadcrumbs items={[{ label: "Settings", href: "/settings" }, { label: "Profiles" }]} />);
    expect(html).toContain("text-(length:--type-font-size-caption)");
    expect(html).toContain("leading-(--type-line-height-caption)");
    expect(html).toContain('aria-current="page"');
  });

  it("has a 14px size for a header bar, with the current page in medium weight", () => {
    const html = renderToStaticMarkup(
      <Breadcrumbs size="md" items={[{ label: "Settings", href: "/settings" }, { label: "Billing" }]} />,
    );
    expect(html).toContain("text-(length:--type-font-size-body-small)");
    expect(html).toMatch(/font-medium[^>]*aria-current="page"[^>]*>Billing/);
    expect(html).toContain("text-(--color-content-secondary)");
  });
});
