/** SidePanel: a summary beside the main content, on the raised grey. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SidePanel } from "../src/index.js";

const aside = (node: React.ReactElement) =>
  new DOMParser().parseFromString(renderToStaticMarkup(node), "text/html").querySelector("aside")!;

describe("SidePanel", () => {
  it("is an aside on the raised grey, with no edge or shadow", () => {
    const el = aside(<SidePanel label="Your brand">x</SidePanel>);
    expect(el.getAttribute("aria-label")).toBe("Your brand");
    expect(el.className).toContain("bg-(--color-surface-raised)");
    expect(el.className).not.toMatch(/\bborder\b|shadow/);
  });

  it("can be named by its own heading instead", () => {
    const el = aside(
      <SidePanel labelledBy="trial-title">
        <h2 id="trial-title">Your free trial</h2>
      </SidePanel>,
    );
    expect(el.getAttribute("aria-labelledby")).toBe("trial-title");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });
});
