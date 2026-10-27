/** The NDS chip (Figma 641:1505): SM 30, MD 36, LG 44 at least; a long
 * label wraps and the chip grows rather than spilling over its neighbours;
 * a one-letter option is never narrower than it is tall; selected is the
 * pressed grey with the orange tick at every size. */
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
  it("is at least 30px at SM, 36px at MD and 44px at LG, never narrower than tall", () => {
    expect(chip("sm").className.split(" ")).toEqual(expect.arrayContaining(["min-h-7.5", "min-w-7.5"]));
    expect(chip("md").className.split(" ")).toEqual(expect.arrayContaining(["min-h-9", "min-w-9"]));
    expect(chip("lg").className.split(" ")).toEqual(expect.arrayContaining(["min-h-11", "min-w-11"]));
  });

  it("lets a long label wrap and grow the chip instead of overflowing it", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const classes = chip(size).className.split(" ");
      expect(classes.some((c) => /^h-\d/.test(c))).toBe(false);
      expect(classes).toEqual(expect.arrayContaining(["max-w-full", "text-left"]));
    }
  });

  it("shows the pressed grey and the orange tick when selected, at every size", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const el = chip(size, true);
      expect(el.className).toContain("bg-(--color-action-tertiary-pressed)");
      expect(el.querySelector('[data-icon="check"]')).not.toBeNull();
      expect(el.getAttribute("aria-pressed")).toBe("true");
    }
  });

  it("is a plain action button as a suggestion chip, with no on/off state", () => {
    const html = renderToStaticMarkup(<Chip onClick={() => {}}>Sourdough baking</Chip>);
    const el = new DOMParser().parseFromString(html, "text/html").querySelector("button")!;
    expect(el.hasAttribute("aria-pressed")).toBe(false);
    expect(el.querySelector('[data-icon="check"]')).toBeNull();
    expect(el.textContent).toBe("Sourdough baking");
  });

  it("stays a toggle when told whether it's selected", () => {
    expect(chip("sm", false).getAttribute("aria-pressed")).toBe("false");
  });
});
