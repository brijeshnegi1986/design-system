/** Separator (Figma 580:2224): a 1px line, horizontal or vertical, or a
 * line with a word in the middle ("OR"). */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Separator } from "../src/index.js";

function el(node: React.ReactElement): HTMLElement {
  return new DOMParser().parseFromString(renderToStaticMarkup(node), "text/html").body.firstElementChild as HTMLElement;
}

describe("Separator", () => {
  it("is a horizontal separator by default", () => {
    const s = el(<Separator />);
    expect(s.getAttribute("role")).toBe("separator");
    expect(s.className).toContain("h-px");
  });

  it("can stand upright", () => {
    const s = el(<Separator orientation="vertical" />);
    expect(s.getAttribute("aria-orientation")).toBe("vertical");
    expect(s.className).toContain("w-px");
  });

  it("can carry a word between two lines", () => {
    const s = el(<Separator label="OR" />);
    expect(s.textContent).toBe("OR");
    const lines = s.querySelectorAll('[data-part="line"]');
    expect(lines).toHaveLength(2);
    // Figma "withOR" (567:921): 124px rules 8px either side of a 14/20 semibold word.
    expect(lines[0].className).toContain("w-31");
    expect(s.className).toContain("gap-2");
    expect(s.querySelector("span:not([data-part])")!.className).toContain("font-semibold");
  });
});
