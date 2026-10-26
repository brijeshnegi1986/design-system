/** Dialog: a named modal whose close button is the NDS Icon Button. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Dialog } from "../src/index.js";

describe("Dialog (audit M11)", () => {
  it("closes with an Icon Button carrying the close icon and the focus ring", () => {
    const html = renderToStaticMarkup(
      <Dialog open onClose={() => {}} title="Delete this draft?">
        Gone for good.
      </Dialog>,
    );
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect(doc.querySelector('[role="dialog"]')!.getAttribute("aria-label")).toBe("Delete this draft?");
    const close = doc.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!;
    expect(close.className).toContain("size-10");
    expect(close.className).toContain("focus-visible:outline-(--color-border-focus)");
    expect(close.querySelector('[data-icon="close"]')).not.toBeNull();
  });
});
