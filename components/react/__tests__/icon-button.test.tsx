/** Icon Button (Figma 140:648): a 40px round button in the Button colours,
 * always named for screen readers. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { IconButton } from "../src/index.js";

function button(node: React.ReactElement): HTMLButtonElement {
  return new DOMParser().parseFromString(renderToStaticMarkup(node), "text/html").querySelector("button")!;
}

describe("IconButton (audit M11)", () => {
  it("is a 40px round button named by its label", () => {
    const el = button(<IconButton label="Next week" variant="tertiary"><span>›</span></IconButton>);
    expect(el.getAttribute("aria-label")).toBe("Next week");
    expect(el.className.split(" ")).toEqual(expect.arrayContaining(["size-10", "rounded-full"]));
    expect(el.getAttribute("type")).toBe("button");
  });

  it("takes the Button colours for its variant", () => {
    expect(button(<IconButton label="Delete" variant="destructive"><span /></IconButton>).className).toContain(
      "bg-(--color-action-destructive)",
    );
    expect(button(<IconButton label="Add" variant="primary"><span /></IconButton>).className).toContain(
      "bg-(--color-action-primary)",
    );
  });
});
