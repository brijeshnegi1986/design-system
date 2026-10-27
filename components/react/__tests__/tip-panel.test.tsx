/** TipPanel: tips beside a task, on the tip surface, as a named aside. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TipPanel } from "../src/index.js";

function aside(live?: boolean) {
  const html = renderToStaticMarkup(
    <TipPanel label="Usage tips" live={live}>
      <p>One idea is one AI post.</p>
    </TipPanel>,
  );
  return new DOMParser().parseFromString(html, "text/html").querySelector("aside")!;
}

describe("TipPanel", () => {
  it("is a named aside on the tip surface and border", () => {
    const el = aside();
    expect(el.getAttribute("aria-label")).toBe("Usage tips");
    expect(el.className).toContain("bg-(--color-surface-tip)");
    expect(el.className).toContain("border-(--color-border-tip)");
    expect(el.hasAttribute("aria-live")).toBe(false);
  });

  it("announces changes when it's live", () => {
    expect(aside(true).getAttribute("aria-live")).toBe("polite");
  });
});
