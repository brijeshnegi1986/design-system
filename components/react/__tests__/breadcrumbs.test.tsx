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
});
