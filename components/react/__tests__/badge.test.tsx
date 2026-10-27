/** Badge (Figma 860:4288): a 24px pill, 12px in, caption 12/16, an
 * optional 8px dot 4px before the text, status-coloured text on the
 * status's subtle fill. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Badge } from "../src/index.js";

function badge(node: React.ReactElement): HTMLElement {
  const html = renderToStaticMarkup(node);
  return new DOMParser().parseFromString(html, "text/html").body.firstElementChild as HTMLElement;
}

describe("Badge (audit M8)", () => {
  it("is the NDS 24px pill at the caption size", () => {
    const el = badge(<Badge tone="success">Active</Badge>);
    for (const cls of ["h-6", "px-3", "rounded-full", "text-(length:--type-font-size-caption)"]) {
      expect(el.className).toContain(cls);
    }
    expect(el.textContent).toBe("Active");
  });

  it("colours the text and fill by tone", () => {
    expect(badge(<Badge tone="error">Failed</Badge>).className).toContain("text-(--color-status-error)");
    expect(badge(<Badge tone="warning">Suspended</Badge>).className).toContain("text-(--color-status-warning)");
    expect(badge(<Badge tone="info">Scheduled</Badge>).className).toContain("text-(--color-status-info)");
  });

  it("puts an 8px dot 4px before the text when asked", () => {
    const el = badge(<Badge tone="success" dot>Connected</Badge>);
    expect(el.className).toContain("gap-1");
    expect(el.querySelector("[aria-hidden]")!.className).toContain("size-2");
  });

  it("is regular weight, like the design", () => {
    expect(badge(<Badge tone="success">Active</Badge>).className).toContain("font-normal");
  });

  it("draws Neutral on action/disabled with text that follows the mode, and a muted dot", () => {
    const el = badge(<Badge tone="neutral" dot>Draft</Badge>);
    expect(el.className).toContain("bg-(--color-action-disabled)");
    expect(el.className).toContain("text-(--color-content-primary)");
    expect(el.className).not.toContain("border");
    expect(el.querySelector("[aria-hidden]")!.className).toContain("bg-(--color-content-muted)");
  });

  it("draws Highlighted in the brand's lime, 32px tall with an icon", () => {
    const el = badge(<Badge tone="highlight" icon={<svg />}>Your calendar is ready</Badge>);
    expect(el.className).toContain("bg-(--brand-color-accent-dark)");
    expect(el.className).toContain("text-(--color-content-on-accent)");
    expect(el.className).toContain("h-8");
    expect(el.querySelector("svg")!.parentElement!.className).toContain("size-4");
  });
});
