/** Tag: a content label, neutral and outlined, with an optional icon. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Tag } from "../src/index.js";

const el = (node: React.ReactElement) =>
  new DOMParser().parseFromString(renderToStaticMarkup(node), "text/html").body.firstElementChild as HTMLElement;

describe("Tag", () => {
  it("is a 24px outlined neutral pill at the caption size, regular weight", () => {
    const tag = el(<Tag>#AutumnBaking</Tag>);
    for (const cls of ["h-6", "px-2", "border", "border-(--color-border-subtle)", "bg-(--color-surface-raised)", "text-(length:--type-font-size-caption)"]) {
      expect(tag.className).toContain(cls);
    }
    expect(tag.className).not.toMatch(/font-(medium|semibold)/);
    expect(tag.textContent).toBe("#AutumnBaking");
  });

  it("puts a 16px icon before the text, hidden from screen readers", () => {
    const tag = el(<Tag icon={<svg />}>Harbour Lane Bakery</Tag>);
    const icon = tag.querySelector("svg")!.parentElement!;
    expect(icon.className).toContain("size-4");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  it("cuts a long label short instead of overflowing", () => {
    expect(el(<Tag>A very long label</Tag>).querySelector(".truncate")).not.toBeNull();
  });
});
