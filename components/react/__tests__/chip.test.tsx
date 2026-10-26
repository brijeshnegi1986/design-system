/** The NDS chip (Figma 641:1505): SM 30, MD 36, LG 44; a one-letter option
 * is never narrower than it is tall; selected is the pressed grey with the
 * orange tick at every size. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Chip } from "../src/index.js";

function chip(size: "sm" | "md" | "lg", selected = false) {
  const html = renderToStaticMarkup(
    <Chip selected={selected} onClick={() => {}} size={size}>
      I
    </Chip>,
  );
  return new DOMParser().parseFromString(html, "text/html").querySelector("button")!;
}

describe("Chip (audit M3)", () => {
  it("is 36px at MD and 44px at LG, never narrower than tall", () => {
    expect(chip("md").className.split(" ")).toEqual(expect.arrayContaining(["h-9", "min-w-9"]));
    expect(chip("lg").className.split(" ")).toEqual(expect.arrayContaining(["h-11", "min-w-11"]));
  });

  it("shows the pressed grey and the orange tick when selected, at every size", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const el = chip(size, true);
      expect(el.className).toContain("bg-(--color-action-secondary-pressed)");
      expect(el.querySelector('[data-icon="check"]')).not.toBeNull();
      expect(el.getAttribute("aria-pressed")).toBe("true");
    }
  });
});
